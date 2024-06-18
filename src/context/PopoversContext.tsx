'use client';

import type { ChatMsg } from '@/hooks/use-pusher';
import type React from 'react';
import { createContext } from 'react';

/**
 * 用于深层次组件通信
 */
export const ChatPopoverContext = createContext<{
  referenceElement: HTMLElement | null;
  setReferenceElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  current: ChatMsg | null;
  setCurrent: React.Dispatch<React.SetStateAction<any>>;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * 如果搭配 DialogMask 组件使用时作为 props 传递
   */
  dialogVisible: boolean;

  /**
   * 关闭
   */
  handleClose: () => void;
}>({
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
