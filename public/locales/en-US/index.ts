import { SETTING } from './setting';
import { HOME } from './home';
import { CHAT_ROOM } from './chat-room';
import { COMMON } from './common';

const lang = {
  ...CHAT_ROOM,
  ...SETTING,
  ...HOME,
  ...COMMON,
};
export default lang;
