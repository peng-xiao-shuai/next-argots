'use client';

import { ChatPopoverContext, ChatPopoverContextData } from '@/context';
import React, { useState } from 'react';

export const ChatPopoverProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [referenceElement, setReferenceElement] =
    useState<ChatPopoverContextData['referenceElement']>(null);
  const [visible, setPopoverVisible] =
    useState<ChatPopoverContextData['visible']>(false);
  const [dialogVisible, setDialogVisible] =
    useState<ChatPopoverContextData['dialogVisible']>(false);
  const [current, setCurrent] =
    useState<ChatPopoverContextData['current']>(null);
  const setVisible: ChatPopoverContextData['setVisible'] = (value) => {
    setPopoverVisible(value);
    setDialogVisible(value);
  };
  const handleClose: ChatPopoverContextData['handleClose'] = (
    clearCurrent = false
  ) => {
    setVisible(false);

    if (clearCurrent) {
      setCurrent(null);
    }
  };

  return (
    <ChatPopoverContext.Provider
      value={{
        referenceElement,
        setReferenceElement,
        dialogVisible,
        current,
        setCurrent,
        visible,
        setVisible,
        handleClose,
      }}
    >
      {children}
    </ChatPopoverContext.Provider>
  );
};
