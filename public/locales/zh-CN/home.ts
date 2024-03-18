import { HOME_KEYS } from '../keys';

export const HOME = {
  [HOME_KEYS.SELECT_ROOM]: '加入房间',
  [HOME_KEYS.CREATE_ROOM]: '创建房间',
  [HOME_KEYS.ROOM_NUMBER]: '房间号',
  [HOME_KEYS.NICKNAME]: '昵称',
  [HOME_KEYS.PASSWORD]: '房间密码',
  [HOME_KEYS.PLEASE_INPUT]: '请输入',

  [HOME_KEYS.HOME_API]: {
    [HOME_KEYS.ROOM_NAME]: '很抱歉~ 房间名称已经存在！',
    [HOME_KEYS.NO_ROOM_NAME]: '很抱歉~ 房间名称不存在！',
    [HOME_KEYS.PASSWORD_ERROR]: '密码错误！',
  },

  [HOME_KEYS.EMPTY_NICKNAME]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.NICKNAME}) 作为您的房间昵称`,
  [HOME_KEYS.EMPTY_PASSWORD]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.PASSWORD}) 进入房间`,
  [HOME_KEYS.EMPTY_ROOM_NUMBER]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${HOME_KEYS.ROOM_NUMBER}) 进入房间`,

  [HOME_KEYS.AVATAR]: '头像',
};
