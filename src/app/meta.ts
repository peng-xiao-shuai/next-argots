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
};
export default meta;
