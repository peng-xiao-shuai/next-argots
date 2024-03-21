import { DefaultData } from '@/context';
import { Lng } from '@/locales/i18n';
import { COOKIE_NAME } from '@/locales/settings';
import { COOKIE } from '@/server/enum';
import Cookie from 'js-cookie';

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
  Cookie.set(COOKIE.THEME, dataTheme);
};

export const setSize = (size: DefaultData['size']) => {
  document.documentElement.style.fontSize = String(size);
  Cookie.set(COOKIE.SIZE, String(size));
};

export const setLanguage = (locale: Lng) => {
  Cookie.set(COOKIE_NAME, locale!, { path: '/' });
  setTimeout(() => {
    window.open('/' + locale!, '_self');
  }, 800);
};
