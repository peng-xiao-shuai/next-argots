import { COMMON_KEYS, META } from '../keys';

export const COMMON = {
  [COMMON_KEYS.HOME]: 'しょおもて',
  [COMMON_KEYS.CHAT]: '雑談',
  [COMMON_KEYS.SETTINGS]: 'せっち',
  [COMMON_KEYS.DARK_PATTERN]: 'ダークモード',
  [COMMON_KEYS.TEXT_SIZE]: '文字サイズです',
  [COMMON_KEYS.MULTI_LANGUAGE]: '言語',
  [COMMON_KEYS.ABOUT]: '僕らについて',
  [COMMON_KEYS.FEEDBACK]: 'フィードバックです',
  [COMMON_KEYS.CHECK_FOR_UPDATES]: '更新をチェックし',
  [COMMON_KEYS.PRIVACY_POLICY]: 'プライバシーポリシーです',
  [COMMON_KEYS['E-MAIL_CONTACT']]: 'メールで連絡します',

  [COMMON_KEYS.CLOSE]: '閉まる',
  [COMMON_KEYS.OPEN]: 'だかい ',
  [COMMON_KEYS.CONFIRM]: 'かくにん',
  [COMMON_KEYS.COMPLETE]: '完了',
  [COMMON_KEYS.SUCCESSFULLY_SET]: '修正成功です',

  [COMMON_KEYS.SHARE]: '裾分け',
  [COMMON_KEYS.NO_DATA]: '仮無数の根拠です',

  [COMMON_KEYS.REPLY]: 'メッセージを返信します。',
  [COMMON_KEYS.EDIT]: '編集する',
  [COMMON_KEYS.COPY_TEXT]: '文字を複製します',
  [COMMON_KEYS.DELETE]: 'メッセージを削除します',
  [COMMON_KEYS.SELECT]: 'このメッセージを選択します',

  [META.DESC]:
    '自由なチャットプラットフォームで、すべての会話を暗号化して、あなたの安全なプライバシーを保護します。あなたの情報を収集することはなく、あなたの権限を必要としません。チャット終了後にすべての記録を消去します。',
  [META.KEYWORDS]:
    'おしゃべりをします 部屋 暗号化されています 権限がありません オープンチャットです えんどつーえんど',
} as const;
