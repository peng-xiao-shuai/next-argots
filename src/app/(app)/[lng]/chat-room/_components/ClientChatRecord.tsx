'use client';
import { ImageSvg } from '@/components';
import { AppContext, ChatPopoverContext, CommandChatMsg } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { FC, MouseEvent, useCallback, useContext, useMemo } from 'react';
import { COMMAND } from './ClientChatPopoverContent';
import { isTypeProtect } from '@/utils/type';
import emitter from '@/utils/bus';
import { COMMON_KEYS } from '@@/locales/keys';

type ExtensionRecord<T> = {
  last: T | null;
  next: T | null;
};

const ChatRecords: FC<
  {
    chatObj: ChatMsg;
    replyMsg: string | undefined;
  } & ExtensionRecord<Chat>
> = ({ chatObj, replyMsg, last, next }) => {
  const { t } = useContext(AppContext);
  const { user, msg, timestamp, isEdit, reply } = chatObj;
  const { userInfo } = useRoomStore();
  const isUserMessage = user.nickname === (userInfo.nickname || '_u600b');
  const { setReferenceElement, setVisible, setCurrent, current, visible } =
    useContext(ChatPopoverContext);
  const isSystemType = useCallback(
    (data: Chat | null) =>
      data?.type === MESSAGE_TYPE.SYSTEM ? false : data?.user.id == user.id,
    [user.id]
  );
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (current?.command === COMMAND[COMMON_KEYS.SELECT]) {
        setCurrent((state) => {
          const newState = { ...state!, command: COMMAND[COMMON_KEYS.SELECT] };

          if (Array.isArray(newState.chat)) {
            const index = newState.chat.findIndex(
              (item) => item.timestamp === chatObj.timestamp
            );

            if (index === -1) {
              newState.chat = newState.chat.concat(chatObj);
            } else {
              newState.chat.splice(index, 1);
            }
          } else {
            newState.chat = [newState.chat!, chatObj];
          }

          /**
           * 如果 newState.chat 全部清空后则返回 null
           */
          if (Array.isArray(newState.chat) && newState.chat.length === 0) {
            emitter.emit('setSelectChat', null);
            return null;
          }

          emitter.emit('setSelectChat', newState);

          return newState;
        });
        return;
      }

      setReferenceElement(e.currentTarget);
      setVisible(true);

      setCurrent({
        command: '',
        chat: [chatObj],
      });
    },
    [chatObj, current?.command, setCurrent, setReferenceElement, setVisible]
  );
  /**
   * 当前内容是否被选中
   */
  const isSelect = useMemo(() => {
    if (current?.chat) {
      return !!current.chat.find((item) => item.timestamp === timestamp);
    }
    return false;
  }, [current, timestamp]);

  return (
    <div
      className={`chat
        chat-${isUserMessage ? 'end' : 'start'}
        !pb-0 pt-[0.15rem] *:transition-all *:duration-300 *:relative hover:*:z-[100]
        ${!isSystemType(last) ? '!pt-2' : ''}
        ${isSelect ? '*:z-[100]' : ''}
      `}
    >
      <div
        className={`
        chat-image avatar rounded-lg overflow-hidden
        ${visible && !isSystemType(next) ? 'bg-base-100' : ''}
        `}
      >
        <div className="w-10">
          {!isSystemType(next) && (
            <ImageSvg className="w-10 h-10" name={user?.avatar}></ImageSvg>
          )}
        </div>
      </div>
      {/* ${
          isUserMessage
            ? 'chat-bubble-primary'
            : 'b3-opacity-6 text-base-content'
        } */}
      <div
        className={`
        chat-bubble min-h-[unset]
        ${
          isSelect && current?.command === COMMAND.SELECT
            ? 'chat-bubble-primary'
            : visible
            ? '!bg-base-100 text-base-content'
            : 'bg-base-300 text-base-content/80'
        }
        ${
          !isSystemType(next)
            ? `user-last ${isUserMessage ? 'rounded-tr-md' : 'rounded-tl-md'}`
            : `before:hidden ${
                isUserMessage ? '!rounded-r-md' : '!rounded-l-md'
              }`
        } ${!isSystemType(last) ? 'user-first !rounded-t-box' : ''}`}
        onClick={handleClick}
      >
        {!isSystemType(last) && (
          <div
            className={`chat-header leading-6 line-clamp-1 font-bold text-ellipsis block ${
              isUserMessage ? 'text-right' : 'text-left'
            }`}
          >
            {unicodeToString(user!.nickname)}
          </div>
        )}
        {reply ? (
          <div className="border-l-4 border-primary rounded-md px-2 bg-primary/10 mb-1">
            <div className="text-primary font-bold">
              {unicodeToString(reply.user.nickname)}
            </div>
            <div className="whitespace-break-spaces break-words">
              {replyMsg}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="whitespace-break-spaces break-words">{msg}</div>
        {isEdit === '1' ? (
          <div className="text-right text-sm">{t(COMMON_KEYS.EDIT)}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export const ClientChatRecords: FC<{ chats: Chat[] }> = ({ chats }) => {
  return (
    <>
      {chats.map((item, index) => {
        if (item.type === MESSAGE_TYPE.MSG) {
          let replyMsg: undefined | string = undefined;
          if (item.reply && item.reply.timestamp) {
            replyMsg = chats.find(
              (c) =>
                c.timestamp === item.reply!.timestamp &&
                c.type === MESSAGE_TYPE.MSG
            )?.msg;
          }
          return (
            <ChatRecords
              key={index}
              {...(item as ChatMsg)}
              last={chats[index - 1]}
              next={chats[index + 1]}
              chatObj={item}
              replyMsg={replyMsg}
            ></ChatRecords>
          );
        }
        // 系统通知
        if (item.type === MESSAGE_TYPE.SYSTEM)
          return (
            <div
              className="py-2 text-center text-base-content text-opacity-60 text-sm w-full justify-between"
              key={index}
            >
              {item.msg}
            </div>
          );

        return <></>;
      })}
    </>
  );
};
