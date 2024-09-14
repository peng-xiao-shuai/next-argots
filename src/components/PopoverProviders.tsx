'use client';

import {
  ChatPopoverContext,
  ChatPopoverContextData,
  definedCurrent,
} from '@/context';
import React, { useCallback, useRef, useState } from 'react';

export const ChatPopoverProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const syncCurrent = useRef<ChatPopoverContextData['current']>({
    ...definedCurrent,
  });
  const [referenceElement, setReferenceElement] =
    useState<ChatPopoverContextData['referenceElement']>(null);
  const [visible, setPopoverVisible] =
    useState<ChatPopoverContextData['visible']>(false);
  const [dialogVisible, setDialogVisible] =
    useState<ChatPopoverContextData['dialogVisible']>(false);
  const [current, setCurrent] = useState<ChatPopoverContextData['current']>({
    ...definedCurrent,
  });
  const setVisible: ChatPopoverContextData['setVisible'] = useCallback(
    (value) => {
      setPopoverVisible(value);
      setDialogVisible(value);
    },
    []
  );
  const setCurrentData = useCallback(
    (value: React.SetStateAction<ChatPopoverContextData['current']>) => {
      // 收到 null 是充值 current
      const _value = value == null ? { ...definedCurrent } : value;
      if (typeof _value === 'function') {
        syncCurrent.current = _value(syncCurrent.current);
      } else syncCurrent.current = _value;

      setCurrent(syncCurrent.current);
    },
    []
  );
  const handleClose: ChatPopoverContextData['handleClose'] = useCallback(
    (clearCurrent = false) => {
      setVisible(false);

      if (clearCurrent === true) {
        setCurrentData({ ...definedCurrent });
      }
    },
    [setCurrentData, setVisible]
  );

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
