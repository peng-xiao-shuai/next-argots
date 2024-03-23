import crypto from 'crypto';
import axios from 'axios';
import { RoomStatus, UserRole } from '&/enum';
import { hashSync } from 'bcryptjs';
import pusher from './get-pusher';
import { AuthSuccessUserData, SigninSuccessUserData } from './pusher-type';
import { Room } from '&/payload/payload-types';
import { NextRequest } from 'next/server';
import clientPromise from '@/server/db';
import { ObjectId } from 'mongodb';

let pusherSignature: string;

/**
 * Response 对象
 */
const res = (data: Indexes, status: number) =>
  new Response(
    JSON.stringify({
      ...data,
      code: data.code || String(status),
    }),
    {
      status: 200,
    }
  );

export const pusherAuthApi = {
  /**
   * 身份验证 校验加密信息以及同房间是否存在用户名称, 标准做法应该是直接返回成功签名数据，逻辑在
   * 授权接口 API_URL.PUSHER_AUTH 中去判断
   */
  'user-auth': async (req: NextRequest) => {
    const body: Indexes = {};
    const formData = await req.formData();
    formData.forEach((item, key) => {
      body[key] = item;
    });

    const { socket_id, nickName, roomStatus, password, roomName } = body;

    if (!isPresence(body, ['nickName', 'roomName', 'roomStatus', 'password']))
      return;
    const user: SigninSuccessUserData = {
      id: socket_id,
      user_info: {
        name: nickName,
        code: '',
        message: '',
      },
    };

    try {
      /**
       * 加入房间判断是否存在同名用户
       */
      if (roomStatus === RoomStatus.JOIN) {
        const data = await requestPusherApi<{ users: { id: string }[] }>(
          `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${roomName}/users`
        );

        if (
          data &&
          data.users?.find((item: { id: string }) => item.id === nickName)
        ) {
          user.user_info.code = '403';
          user.user_info.message = 'The user name already exists';
          const authResponse = pusher.authenticateUser(socket_id, user);
          return res(authResponse, 200);
        }
      }
      /**
       * 校验
       */
      if (!diffHash(password, req.headers.get('hash') as string)) {
        user.user_info.code = '403';
        user.user_info.message = 'decryption failure';
        const authResponse = pusher.authenticateUser(socket_id, user);
        return res(authResponse, 200);
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
        },
        500
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
    const { socket_id, nickName, password, roomStatus, roomName, avatar } =
      body;
    const role =
      roomStatus === RoomStatus.ADD ? UserRole.HOUSE_OWNER : UserRole.MEMBER;
    if (!isPresence(body, ['nickName', 'password', 'roomName', 'roomStatus']))
      return;

    /**
     * 校验
     */
    if (!diffHash(password, req.headers.get('hash') as string)) {
      return res(
        {
          message: 'decryption failure',
          data: {},
        },
        403
      );
    }

    try {
      const client = await clientPromise;
      const collection = client
        .db(process.env.DATABASE_DB)
        .collection<Room>('room');
      const roomId = hashSync(
        roomName,
        '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
      );
      let iv = crypto.randomBytes(128 / 8).toString('hex');
      let room: Room;

      /**
       * 判断是否存在房间，避免非浏览器发起请求时，没有走 API_URL.GET_CHANNEL
       */
      const roomData = await collection.findOne({
        roomId: roomId,
        hash: req.headers.get('hash') || '',
      });

      if (roomStatus === RoomStatus.ADD) {
        // 房间号添加缺已经存在房间号
        if (roomData) {
          return res(
            {
              message: 'Do not create rooms',
              data: {},
            },
            423
          );
        }

        room = {
          roomId: roomId,
          iv,
          houseOwnerId: hashSync(
            nickName,
            '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
          ),
          hash: req.headers.get('hash') as string,
          id: new ObjectId().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await collection.insertOne(room);
      } else {
        /**
         * 这里只能有一个数据
         */
        if (!roomData) {
          return res(
            {
              message: 'Incorrect password',
              data: {},
            },
            401
          );
          return;
        } else {
          room = roomData;
        }
      }

      const presenceData: AuthSuccessUserData = {
        user_id: nickName,
        user_info: {
          iv: room!.iv,
          role,
          avatar,
          roomRecordId: roomStatus === RoomStatus.ADD ? room!.id : '',
          userId: nickName,
          name: nickName,
        },
      };

      const auth = pusher.authorizeChannel(
        socket_id,
        `presence-${roomName}`,
        presenceData
      );
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
   * 判断是否存在房间号
   */
  getChannel: async (req: Request) => {
    const body = req.body as Indexes;
    const { roomName } = body;

    if (!isPresence(body, ['roomName'])) return;

    // 判断是否存在同名房间号
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
        return;
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
};

type Body = {
  secret: string;
  params: { [key: string]: string | number };
  method: 'POST' | 'GET';
  path: string;
};

/**
 * 生成 pusher http 请求签名
 */
function createPusherSignature({ method, path, params, secret }: Body) {
  // 将参数按键排序并格式化为查询字符串
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => {
      return key + '=' + params[key];
    })
    .join('&');

  // 创建签名字符串
  const stringToSign = [method.toUpperCase(), path, sortedParams].join('\n');

  // 生成HMAC SHA256签名
  const signature = crypto
    .createHmac('sha256', secret)
    .update(stringToSign)
    .digest('hex');
  return signature;
}

/**
 * 发起 pusher http 请求
 */
export async function requestPusherApi<T = any>(
  path: string,
  method: 'POST' | 'GET' = 'GET'
) {
  const params: Body['params'] = {
    auth_key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    auth_timestamp: Math.floor(Date.now() / 1000),
    auth_version: '1.0',
  };

  // if (!pusherSignature) {
  // 生成签名
  pusherSignature = createPusherSignature({
    method,
    path,
    params,
    secret: process.env.PUSHER_APP_SECRET!,
  });
  // }

  // 构建完整的URL
  const queryString = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const url = `http://api-${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}.pusher.com${path}?${queryString}&auth_signature=${pusherSignature}`;

  try {
    const response = await axios.get(url);
    return response.data as T;
  } catch (error: any) {
    console.error('Error fetching:', error.message);
    throw new Error(error.message);
  }
}

/**
 * 校验header hash 字段
 */
const diffHash = (pwd: string, headerHash: string) => {
  const hash = hashSync(pwd, '$2a$10$' + process.env.NEXT_PUBLIC_SALT);

  return headerHash === hash;
};

/**
 * 判断参数是否存在
 */
const isPresence = <T, K extends keyof T>(params: T, keys: K[]) => {
  for (let k of keys) {
    if (!params[k]) {
      return res(
        {
          code: '400',
          message: `'${String(k)}' Parameter missing`,
          data: {},
        },
        400
      );
      return false;
    }
  }

  return true;
};
