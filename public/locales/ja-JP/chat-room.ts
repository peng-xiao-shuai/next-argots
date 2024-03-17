import { CHAT_ROOM_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.SEND]: 'はっそうする',
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: '{{name}} の加入を歓迎します',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} は終了しました`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `ホストの {{name}} はログアウトしました。すぐにホームページに戻ります。`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: '部屋のオーナー',
  [CHAT_ROOM_KEYS.DECRYPTION_FAILURE]:
    '未知の問題、メッセージの解読に失敗します! {{origin}} へのフィードバックをお願いします。',
};
