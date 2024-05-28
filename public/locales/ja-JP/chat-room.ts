import { CHAT_ROOM_KEYS } from '../keys';

export const CHAT_ROOM = {
  [CHAT_ROOM_KEYS.SEND]: 'はっそうする',
  [CHAT_ROOM_KEYS.MEMBER_ADDED]: '{{name}} の加入を歓迎します',
  [CHAT_ROOM_KEYS.MEMBER_REMOVED]: `{{name}} は終了しました`,
  [CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED]: `ホストの {{name}} はログアウトしました。すぐにホームページに戻ります。`,
  [CHAT_ROOM_KEYS.HOUSE_OWNER]: '部屋のオーナー',
  [CHAT_ROOM_KEYS.DECRYPTION_FAILURE]:
    '未知の問題、メッセージの解読に失敗します! {{origin}} へのフィードバックをお願いします。',
  [CHAT_ROOM_KEYS.CONTENT_CANNOT_BE_EMPTY]: '中身を空にしてはいけません',
  [CHAT_ROOM_KEYS.SPEAK_OUT_FREELY]: '言いたいことを言います ~',
  [CHAT_ROOM_KEYS.UNCONNECTED_CHANNEL]: '未接続の部屋です',
  [CHAT_ROOM_KEYS.NO_NICKNAME]: 'ニックネームはまだありません',
  [CHAT_ROOM_KEYS.NAME_EXISTS]: 'ニックネームは既に存在します',
  [CHAT_ROOM_KEYS.INVITATION_DESCRIPTION]:
    '1つの招待リンクには1人のユーザーしか招待できません。',
  [CHAT_ROOM_KEYS.LOOK_LINKS]: '生成リンクを見ます',
  [CHAT_ROOM_KEYS.CREATE_INVITE]: '招待先を作成します',
};
