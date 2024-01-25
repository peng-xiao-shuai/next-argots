import KEYS from './keys'

// layout 语言配置
export default {
  [KEYS.SELECT_ROOM]: '部屋に入ります',
  [KEYS.CREATE_ROOM]: '部屋を作ります',
  [KEYS.ROOM_NUMBER]: '部屋番号は～です',
  [KEYS.NICKNAME]: 'ニックネーム',
  [KEYS.PASSWORD]: '部屋密パスワード码',
  [KEYS.PLEASE_INPUT]: '一度入力してください',

  [KEYS.HOME_API]: {
    [KEYS.ROOM_NAME]: 'すみません~部屋の名前はすでに存在します!',
    [KEYS.NO_ROOM_NAME]: '申し訳ありません~部屋の名前は存在しません!',
    [KEYS.PASSWORD_ERROR]: 'パスワードが間違っています!',
  },

  [KEYS.EMPTY_NICKNAME]: `@:${KEYS.PLEASE_INPUT}@:${KEYS.NICKNAME}お部屋のニックネームにしました`,
  [KEYS.EMPTY_PASSWORD]: `@:${KEYS.PLEASE_INPUT}@:${KEYS.PASSWORD}にゅうしつする`,
  [KEYS.EMPTY_ROOM_NUMBER]: `@:${KEYS.PLEASE_INPUT}@:${KEYS.ROOM_NUMBER}にゅうしつする`,
}
