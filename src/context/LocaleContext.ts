'use client';
import { createContext } from 'react';
import { FALLBACK_LNG, Lng } from '@/locales/i18n';
import { TFunction } from 'i18next';

export interface LocaleContextData {
  language: Lng;
  t: ((text: string) => string) | TFunction<string, undefined>;
}

export const LocaleContext = createContext<LocaleContextData>({
  t: (text: string) => text || '',
  language: FALLBACK_LNG,
});
