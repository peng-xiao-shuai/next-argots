import { SETTING } from './setting';
import { CHAT_ROOM } from './chat-room';
import { HOME } from './home';
import { COMMON } from './common';
import { API } from './api';

const lang = {
  ...SETTING,
  ...CHAT_ROOM,
  ...HOME,
  ...COMMON,
  ...API,
} as const;
export default lang;
