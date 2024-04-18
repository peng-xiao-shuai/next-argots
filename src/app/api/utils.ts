import axios from 'axios';
import crypto from 'crypto';

/**
 * Response 对象
 */
export const res = (data: Indexes, status: number, opts?: ResponseInit) =>
  new Response(
    JSON.stringify({
      ...data,
      code: data.code || String(status),
    }),
    {
      status: status,
      ...opts,
    }
  );

let pusherSignature: string;

/**
 * 判断是否存在同名用户
 */
export const isChannelUserExistApi = async (
  roomName: string,
  nickName: string
) => {
  const { users } = await requestPusherApi<{ users: { id: string }[] }>(
    `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${roomName}/users`
  );

  return users && users.find((item: { id: string }) => item.id === nickName);
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
