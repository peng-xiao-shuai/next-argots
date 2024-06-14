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

const ChatRecords: FC<ChatMsg & ExtensionRecord<Chat>> = ({
  msg,
  user,
  last,
  next,
}) => {
  const { userInfo } = useRoomStore();
  const isSystemType = (data: Chat | null) =>
    data?.type === MESSAGE_TYPE.SYSTEM ? false : data?.user.id == user.id;

  return (
    <div
      className={`chat chat-${
        user.nickname == userInfo.nickname ? 'end' : 'start'
      } !pb-0 pt-[0.15rem] ${!isSystemType(last) ? 'pt-2' : ''}`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-lg">
          {!isSystemType(next) && (
            <ImageSvg className="w-10 h-10" name={user?.avatar}></ImageSvg>
          )}
        </div>
      </div>
      <div
        className={`${
          user.nickname == userInfo.nickname
            ? 'chat-bubble-primary'
            : 'b3-opacity-6 text-base-content'
        } chat-bubble min-h-[unset] ${
          !isSystemType(next)
            ? 'user-last rounded-tr-md'
            : 'before:hidden rounded-r-md'
        } ${!isSystemType(last) ? 'user-first !rounded-t-box' : ''}`}
      >
        {!isSystemType(last) && (
          <div
            className={`chat-header leading-6 line-clamp-1 font-bold text-ellipsis block ${
              user.nickname == userInfo.nickname ? 'text-right' : 'text-left'
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
