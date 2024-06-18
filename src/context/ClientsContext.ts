'use client';

import { LinkUserInfo } from '@/app/[lng]/chat-room/_components/Client';
import { type Data } from '@/app/api/join-link/route';
import { type Lng } from '@/locales/i18n';
import { createContext } from 'react';

export const ClientChatContext = createContext<{
  lng: Lng;
  joinData?: Data;
  userInfo?: LinkUserInfo;
}>({
  lng: 'en-US',
});
