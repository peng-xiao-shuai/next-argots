'use client';
import '../style.css';
import React, {
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CHAT_ROOM_KEYS } from '@@/locales/keys';
import { type Chat, usePusher, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { usePathname } from 'next/navigation';
import { trpc } from '@/server/trpc/client';
import { debounce } from '@/utils/debounce-throttle';
import { toast } from 'sonner';
import { AppContext, ChatPopoverContext } from '@/context';
import { ClientChatRecords } from './ClientChatRecord';

import Cookies from 'js-cookie';
import { useLine } from '@/hooks/use-line';
import { ClientChatSendMsg } from './ClientChatSendMsg';
import Popover from '@/components/Popover';
import { Dialog, DialogMask } from '@/components';

export function ClientChat() {
  const pathname = usePathname();
  const [chat, setChat] = useState<Chat[]>([
    {
      type: MESSAGE_TYPE.MSG,
      msg: 'xxxx',
      timestamp: 28198291739201,
      user: {
        id: 'xxx',
        avatar: '',
        nickname: '_u600b',
      },
      status: 'success',
    },
  ]);
  const ChatScroll = useRef<HTMLDivElement | null>(null);
  const {
    clientSendMessage,
    exitRoom,
    unsubscribe,
    getChatHistory,
    disconnect,
  } = usePusher(setChat, chat);
  const { mutate } = trpc.removeRoom.useMutation({
    onSuccess: () => {
      Cookies.remove('pw-256');
      Cookies.remove('hash');
      unsubscribe();
    },
    onError: (err, v) => {
      console.log(err, v);
    },
  });

  // popover prop
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [visible, setPopoverVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  /**
   * 断网重连，并且同步数据
   */
  useLine((e) => {
    if (e.type === 'offline') {
      disconnect();
    } else {
      getChatHistory();
    }
  });

  /**
   * 发送信息或者接受信息滚动到底部
   */
  const handleScrollBottom = (duration: number = 200) => {
    const element = ChatScroll.current;
    if (!element) return;

    const start = element.scrollTop;
    const end = element.scrollHeight - element.clientHeight;
    const change = end - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      element.scrollTop = start + change * progress;

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    return () => {
      if (window.location.pathname !== pathname) {
        exitRoom<typeof mutate>(mutate);
      }
    };
  }, [pathname, exitRoom, mutate]);

  useEffect(() => {
    handleScrollBottom();
  }, [chat]);

  const handleClose = () => {
    setVisible(false);
  };
  const setVisible = (value: React.SetStateAction<boolean>) => {
    setPopoverVisible(value);
    setDialogVisible(value);
  };

  return (
    <>
      <ChatPopoverContext.Provider
        value={{
          setReferenceElement,
          visible,
          setVisible,
        }}
      >
        <div
          className="overflow-y-auto w-full flex-1 px-[var(--padding)]"
          data-hide="true"
          ref={ChatScroll}
        >
          <ClientChatRecords chat={chat}></ClientChatRecords>
        </div>

        <ClientChatSendMsg sendMsg={clientSendMessage}></ClientChatSendMsg>

        <DialogMask visible={dialogVisible} onClose={handleClose}>
          <Popover
            referenceElement={referenceElement}
            visible={visible}
            onClose={handleClose}
          >
            <ul className="menu !bg-base-100 rounded-box">
              <li>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </Popover>
        </DialogMask>
      </ChatPopoverContext.Provider>
    </>
  );
}
