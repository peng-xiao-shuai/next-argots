import KEYS from './keys'

// layout 语言配置
export default {
  [KEYS.SELECT_ROOM]: '加入房间',
  [KEYS.CREATE_ROOM]: '创建房间',
  [KEYS.ROOM_NUMBER]: '房间号',
  [KEYS.NICKNAME]: '昵称',
  [KEYS.PASSWORD]: '房间密码',
  [KEYS.PLEASE_INPUT]: '请输入',

  [KEYS.HOME_API]: {
    [KEYS.ROOM_NAME]: '很抱歉~ 房间名称已经存在！',
    [KEYS.NO_ROOM_NAME]: '很抱歉~ 房间名称不存在！',
    [KEYS.PASSWORD_ERROR]: '密码错误！',
  },

  [KEYS.EMPTY_NICKNAME]: `@:${KEYS.PLEASE_INPUT} @:${KEYS.NICKNAME} 作为您的房间昵称`,
  [KEYS.EMPTY_PASSWORD]: `@:${KEYS.PLEASE_INPUT} @:${KEYS.PASSWORD} 进入房间`,
  [KEYS.EMPTY_ROOM_NUMBER]: `@:${KEYS.PLEASE_INPUT} @:${KEYS.ROOM_NUMBER} 进入房间`,
}
