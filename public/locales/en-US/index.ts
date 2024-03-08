import { SETTING } from './setting';
import { HOME } from './home';
import { CHAT_ROOM } from './chat-room';

const lang = {
  ...CHAT_ROOM,
  ...SETTING,
  ...HOME,
};
export default lang;
