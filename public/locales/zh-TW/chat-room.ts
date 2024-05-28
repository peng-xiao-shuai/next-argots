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
  [CHAT_ROOM_KEYS.UNCONNECTED_CHANNEL]: '未連接頻道',
  [CHAT_ROOM_KEYS.NO_NICKNAME]: '暫無暱稱',
  [CHAT_ROOM_KEYS.NAME_EXISTS]: '暱稱已經存在',
  [CHAT_ROOM_KEYS.INVITATION_DESCRIPTION]:
    '每一個邀請鏈接只能邀請一個用戶，邀請成功之後無效',
  [CHAT_ROOM_KEYS.LOOK_LINKS]: '查看生成鏈接',
  [CHAT_ROOM_KEYS.CREATE_INVITE]: '生成邀請地址',
};
