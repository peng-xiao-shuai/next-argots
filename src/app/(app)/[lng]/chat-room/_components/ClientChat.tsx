'use client';
import '../style.css';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  type Chat,
  usePusher,
  MESSAGE_TYPE,
  ChatMsg,
} from '@/hooks/use-pusher';
import { usePathname } from 'next/navigation';
import { trpc } from '@/server/trpc/client';
import { ChatPopoverContext, CommandChatMsg } from '@/context';
import { ClientChatRecords } from './ClientChatRecord';

import Cookies from 'js-cookie';
import { useLine } from '@/hooks/use-line';
import { ClientChatSendMsg } from './ClientChatSendMsg';
import Popover from '@/components/Popover';
import { DialogMask } from '@/components';
import {
  COMMAND,
  CommandType,
  MemoPopoverContent,
} from './ClientChatPopoverContent';
import { copyText, unicodeToString } from '@/utils/string-transform';
import emitter from '@/utils/bus';
import { useBusWatch } from '@/hooks/use-bus-watch';

export function ClientChat() {
  const pathname = usePathname();
  const [chat, setChat] = useState<Chat[]>([]);
  const ChatScroll = useRef<HTMLDivElement | null>(null);
  const {
    clientSendMessage,
    clientOperateMessage,
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
      Cookies.remove('pw-256');
      Cookies.remove('hash');
      console.log(err, v);
    },
  });
  /**
   * 获取 popover 上下文
   */
  const {
    current,
    dialogVisible,
    handleClose,
    setCurrent,
    referenceElement,
    visible,
  } = useContext(ChatPopoverContext);
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
   * 监听导航栏删除和复制点击
   */
  useBusWatch('commandOperate', (e) => {
    handleCommand(e as CommandType['command']);
  });

  /**
   * 发送信息或者接受信息滚动到底部
   */
  const handleScrollBottom = useCallback(() => {
    (duration: number = 200) => {
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
  }, []);

  useEffect(() => {
    return () => {
      if (window.location.pathname !== pathname) {
        exitRoom<typeof mutate>(mutate);
      }
    };
  }, [pathname, exitRoom, mutate]);

  useEffect(() => {
    handleScrollBottom();
  }, [chat, handleScrollBottom]);

  /**
   * 指令操作
   */
  const handleCommand = useCallback(
    (command: CommandType['command']) => {
      const currentData: CommandChatMsg = {
        chat: current?.chat!,
        command: command,
      };
      setCurrent(currentData);

      switch (command) {
        case COMMAND.DELETE:
          clientOperateMessage((triggered: boolean) => {
            if (triggered) {
              handleClose(true);
              emitter.emit('setSelectChat', null);
            }
          });
          break;
        case COMMAND.COPY_TEXT:
          /**
           * 需要复制的消息
           */
          const msgString = () => {
            if (currentData?.chat.length > 1) {
              return currentData?.chat
                .map(
                  (item) =>
                    `${unicodeToString(item.user.nickname)}\n${item.msg}`
                )
                .join(',\n\n');
            } else return currentData?.chat[0].msg;
          };
          copyText(msgString() || '');
          handleClose(true);
          emitter.emit('setSelectChat', null);
          break;
        case COMMAND.SELECT:
          emitter.emit('setSelectChat', currentData);
          break;
      }
    },
    [clientOperateMessage, current?.chat, handleClose, setCurrent]
  );

  return (
    <>
      <div
        className="overflow-y-auto w-full flex-1 px-[var(--padding)] pb-[var(--padding)]"
        data-hide="true"
        ref={ChatScroll}
      >
        <ClientChatRecords chats={chat}></ClientChatRecords>
      </div>

      <ClientChatSendMsg sendMsg={clientSendMessage}></ClientChatSendMsg>

      <DialogMask visible={dialogVisible} onClose={() => handleClose(false)}>
        <Popover referenceElement={referenceElement} visible={visible}>
          <MemoPopoverContent
            cb={handleCommand}
            current={current}
          ></MemoPopoverContent>
        </Popover>
      </DialogMask>
    </>
  );
}
