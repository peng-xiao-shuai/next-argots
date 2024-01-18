import type { Metadata } from 'next';
export interface Meta extends Metadata {
  title?: string;
  locale?: string;
  isPlaceholder?: boolean;
  rightOperateType?: 'setting' | 'complete' | 'none';
}
const meta: { [key: string]: Meta } = {
  '/': {
    title: 'Home',
    // locale: KEYS.HOME,
    isPlaceholder: true,
    rightOperateType: 'setting',
  },

  '/setting': {
    title: 'Setting',
    // locale: KEYS.SETTINGS,
    isPlaceholder: true,
    rightOperateType: 'none',
  },

  '/setting/theme-change': {
    title: '深色模式',
    // locale: KEYS.DARK_PATTERN,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/size-change': {
    title: 'Size',
    // locale: KEYS.TEXT_SIZE,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/lang-change': {
    title: 'Lang',
    // locale: KEYS.MULTI_LANGUAGE,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/about': {
    title: 'About',
    // locale: KEYS.ABOUT,
    isPlaceholder: true,
    rightOperateType: 'none',
  },
};
export default meta;
