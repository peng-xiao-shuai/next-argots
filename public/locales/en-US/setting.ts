import { HOME_KEYS, SETTING_KEYS } from '../keys';

export const SETTING = {
  [SETTING_KEYS.CHAT1]: 'Drag the lower slider to change the font size',
  [SETTING_KEYS.CHAT2]:
    'After setting, the chat and font size in the setting will be changed  If there are any problems or comments in use, you can feedback to us',
  [SETTING_KEYS.MODE_SWITCH]: 'Open after to follow the systems dark and light',
  [SETTING_KEYS.SIZE_DEFAULT]: 'default',

  [SETTING_KEYS.E_MAIL]: `E-mail`,
  [SETTING_KEYS.E_MAIL_OPTIONAL]: `$t(${SETTING_KEYS.E_MAIL}) ($t(${SETTING_KEYS.OPTIONAL}))`,
  [SETTING_KEYS.PLEASE_E_MAIL]: `$t(${HOME_KEYS.PLEASE_INPUT}) $t(${SETTING_KEYS.E_MAIL})`,
};
