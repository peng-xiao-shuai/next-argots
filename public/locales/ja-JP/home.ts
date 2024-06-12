import { HOME_KEYS } from '../keys';

export const HOME = {
  [HOME_KEYS.SELECT_ROOM]: '部屋に入ります',
  [HOME_KEYS.CREATE_ROOM]: '部屋を作ります',
  [HOME_KEYS.ROOM_NUMBER]: '部屋番号は～です',
  [HOME_KEYS.NICKNAME]: 'ニックネーム',
  [HOME_KEYS.PASSWORD]: '部屋密パスワード码',
  [HOME_KEYS.PLEASE_INPUT]: '一度入力してください',

  [HOME_KEYS.HOME_API_ROOM_NAME]: 'すみません~部屋の名前はすでに存在します!',
  [HOME_KEYS.HOME_API_NO_ROOM_NAME]:
    '申し訳ありません~部屋の名前は存在しません!',
  [HOME_KEYS.HOME_API_PASSWORD_ERROR]: 'パスワードが間違っています!',

  [HOME_KEYS.EMPTY_NICKNAME]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.NICKNAME}) お部屋のニックネームにしました`,
  [HOME_KEYS.EMPTY_PASSWORD]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.PASSWORD}) にゅうしつする`,
  [HOME_KEYS.EMPTY_ROOM_NUMBER]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.ROOM_NUMBER}) にゅうしつする`,
} as const;
