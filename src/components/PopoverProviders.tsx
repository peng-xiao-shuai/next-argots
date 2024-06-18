'use client';

import { ChatPopoverContext } from '@/context';
import React, { useState } from 'react';

export const ChatPopoverProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [visible, setPopoverVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [current, setCurrent] = useState(null);
  const setVisible = (value: React.SetStateAction<boolean>) => {
    setPopoverVisible(value);
    setDialogVisible(value);
  };
  const handleClose = () => {
    setVisible(false);
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
