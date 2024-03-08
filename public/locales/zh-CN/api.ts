import { API_KEYS } from '../keys';

export const API = {
  [API_KEYS.PUSHER_AUTH_400]: '缺少所需的参数',
  [API_KEYS.PUSHER_AUTH_401]: '密码错误',
  [API_KEYS.PUSHER_AUTH_403]: '拒绝访问',
  [API_KEYS.PUSHER_AUTH_423]: '房间已存在，请尝试其他',
  [API_KEYS.PUSHER_AUTH_500]: '未知错误',
};
