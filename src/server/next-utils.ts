import next from 'next';
import crypto from 'crypto';
import type { Express } from 'express';
import type Pusher from 'pusher';
import axios from 'axios';
import { API_URL } from './enum';

const PORT = Number(process.env.PORT) || 3000;
let pusherSignature: string;

// 创建 Next.js 应用实例
export const nextApp = next({
  dev: process.env.NODE_ENV !== 'production',
  port: PORT,
});

// 获取 Next.js 请求处理器。用于处理传入的 HTTP 请求，并根据 Next.js 应用的路由来响应这些请求。
export const nextRequestHandler = nextApp.getRequestHandler();

export const pusherAuth = (app: Express, pusher: Pusher) => {
  app.post(API_URL.PUSHER_SIGNIN, (req, res) => {
    const { socket_id, nickName, passWord, roomName } = req.body;

    // Replace this with code to retrieve the actual user id and info
    const user = {
      id: socket_id,
      user_info: {
        name: nickName,
      },
    };
    const authResponse = pusher.authenticateUser(socket_id, user);
    res.status(200).json(authResponse);
  });

  app.post(API_URL.PUSHER_AUTH, async (req, res) => {
    const { socket_id, nickName, passWord, roomName } = req.body;

    if (!roomName) {
      res.status(400).json({
        code: '400',
        message: '`roomName` Parameter missing',
        data: {},
      });
      return;
    }

    // 判断是否存在同名用户
    try {
      const data = await requestPusherApi(
        `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${roomName}/users`
      );
      if (
        data &&
        data.users?.find((item: { id: string }) => item.id === nickName)
      ) {
        res.status(403).json({
          code: '403',
          message: 'The user name already exists',
          data: {},
        });
        return;
      }

      const presenceData = {
        user_id: nickName,
        user_info: {
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

    if (!roomName) {
      res.status(400).json({
        code: '400',
        message: '`roomName` Parameter missing',
        data: {},
      });
      return;
    }

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
export async function requestPusherApi(
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
    return response.data;
  } catch (error: any) {
    console.error('Error fetching:', error.message);
    throw new Error(error.message);
  }
}
