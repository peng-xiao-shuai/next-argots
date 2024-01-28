'use client';
import { createContext } from 'react';
import { Lng } from '@/locales/i18n';
import { TFunction } from 'i18next';

export interface LocaleContextData {
  language: Lng;
  t: TFunction<string, undefined>;
}

export const LocaleContext = createContext<LocaleContextData | null>(null);
