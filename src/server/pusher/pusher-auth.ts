import crypto from 'crypto';
import type { Express, Response } from 'express';
import axios from 'axios';
import { API_URL, RoomStatus, UserRole } from '../enum';
import getPayloadClient from '../payload/get-payload';
import { hashSync } from 'bcryptjs';
import pusher from './get-pusher';
import { AuthSuccessUserData, SigninSuccessUserData } from './type';
import { Room } from '../payload/payload-types';

let pusherSignature: string;

export const pusherAuthApi = (app: Express) => {
  /**
   * 身份验证 校验加密信息以及同房间是否存在用户名称, 标准做法应该是直接返回成功签名数据，逻辑在
   * 授权接口 API_URL.PUSHER_AUTH 中去判断
   */
  app.post(API_URL.PUSHER_SIGNIN, async (req, res) => {
    const { socket_id, nickName, roomStatus, password, roomName } = req.body;

    if (
      !isPresence(res, req.body, [
        'nickName',
        'roomName',
        'roomStatus',
        'password',
      ])
    )
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

          res.status(200).json(authResponse);
          return;
        }
      }
      /**
       * 校验
       */
      if (!diffHash(password, req.headers['hash'] as string)) {
        user.user_info.code = '403';
        user.user_info.message = 'decryption failure';
        const authResponse = pusher.authenticateUser(socket_id, user);
        res.status(200).json(authResponse);
        return;
      }

      user.user_info.code = '200';
      user.user_info.message = '';
      const authResponse = pusher.authenticateUser(socket_id, user);
      res.status(200).json(authResponse);
    } catch (error: any) {
      console.log(error);

      res.status(500).json({
        code: '500',
        message: error?.message || 'UNKNOWN ERROR',
        data: {},
      });
    }
  });

  /**
   * 授权连接
   */
  app.post(API_URL.PUSHER_AUTH, async (req, res) => {
    const { socket_id, nickName, password, roomStatus, roomName } = req.body;
    const role =
      roomStatus === RoomStatus.ADD ? UserRole.HOUSE_OWNER : UserRole.MEMBER;
    if (
      !isPresence(res, req.body, [
        'nickName',
        'password',
        'roomName',
        'roomStatus',
      ])
    )
      return;

    /**
     * 校验
     */
    if (!diffHash(password, req.headers['hash'] as string)) {
      res.status(403).json({
        code: '403',
        message: 'decryption failure',
        data: {},
      });
      return;
    }

    try {
      const payload = await getPayloadClient();
      const roomId = hashSync(
        roomName,
        '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
      );
      let iv = crypto.randomBytes(128 / 8).toString('hex');
      let room: Room;

      /**
       * 判断是否存在房间，避免非浏览器发起请求时，没有走 API_URL.GET_CHANNEL
       */
      const { docs: roomList } = await payload.find({
        collection: 'room',
        context: {
          role,
        },
        where: {
          roomId: { equals: roomId },
          hash: { equals: req.headers['hash'] },
        },
      });

      if (roomStatus === RoomStatus.ADD) {
        // 房间号添加缺已经存在房间号
        if (roomList.length) {
          res.status(423).json({
            code: '423',
            message: 'Do not create rooms',
            data: {},
          });
          return;
        }

        room = await payload.create({
          collection: 'room',
          context: {
            role,
          },
          data: {
            roomId: roomId,
            iv,
            houseOwnerId: hashSync(
              nickName,
              '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
            ),
            hash: req.headers['hash'] as string,
          },
        });
      } else {
        /**
         * 这里只能有一个数据
         */
        if (!roomList.length) {
          res.status(401).json({
            code: '401',
            message: 'Incorrect password',
            data: {},
          });
          return;
        } else {
          room = roomList[0];
        }
      }

      const presenceData: AuthSuccessUserData = {
        user_id: nickName,
        user_info: {
          iv: room!.iv,
          role,
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
      res.status(200).json(auth);
    } catch (error: any) {
      console.log(error);

      res.status(500).json({
        code: '500',
        message: error?.message || 'UNKNOWN ERROR',
        data: {},
      });
    }
  });

  /**
   * 判断是否存在房间号
   */
  app.post(API_URL.GET_CHANNEL, async (req, res) => {
    const { roomName } = req.body;

    if (!isPresence(res, req.body, ['roomName'])) return;

    // 判断是否存在同名房间号
    try {
      const data = await requestPusherApi(
        `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${roomName}`
      );

      if (data && data.occupied) {
        res.status(200).json({
          code: '200',
          message: 'The room number already exists',
          data: {
            isRoom: true,
          },
        });
        return;
      }

      res.status(200).json({
        code: '200',
        message: '',
        data: {
          isRoom: false,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        code: '500',
        message: error?.message || 'UNKNOWN ERROR',
        data: {},
      });
    }
  });
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
const isPresence = <T, K extends keyof T>(
  res: Response,
  params: T,
  keys: K[]
) => {
  for (let k of keys) {
    if (!params[k]) {
      res.status(400).json({
        code: '400',
        message: `'${String(k)}' Parameter missing`,
        data: {},
      });
      return false;
    }
  }

  return true;
};
