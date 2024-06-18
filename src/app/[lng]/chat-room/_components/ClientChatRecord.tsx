'use client';
import { ImageSvg } from '@/components';
import { ChatPopoverContext } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { FC, MouseEvent, useCallback, useContext } from 'react';

type ExtensionRecord<T> = {
  last: T | null;
  next: T | null;
};

const ChatRecords: FC<
  {
    chatObj: ChatMsg;
  } & ExtensionRecord<Chat>
> = ({ chatObj, last, next }) => {
  const { user, msg, timestamp } = chatObj;
  const { userInfo } = useRoomStore();
  const isUserMessage = user.nickname === userInfo.nickname;
  const { setReferenceElement, setVisible, setCurrent, current } =
    useContext(ChatPopoverContext);
  const isSystemType = useCallback(
    (data: Chat | null) =>
      data?.type === MESSAGE_TYPE.SYSTEM ? false : data?.user.id == user.id,
    [user.id]
  );
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      setReferenceElement(e.currentTarget);
      setVisible(true);

      setCurrent(chatObj);
    },
    [chatObj, setCurrent, setReferenceElement, setVisible]
  );

  return (
    <div
      className={`chat
      chat-${isUserMessage ? 'end' : 'start'}
      !pb-0 pt-[0.15rem] *:transition-all *:duration-300 *:relative *:z-[100] 
      ${!isSystemType(last) ? 'pt-2' : ''}
      ${current?.timestamp === timestamp ? '*:!bg-base-100' : ''}`}
    >
      <div className="chat-image avatar rounded-lg overflow-hidden">
        <div className="w-10">
          {!isSystemType(next) && (
            <ImageSvg className="w-10 h-10" name={user?.avatar}></ImageSvg>
          )}
        </div>
      </div>
      <div
        className={`${
          isUserMessage
            ? 'chat-bubble-primary'
            : 'b3-opacity-6 text-base-content'
        } chat-bubble min-h-[unset] ${
          !isSystemType(next)
            ? 'user-last rounded-tr-md'
            : 'before:hidden rounded-r-md'
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
        <div className="whitespace-break-spaces break-words">{msg}</div>
      </div>
    </div>
  );
};

export const ClientChatRecords: FC<{ chat: Chat[] }> = ({ chat }) => {
  return (
    <>
      {chat.map((item, index) => {
        if (item.type === MESSAGE_TYPE.MSG)
          return (
            <ChatRecords
              key={index}
              {...(item as ChatMsg)}
              last={chat[index - 1]}
              next={chat[index + 1]}
              chatObj={item}
            ></ChatRecords>
          );

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
