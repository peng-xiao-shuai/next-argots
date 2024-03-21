'use client';
import { createContext } from 'react';
import { Lng } from '@/locales/i18n';
import { TFunction } from 'i18next';
import { COOKIE } from '@/server/enum';
import Cookie from 'js-cookie';
export interface DefaultData {
  size: number;
  dataTheme: 'dark' | 'light' | 'auto';
}

export interface AppContextData extends DefaultData {
  language?: Lng;
  t?: TFunction<'translation', undefined>;
}

export const defaultData: DefaultData = {
  size: Cookie.get(COOKIE.SIZE) ? Number(Cookie.get(COOKIE.SIZE)) : 16,
  dataTheme: (Cookie.get(COOKIE.THEME) as DefaultData['dataTheme']) || 'dark',
};

export const AppContext = createContext<AppContextData>(defaultData);
