import { SETTING_KEYS } from '../keys';

export const SETTING = {
  [SETTING_KEYS.MODE_AUTO]: '自動',
  [SETTING_KEYS.CHOOSE_MANUALLY]: '手動選択',
  // TODO 值一样，需要重新翻译
  [SETTING_KEYS.DARK_MODE]: 'ダークモード',
  [SETTING_KEYS.LIGHT_MODE]: 'ダークモード',
  [SETTING_KEYS.CHAT1]:
    '下のスライダーをドラッグしてフォントサイズを変えます。',
  [SETTING_KEYS.CHAT2]:
    '設定後、チャットや設定中のフォントサイズを変更しますので、ご利用中に問題点やご意見がございましたら、ごフィードバックください。',
  [SETTING_KEYS.MODE_SWITCH]:
    '有効にすると、 PrivacyChat がシステム設定に合わせて、ダークモードのオン/オフを切り替えます',
  [SETTING_KEYS.SIZE_DEFAULT]: '标準',
  [SETTING_KEYS.FONT_PREVIEW]: 'プレビューフォント',

  [SETTING_KEYS.OPTIONAL]: 'えらべる',
  [SETTING_KEYS.I_WANT_TO]: 'あなたが欲しい',
  [SETTING_KEYS.ISSUE]: 'もんだい',
  [SETTING_KEYS.OPINION]: '意見',
  [SETTING_KEYS.CONTENT]: 'フィードバックの内容です',
  [SETTING_KEYS.E_MAIL_FORMAT_IS_INCORRECT]: `$t(${SETTING_KEYS.E_MAIL})フォーマットが正しくありません。`,
};
