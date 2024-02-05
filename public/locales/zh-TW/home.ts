import { HOME_KEYS } from '../keys';

export const HOME = {
  [HOME_KEYS.SELECT_ROOM]: '加入房間',
  [HOME_KEYS.CREATE_ROOM]: '創建房間',
  [HOME_KEYS.ROOM_NUMBER]: '房間號',
  [HOME_KEYS.NICKNAME]: '暱稱',
  [HOME_KEYS.PASSWORD]: '房間密碼',
  [HOME_KEYS.PLEASE_INPUT]: '請輸入',

  [HOME_KEYS.HOME_API]: {
    [HOME_KEYS.ROOM_NAME]: '很抱歉~ 房間名稱已經存在！',
    [HOME_KEYS.NO_ROOM_NAME]: '很抱歉~ 房間不已經存在！',
    [HOME_KEYS.PASSWORD_ERROR]: '密碼錯誤！',
  },

  [HOME_KEYS.EMPTY_NICKNAME]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.NICKNAME}) 作為您的房間暱稱`,
  [HOME_KEYS.EMPTY_PASSWORD]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.PASSWORD}) 進入房間`,
  [HOME_KEYS.EMPTY_ROOM_NUMBER]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.ROOM_NUMBER}) 進入房間`,
};
