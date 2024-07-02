import { Lng, useTranslation } from '@/locales/i18n';
import { COMMON_KEYS, LOCALES_KEYS, META } from '@@/locales/keys';
import type { Metadata } from 'next';
import { FC } from 'react';
import { NavRightProps } from '@/components/NavbarRight';
import { ClientChatNavbar } from './chat-room/_components/ClientChatNavbar';

export interface Meta extends Metadata {
  title: string;
  locale: LOCALES_KEYS;
  isPlaceholder?: boolean;
  Navbar?: FC<{
    language: Lng;
  }>;
  rightOperateType?: 'setting' | 'complete' | 'none' | 'custom';
  NavbarRightText?: LOCALES_KEYS;
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
    Navbar: ClientChatNavbar,
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
  metadata.applicationName = t(COMMON_KEYS.PACKAGE_NAME);
  metadata.title = `${t(metadata.locale)} | ${t(COMMON_KEYS.PACKAGE_NAME)}`;
  metadata.description = `${t(META.DESC)}`;
  metadata.keywords = `${t(META.KEYWORDS)}`;
  metadata.robots = 'index, follow';
  metadata.appleWebApp = {
    capable: true,
    title: t(COMMON_KEYS.PACKAGE_NAME),
    startupImage: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    statusBarStyle: 'black-translucent',
  };
  metadata.verification = {
    google: 'oKUAZe57ikDxiRUtYzSrO-nv_EMdG_Nju0BoSoevbhM',
  };
  metadata.icons = {
    icon: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    apple: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  };
  metadata.openGraph = {
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: `${t(metadata.locale)} | ${t(COMMON_KEYS.PACKAGE_NAME)}`,
    description: `${t(META.DESC)}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        width: 200,
        height: 200,
        alt: 'Argots OG Image',
      },
    ],
  };
  metadata.twitter = {
    card: 'summary_large_image',
    site: process.env.NEXT_PUBLIC_SITE_URL,
    title: `${t(metadata.locale)} | ${t(COMMON_KEYS.PACKAGE_NAME)}`,
    description: `${t(META.DESC)}`,
    images: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  };
  return metadata;
};

export default meta;
