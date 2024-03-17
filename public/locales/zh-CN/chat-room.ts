import { CHAT_ROOM_KEYS, COMMON_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.SEND]: '发送',
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: '欢迎 {{name}} 加入',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} 已退出`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `房主 {{name}} 已退出，即将返回$t(${COMMON_KEYS.HOME})`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: '房主',
  [CHAT_ROOM_KEYS.DECRYPTION_FAILURE]:
    '未知问题，消息解密失败！请前往 {{origin}} 反馈问题',
};
