import crypto from 'crypto';
import { API_URL, RoomStatus, UserRole } from '&/enum';
import { hashSync } from 'bcryptjs';
import pusher from './get-pusher';
import { AuthSuccessUserData, SigninSuccessUserData } from './pusher-type';
import { Room } from '@/server/payload/payload-types';
import { NextRequest } from 'next/server';
import { diffHash, isPresence } from '@/utils/server-utils';
import {
  createPusherSignature,
  isChannelUserExistApi,
  requestPusherApi,
  res,
} from '../../utils';
import type { AvatarName } from '@/components';
import payloadPromise from '@/server/payload/get-payload';

interface BaseData {
  roomStatus: RoomStatus;
  reconnection: 'true' | 'false';
  nickName: string;
  roomName: string;
  avatar: AvatarName;
  [s: string]: string | undefined;
}

interface AddJoinData extends BaseData {
  roomStatus: RoomStatus.JOIN | RoomStatus.ADD;
  password: string;
  pwdHash: string;
  [s: string]: string;
}

interface LinkJoinData extends BaseData {
  roomStatus: RoomStatus.LINK_JOIN;
  hash: string;
  roomId: string;
  [s: string]: string;
}

type BODY = {
  socket_id: string;
  /**
   * AddJoinData | LinkJoinData 类型的 json 字符串
   */
  data: string;
  hash: string;
} & Indexes;

