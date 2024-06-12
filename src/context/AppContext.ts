'use client';
import { createContext } from 'react';
import { DEFAULT_NS, Lng, Resources, resources } from '@/locales/i18n';
import { TOptions } from 'i18next';
import { COOKIE } from '@/server/enum';
import Cookie from 'js-cookie';
import { LOCALES_KEYS } from '@@/locales/keys';
export interface DefaultData {
  size: number;
  dataTheme: 'dark' | 'light' | 'auto';
}

export interface AppContextData extends DefaultData {
  language?: Lng;
  /**
   * 由于部分英文是由中文资源的key作为值，故此部分英文无法推断
   */
  t: <T extends LOCALES_KEYS>(
    key: T,
    options?: TOptions
  ) => Resources[keyof typeof resources][typeof DEFAULT_NS][T];
}

export const defaultData: DefaultData = {
  size: Cookie?.get(COOKIE.SIZE) ? Number(Cookie?.get(COOKIE.SIZE)) : 16,
  dataTheme: (Cookie?.get(COOKIE.THEME) as DefaultData['dataTheme']) || 'dark',
};

export const AppContext = createContext<AppContextData>({
  ...defaultData,
  /**
   * 默认行为，会被覆盖，避免使用 t 函数时需要非空断言
   */
  t: (key) => {
    return (resources as Resources)['en-US'][DEFAULT_NS][key];
  },
});
