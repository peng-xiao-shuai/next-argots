import { CHAT_ROOM_KEYS, COMMON_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.SEND]: '發送',
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: '歡迎 {{name}} 加入',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} 已退出`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `房主 {{name}} 已退出，即將返回$t(${COMMON_KEYS.HOME})`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: '房主',
};
