import { API_KEYS } from '../keys';

export const API = {
  [API_KEYS.PUSHER_AUTH_400]: '缺少所需參數',
  [API_KEYS.PUSHER_AUTH_401]: '密碼錯誤',
  [API_KEYS.PUSHER_AUTH_403]: '拒絕訪問',
  [API_KEYS.PUSHER_AUTH_423]: '頻道已存在，請嘗試其他',
  [API_KEYS.PUSHER_AUTH_500]: '未知錯誤',
};
