import { SettingData } from '@/app/components';

export const setDataTheme = (dataTheme: SettingData['dataTheme']) => {
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
