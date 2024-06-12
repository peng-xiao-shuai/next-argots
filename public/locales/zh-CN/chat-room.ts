import { CHAT_ROOM_KEYS, COMMON_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.SEND]: '发送',
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: '欢迎 {{name}} 加入',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} 已退出`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `频道主 {{name}} 已退出，即将返回$t(${COMMON_KEYS.HOME})`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: '频道主',
  [CHAT_ROOM_KEYS.DECRYPTION_FAILURE]:
    '未知问题，消息解密失败！请前往 {{origin}} 反馈问题',
  [CHAT_ROOM_KEYS.CONTENT_CANNOT_BE_EMPTY]: '内容不能为空',
  [CHAT_ROOM_KEYS.SPEAK_OUT_FREELY]: '畅所欲言吧~',
  [CHAT_ROOM_KEYS.UNCONNECTED_CHANNEL]: '未连接频道',
  [CHAT_ROOM_KEYS.NO_NICKNAME]: '暂无昵称',
  [CHAT_ROOM_KEYS.NAME_EXISTS]: '昵称已经存在',
  [CHAT_ROOM_KEYS.INVITATION_DESCRIPTION]:
    '每个邀请链接只能邀请一个用户，邀请成功之后无效',
  [CHAT_ROOM_KEYS.LOOK_LINKS]: '查看生成链接',
  [CHAT_ROOM_KEYS.CREATE_INVITE]: '生成邀请地址',

  [CHAT_ROOM_KEYS.NAV_TITLE_NO_NETWORK]: '网络已断开',
  [CHAT_ROOM_KEYS.NAV_TITLE_CONNECT_UNAVAILABLE]: '链接暂时不可用',
} as const;
