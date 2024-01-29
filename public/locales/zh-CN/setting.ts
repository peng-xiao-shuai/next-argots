import { SETTING_KEYS } from '../keys';

export const SETTING = {
  [SETTING_KEYS.MODE_AUTO]: '跟随系统',
  [SETTING_KEYS.CHOOSE_MANUALLY]: '手动选择',
  [SETTING_KEYS.DARK_MODE]: '深色模式',
  [SETTING_KEYS.LIGHT_MODE]: '浅色模式',
  [SETTING_KEYS.FONT_PREVIEW]: '预览字体',

  [SETTING_KEYS.CHAT1]: '拖动下方滑块，可改变字体大小',
  [SETTING_KEYS.CHAT2]:
    '设置后，会改变聊天以及设置中字体大小，如果在使用中存在什么问题或意见，可以反馈给我们',
  [SETTING_KEYS.MODE_SWITCH]: '开启后将跟随系统开启或关闭深色模式',
  [SETTING_KEYS.SIZE_DEFAULT]: '标准',

  // TODO 对照 i18next 语法
  [SETTING_KEYS.E_MAIL]: `邮箱 {'('}@:${SETTING_KEYS.OPTIONAL}{')'}`,
  [SETTING_KEYS.OPTIONAL]: '可选',
  [SETTING_KEYS.FEEDBACK_TYPES]: '反馈类型',
  [SETTING_KEYS.I_WANT_TO]: '我想要',
  [SETTING_KEYS.ISSUE]: '问题',
  [SETTING_KEYS.OPINION]: '意见',
  [SETTING_KEYS.CONTENT]: '反馈内容',
};