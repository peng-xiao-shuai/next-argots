'use client';

import { type AvatarName } from '@/components';
import { type Data } from '@/app/api/join-link/route';
import { type Lng } from '@/locales/i18n';
import { createContext } from 'react';

export type LinkUserInfo = {
  nickName: string;
  avatar: AvatarName;
  roomName: string;
};
export type LinkPreviewInfo = {
  title: any;
  description: any;
  keywords: any;
  ogTitle: any;
  ogDescription: any;
  ogImage: any;
  twitterCard: any;
  twitterSite: any;
  canonicalUrl: any;
};
export type SetUserInfoType = (userInfo: LinkUserInfo) => void;
export type GetLinkPreview = (url: string) => Promise<LinkPreviewInfo | null>;

export const ClientChatContext = createContext<{
  lng: Lng;
  joinData?: Data;
  serveActive?: {
    getLinkPreview: GetLinkPreview;
    setUserInfo?: SetUserInfoType;
  };
  userInfo?: LinkUserInfo;
}>({
  lng: 'en-US',
});
