import { CHAT_ROOM_KEYS, COMMON_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.SEND]: '發送',
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: '歡迎 {{name}} 加入',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} 已退出`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `頻道主 {{name}} 已退出，即將返回$t(${COMMON_KEYS.HOME})`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: '頻道主',
  [CHAT_ROOM_KEYS.DECRYPTION_FAILURE]:
    '未知問題，消息解密失敗！請前往 {{origin}} 反饋問題',
  [CHAT_ROOM_KEYS.CONTENT_CANNOT_BE_EMPTY]: '內容不能為空',
  [CHAT_ROOM_KEYS.SPEAK_OUT_FREELY]: '暢所欲言吧~',
};
