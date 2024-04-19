import { Lng, useTranslation } from '../../locales/i18n';
import { COMMON_KEYS, META } from '../../../public/locales/keys';
import type { Metadata } from 'next';
import { FC } from 'react';
import { NavRightProps } from '@/components/NavbarRight';
import { NavbarRightComponent } from './chat-room/_components/NavbarRight';
export interface Meta extends Metadata {
  title: string;
  locale: string;
  isPlaceholder?: boolean;
  rightOperateType?: 'setting' | 'complete' | 'none' | 'custom';
  NavbarRightText?: string;
  NavbarRightComponent?: FC<NavRightProps>;
}

const pathMetaData = {
  '/': {
    title: 'Home',
    locale: COMMON_KEYS.HOME,
    isPlaceholder: false,
    rightOperateType: 'setting',
  },

  '/setting': {
    title: 'Setting',
    locale: COMMON_KEYS.SETTINGS,
    isPlaceholder: true,
    rightOperateType: 'none',
  },

  '/setting/theme-change': {
    title: 'ThemeChange',
    locale: COMMON_KEYS.DARK_PATTERN,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/size-change': {
    title: 'Size',
    locale: COMMON_KEYS.TEXT_SIZE,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/lang-change': {
    title: 'Lang',
    locale: COMMON_KEYS.MULTI_LANGUAGE,
    isPlaceholder: true,
    rightOperateType: 'complete',
  },

  '/setting/about': {
    title: 'About',
    locale: COMMON_KEYS.ABOUT,
    isPlaceholder: false,
    rightOperateType: 'none',
  },

  '/setting/about/feedback': {
    title: 'Feedback',
    locale: COMMON_KEYS.FEEDBACK,
    isPlaceholder: true,
    rightOperateType: 'none',
  },

  '/chat-room': {
    title: 'Chat Room',
    locale: COMMON_KEYS.CHAT,
    isPlaceholder: true,
    rightOperateType: 'custom',
    NavbarRightComponent: NavbarRightComponent,
  },
};

const meta: {
  [key: string]: Meta;
} = pathMetaData as any;

export const GenerateMetadata = async (
  lng: Lng,
  path: keyof typeof pathMetaData
) => {
  const metadata = { ...meta[path] };
  const { t } = await useTranslation(lng);
  metadata.title = `${t(metadata.locale)} | ${t(COMMON_KEYS.PACKAGE_NAME)}`;
  metadata.description = `${t(META.DESC)}`;
  metadata.keywords = `${t(META.KEYWORDS)}`;

  return metadata;
};

export default meta;
