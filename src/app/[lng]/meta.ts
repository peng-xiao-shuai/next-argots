import { COMMON_KEYS } from '@/locales/keys';
import type { Metadata } from 'next';
export interface Meta extends Metadata {
  title: string;
  locale: string;
  isPlaceholder?: boolean;
  rightOperateType?: 'setting' | 'complete' | 'none';
}
const meta: Indexes<Meta> = {
  '/': {
    title: 'Home',
    locale: COMMON_KEYS.HOME,
    isPlaceholder: true,
    rightOperateType: 'setting',
  },

  '/setting': {
    title: 'Setting',
    locale: COMMON_KEYS.SETTINGS,
    isPlaceholder: true,
    rightOperateType: 'none',
  },

  '/setting/theme-change': {
    title: 'ThemeChange',
    locale: COMMON_KEYS.DARK_PATTERN,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/size-change': {
    title: 'Size',
    locale: COMMON_KEYS.TEXT_SIZE,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/lang-change': {
    title: 'Lang',
    locale: COMMON_KEYS.MULTI_LANGUAGE,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/about': {
    title: 'About',
    locale: COMMON_KEYS.ABOUT,
    isPlaceholder: true,
    rightOperateType: 'none',
  },

  '/chat-room': {
    title: 'Chat Room',
    locale: COMMON_KEYS.CHAT,
    isPlaceholder: true,
    rightOperateType: 'none',
  },
};

export default meta;
