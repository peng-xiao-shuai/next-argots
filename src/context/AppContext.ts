'use client';
import { createContext } from 'react';
import { Lng } from '@/locales/i18n';
import { COMMON_KEYS } from '@@/locales/keys';

export interface DefaultData {
  size: number;
  name: string;
  dataTheme: 'dark' | 'light' | 'auto';
}

export interface SettingContextData extends DefaultData {
  language?: Lng;
}

export const defaultData: DefaultData = {
  size: 16,
  dataTheme: 'dark',
  name: COMMON_KEYS.PACKAGE_NAME,
};

export const AppContext = createContext<SettingContextData>(defaultData);