export const pusherAuthApi = {
  /**
   * 身份验证 校验加密信息以及同频道是否存在用户名称, 标准做法应该是直接返回成功签名数据，逻辑在
   * 授权接口 API_URL.PUSHER_AUTH 中去判断
   */
  'user-auth': async (req: NextRequest) => {
    const body: Indexes = {};
    const formData = await req.formData();
    formData.forEach((item, key) => {
      body[key] = item;
    });

    const { socket_id, hash } = body as BODY;
    const data = JSON.parse(body.data) as AddJoinData | LinkJoinData;

    const _hash = createPusherSignature({
      method: 'POST',
      path: API_URL.PUSHER_SIGNIN,
      params: data,
      secret: process.env.NEXT_PUBLIC_SALT!,
    });

    /**
     * 校验数据完整性
     */
    if (_hash !== hash) {
      const authResponse = pusher.authenticateUser(socket_id, {
        id: socket_id,
        user_info: {
          code: '403',
          message: 'decryption failure',
        },
      });
      return res(authResponse, 200);
    }

    const { nickName, roomStatus, password, roomName, reconnection, pwdHash } =
      data;

    const user: SigninSuccessUserData = {
      id: socket_id,
      user_info: {
        name: nickName,
        code: '',
        message: '',
      },
    };

    /**
     * 如果是 LINK_JOIN 并且存在 hash 那么就直接加入
     */
    if (roomStatus === RoomStatus.LINK_JOIN) {
      user.user_info.code = '200';
      const authResponse = pusher.authenticateUser(socket_id, user);
      return res(authResponse, 200);
    }

    /**
     * 参数校验
     */
    const paramsCheck = isPresence(data, [
      'nickName',
      'password',
      'pwdHash',
      'roomName',
      'roomStatus',
      'reconnection',
    ]);
    if (typeof paramsCheck !== 'boolean') {
      return res(paramsCheck, 400);
    }

    try {
      /**
       * 校验
       */
      if (!diffHash(password!, pwdHash)) {
        user.user_info.code = '403';
        user.user_info.message = 'decryption failure';
        const authResponse = pusher.authenticateUser(socket_id, user);
        return res(authResponse, 200);
      }

      /**
       * 加入频道判断是否存在同名用户
       */
      if (roomStatus === RoomStatus.JOIN && reconnection === 'false') {
        const isUser = await isChannelUserExistApi(roomName, nickName);

        if (isUser) {
          user.user_info.code = '403';
          user.user_info.message = 'The user name already exists';
          const authResponse = pusher.authenticateUser(socket_id, user);
          return res(authResponse, 200);
        }
      }

      user.user_info.code = '200';
      user.user_info.message = '';
      const authResponse = pusher.authenticateUser(socket_id, user);
      return res(authResponse, 200);
    } catch (error: any) {
      console.log(error);
      return res(
        {
          message: error?.message || 'UNKNOWN ERROR',
          data: {},
          code: '500',
        },
        200
      );
    }
  },

  /**
   * 授权连接
   */
  auth: async (req: Request) => {
    const body: Indexes = {};
    const formData = await req.formData();
    formData.forEach((item, key) => {
      body[key] = item;
    });
    const {
      socket_id,
      channel_name: channel,
      hash: dataHash,
    } = body as BODY & {
      channel_name: string;
    };
    const data = JSON.parse(body.data) as AddJoinData | LinkJoinData;

    const _hash = createPusherSignature({
      method: 'POST',
      path: API_URL.PUSHER_AUTH,
      params: data,
      secret: process.env.NEXT_PUBLIC_SALT!,
    });

    /**
     * 校验数据完整性
     */
    if (_hash !== dataHash) {
      return res(
        {
          message: 'decryption failure',
          data: {},
        },
        403
      );
    }

    const {
      nickName,
      password,
      roomStatus,
      roomName,
      pwdHash,
      avatar,
      hash,
      reconnection,
      roomId: _roomId,
    } = data;

    /**
     * 使用 密码加频道号组成id，避免某种情况下 pusher 没有 roomName 数据库集合中存在 roomName 导致无法创建房间
     * 只有在某种情况下 pusher 没有 roomName 而数据库集合中存在 roomName 并且输入的密码和集合中一致时才无法创建
     */
    let roomId: string = '';

    /**
     * 如果是 LINK_JOIN 并且存在 hash 那么就直接加入
     */
    if (roomStatus === RoomStatus.LINK_JOIN && hash) {
      roomId = _roomId!;
    } else {
      /**
       * 参数校验
       */
      const paramsCheck = isPresence(data, [
        'nickName',
        'password',
        'pwdHash',
        'roomName',
        'roomStatus',
        'reconnection',
      ]);
      if (typeof paramsCheck !== 'boolean') {
        return res(paramsCheck, 400);
      }

      /**
       * 校验
       */
      if (!diffHash(password!, pwdHash)) {
        return res(
          {
            message: 'decryption failure',
            data: {},
          },
          403
        );
      }

      roomId = hashSync(roomName + password, process.env.NEXT_PUBLIC_SALT!);
    }

    const role =
      roomStatus === RoomStatus.ADD ? UserRole.HOUSE_OWNER : UserRole.MEMBER;

    try {
      const payload = await payloadPromise;

      let iv = crypto.randomBytes(128 / 8).toString('hex');
      let room: Room;

      /**
       * 判断是否存在频道，避免非浏览器发起请求时，没有走 API_URL.GET_CHANNEL
       */
      const { docs: roomData } = await payload.find({
        collection: 'rooms',
        where: {
          roomId: { equals: roomId },
          hash: { equals: pwdHash || '' },
        },
      });

      if (roomStatus === RoomStatus.ADD && reconnection === 'false') {
        // 频道号添加却已经存在频道号
        if (roomData.length) {
          return res(
            {
              message: 'Do not create rooms',
              data: {},
            },
            423
          );
        }

        room = await payload.create({
          collection: 'rooms',
          data: {
            roomId,
            iv,
            houseOwnerId: hashSync(nickName, process.env.NEXT_PUBLIC_SALT!),
            hash: pwdHash,
            channel: 'presence-' + roomName,
          },
        });
      } else {
        /**
         * 这里只能有一个数据
         */
        if (!roomData.length) {
          return res(
            {
              message: 'Incorrect password',
              data: {},
            },
            401
          );
        } else {
          room = roomData[0];
        }
      }

      const presenceData: AuthSuccessUserData = {
        user_id: nickName,
        user_info: {
          iv: room!.iv,
          role,
          avatar,
          reconnection,
          socket_id,
          roomRecordId: roomStatus === RoomStatus.ADD ? room!.id : '',
          userId: nickName,
          nickname: nickName,
        },
      };

      const auth = pusher.authorizeChannel(socket_id, channel, presenceData);
      return res(auth, 200);
    } catch (error: any) {
      console.log(error);
      return res(
        {
          message: error?.message || 'UNKNOWN ERROR',
          data: {},
        },
        500
      );
    }
  },

  /**
   * 判断是否存在频道号
   */
  getChannel: async (req: Request) => {
    const body = (await req.json()) as Indexes;
    const { roomName } = body;
    /**
     * 参数校验
     */
    const paramsCheck = isPresence(body, ['roomName']);
    if (typeof paramsCheck !== 'boolean') {
      return res(paramsCheck, 400);
    }

    // 判断是否存在同名频道号
    try {
      const data = await requestPusherApi(
        `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${roomName}`
      );

      if (data && data.occupied) {
        return res(
          {
            message: 'The room number already exists',
            data: {
              isRoom: true,
            },
          },
          200
        );
      }

      return res(
        {
          code: '200',
          message: '',
          data: {
            isRoom: false,
          },
        },
        200
      );
    } catch (error: any) {
      return res(
        {
          message: error?.message || 'UNKNOWN ERROR',
          data: {},
        },
        500
      );
    }
  },

  /**
   * 判断是否存在同用户名称
   */
  checkNickName: async (req: Request) => {
    const body = (await req.json()) as Indexes;
    const { roomName, nickName } = body;
    /**
     * 参数校验
     */
    const paramsCheck = isPresence(body, ['roomName', 'nickName']);
    if (typeof paramsCheck !== 'boolean') {
      return res(paramsCheck, 400);
    }

    try {
      const isUser = await isChannelUserExistApi(roomName, nickName);

      if (isUser) {
        return res(
          {
            data: true,
            message: `The user name already exists`,
            code: '400',
          },
          200
        );
      }

      return res(
        {
          data: false,
          message: ``,
          code: '200',
        },
        200
      );
    } catch (error: any) {
      return res(
        {
          message: error?.message || 'UNKNOWN ERROR',
          data: {},
        },
        500
      );
    }
  },
};
