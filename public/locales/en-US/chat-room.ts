import { CHAT_ROOM_KEYS, COMMON_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: 'Welcome to {{name}}',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} has quit`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `House owner {{name}} has quit, will return to the $t(${COMMON_KEYS.HOME})`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: 'House owner',
};
