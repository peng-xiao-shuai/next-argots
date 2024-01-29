import { DefaultData } from '@/context';

export const setDataTheme = (dataTheme: DefaultData['dataTheme']) => {
  // 设置亮/暗模式
  if (dataTheme === 'auto') {
    const isDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    document.documentElement.setAttribute(
      'data-theme',
      isDark ? 'dark' : 'light'
    );
  } else {
    document.documentElement.setAttribute('data-theme', dataTheme);
  }
};
