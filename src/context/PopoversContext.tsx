'use client';

import type { CommandType } from '@/app/[lng]/chat-room/_components/ClientChatPopoverContent';
import type { ChatMsg } from '@/hooks/use-pusher';
import type React from 'react';
import { MutableRefObject, createContext } from 'react';

export type CommandChatMsg = {
  /**
   * 当前指令，点击复制或者编辑指令后，存储到 command
   */
  command: CommandType['command'] | '';
  /**
   * 当前记录，点击哪条记录时，存储到 chat
   */
  chat: ChatMsg;
};

export type ChatPopoverContextData = {
  referenceElement: HTMLElement | null;
  setReferenceElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  current: CommandChatMsg | null;
  syncCurrent: MutableRefObject<CommandChatMsg | null>;
  setCurrent: React.Dispatch<
    React.SetStateAction<ChatPopoverContextData['current']>
  >;
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
  /**
   * 调用setCurrent会立即改变
   */
  syncCurrent: { current: null },
  setCurrent: () => null,

  /**
   * 关闭
   */
  handleClose: () => {},
});
