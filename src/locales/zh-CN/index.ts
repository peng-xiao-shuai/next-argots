import { SETTING } from './setting';
import { CHAT_ROOM } from './chat-room';
import { HOME } from './home';
import { COMMON } from './common';

const lang = {
  ...SETTING,
  ...CHAT_ROOM,
  ...HOME,
  ...COMMON,
};
export default lang;
