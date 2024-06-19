'use client';

import type { ChatMsg } from '@/hooks/use-pusher';
import type React from 'react';
import { createContext } from 'react';

export type ChatPopoverContextData = {
  referenceElement: HTMLElement | null;
  setReferenceElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  current: ChatMsg | null;
  setCurrent: React.Dispatch<React.SetStateAction<any>>;
  visible: boolean;
  setVisible: (value: boolean) => void;
  /**
   * 如果搭配 DialogMask 组件使用时作为 props 传递
   */
  dialogVisible: boolean;

  /**
   * 关闭
   */
  handleClose: (clearCurrent?: boolean) => void;
};

/**
 * 用于深层次组件通信
 */
export const ChatPopoverContext = createContext<ChatPopoverContextData>({
  referenceElement: null,
  setReferenceElement: () => null,

  dialogVisible: false,
  visible: false,
  setVisible: () => false,
  current: null,
  setCurrent: () => null,

  /**
   * 关闭
   */
  handleClose: () => {},
});
