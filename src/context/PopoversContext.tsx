'use client';

import type React from 'react';
import { createContext } from 'react';

/**
 * 用于深层次组件通信
 */
export const ChatPopoverContext = createContext<{
  setReferenceElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  setReferenceElement: () => null,
  visible: false,
  setVisible: () => false,
});
