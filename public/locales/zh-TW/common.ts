import { COMMON_KEYS, META } from '../keys';

export const COMMON = {
  [COMMON_KEYS.PACKAGE_NAME]: '隱語',

  [COMMON_KEYS.HOME]: '主頁',
  [COMMON_KEYS.CHAT]: '聊天',
  [COMMON_KEYS.SETTINGS]: '設置',
  [COMMON_KEYS.DARK_PATTERN]: '深色模式',
  [COMMON_KEYS.TEXT_SIZE]: '字體大小',
  [COMMON_KEYS.MULTI_LANGUAGE]: '多語言',
  [COMMON_KEYS.ABOUT]: '關於',
  [COMMON_KEYS.FEEDBACK]: '意見反餽',
  [COMMON_KEYS.CHECK_FOR_UPDATES]: '檢查更新',
  [COMMON_KEYS.PRIVACY_POLICY]: '隱私政策',
  [COMMON_KEYS['E-MAIL_CONTACT']]: '郵件聯繫',

  [COMMON_KEYS.CLOSE]: '關閉',
  [COMMON_KEYS.OPEN]: '打開',
  [COMMON_KEYS.CONFIRM]: '確認',
  [COMMON_KEYS.CANCEL]: '取消',
  [COMMON_KEYS.COMPLETE]: '完成',
  [COMMON_KEYS.SUCCESSFULLY_SET]: '修改成功',

  [COMMON_KEYS.REPLY]: '回復',
  [COMMON_KEYS.EDIT]: '編輯',
  [COMMON_KEYS.COPY_TEXT]: '複製文字',
  [COMMON_KEYS.DELETE]: '刪除',
  [COMMON_KEYS.SELECT]: '選中此消息',

  [COMMON_KEYS.SHARE]: '分享',
  [COMMON_KEYS.NO_DATA]: '暫無數據',

  [META.DESC]:
    '自由的聊天平台，全程加密對話信息，保護您的安全隱私。不會收集您的任何信息，不需要您的任何權限。聊天結束清除所有記錄。',
  [META.KEYWORDS]: '交流聊天 頻道 信息加密 無權限 開放聊天 端對端',
} as const;
