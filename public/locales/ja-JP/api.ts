import { API_KEYS } from '../keys';

export const API = {
  [API_KEYS.PUSHER_AUTH_400]: '必要なパラメータが不足しています',
  [API_KEYS.PUSHER_AUTH_401]: '間違ったパスワード',
  [API_KEYS.PUSHER_AUTH_403]: 'アクセス拒否です',
  [API_KEYS.PUSHER_AUTH_423]:
    'ルームはすでに存在します。別のルームをお試しください',
  [API_KEYS.PUSHER_AUTH_500]: '未知の誤りです',
};
