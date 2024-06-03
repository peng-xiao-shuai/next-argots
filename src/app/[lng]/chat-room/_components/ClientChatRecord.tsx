'use client';
import { ImageSvg } from '@/components';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { FC } from 'react';

type ExtensionRecord<T> = {
  last: T | null;
  next: T | null;
};

const ChatRecords: FC<ChatMsg & ExtensionRecord<ChatMsg>> = ({
  isMy,
  msg,
  user,
  last,
  next,
}) => {
  return (
    <div className={`chat chat-${isMy ? 'end' : 'start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-lg">
          {!(next?.user.id == user.id) && (
            <ImageSvg className="w-10 h-10" name={user?.avatar}></ImageSvg>
          )}
        </div>
      </div>
      <div
        className={`${
          isMy ? 'chat-bubble-primary' : 'b3-opacity-6 text-base-content'
        } chat-bubble min-h-[unset] ${
          next?.user.id !== user.id
            ? 'user-last'
            : 'before:hidden !rounded-br-box'
        }`}
      >
        {!(last?.user.id === user.id) && (
          <div
            className={`chat-header leading-6 line-clamp-1 font-bold text-ellipsis block ${
              isMy ? 'text-right' : 'text-left'
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

export const ClientChatRecords: FC<Chat & ExtensionRecord<Chat>> = (props) => {
  const { encryptData } = useRoomStore();

  return (
    <>
      {
        // 文字类型
        props.type === MESSAGE_TYPE.MSG && (
          <ChatRecords
            {...(props as ChatMsg & ExtensionRecord<ChatMsg>)}
            user={props.user}
          ></ChatRecords>
        )
      }

      {
        // 系统通知
        props.type === MESSAGE_TYPE.SYSTEM && (
          <div className="py-2 text-center text-base-content text-opacity-60 text-sm w-full">
            {props.msg}
          </div>
        )
      }
    </>
  );
};
