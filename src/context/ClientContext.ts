'use client';

import { type Lng } from '@/locales/i18n';
import { type Data } from 'payload/types';
import { createContext } from 'react';

export const ClientChatContext = createContext<{
  lng: Lng;
  joinData?: Data;
}>({
  lng: 'en-US',
});
