'use client';
import { createContext } from 'react';
import { StaticImageData } from 'next/image';
import { Lng } from '@/locales/i18n';
import { COMMON_KEYS } from '@/locales/keys';

export interface DefaultData {
  language: Lng;
  size: number;
  name: string;
  dataTheme: 'dark' | 'light' | 'auto';
}

/**
 * defaultData 存入上下文以及本地，但是 logo 不存本地，避免本地内存过大，仅存入上下文
 */
export interface SettingContextData extends DefaultData {
  logo?: StaticImageData;
}

export const defaultData: DefaultData = {
  language: 'zh-CN',
  size: 16,
  dataTheme: 'dark',
  name: COMMON_KEYS.PACKAGE_NAME,
};

export const AppContext = createContext<SettingContextData>(defaultData);
