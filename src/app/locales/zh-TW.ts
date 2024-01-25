import KEYS from './keys'

// layout 语言配置
export default {
  [KEYS.SELECT_ROOM]: '加入房間',
  [KEYS.CREATE_ROOM]: '創建房間',
  [KEYS.ROOM_NUMBER]: '房間號',
  [KEYS.NICKNAME]: '暱稱',
  [KEYS.PASSWORD]: '房間密碼',
  [KEYS.PLEASE_INPUT]: '請輸入',

  [KEYS.HOME_API]: {
    [KEYS.ROOM_NAME]: '很抱歉~ 房間名稱已經存在！',
    [KEYS.NO_ROOM_NAME]: '很抱歉~ 房間不已經存在！',
    [KEYS.PASSWORD_ERROR]: '密碼錯誤！',
  },

  [KEYS.EMPTY_NICKNAME]: `@:${KEYS.PLEASE_INPUT}@:${KEYS.NICKNAME}作為您的房間暱稱`,
  [KEYS.EMPTY_PASSWORD]: `@:${KEYS.PLEASE_INPUT}@:${KEYS.PASSWORD}進入房間`,
  [KEYS.EMPTY_ROOM_NUMBER]: `@:${KEYS.PLEASE_INPUT}@:${KEYS.ROOM_NUMBER}進入房間`,
}
