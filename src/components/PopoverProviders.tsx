'use client';

import { ChatPopoverContext, ChatPopoverContextData } from '@/context';
import React, { useRef, useState } from 'react';

export const ChatPopoverProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const syncCurrent = useRef<ChatPopoverContextData['current']>(null);
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

  const setCurrentData = (
    value: React.SetStateAction<ChatPopoverContextData['current']>
  ) => {
    if (typeof value === 'function') {
      syncCurrent.current = value(syncCurrent.current);
    } else syncCurrent.current = value;

    setCurrent(syncCurrent.current);
  };

  return (
    <ChatPopoverContext.Provider
      value={{
        referenceElement,
        setReferenceElement,
        dialogVisible,
        syncCurrent: syncCurrent,
        current,
        setCurrent: setCurrentData,
        visible,
        setVisible,
        handleClose,
      }}
    >
      {children}
    </ChatPopoverContext.Provider>
  );
};
