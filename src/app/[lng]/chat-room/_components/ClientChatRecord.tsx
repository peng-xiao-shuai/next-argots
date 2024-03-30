'use client';
import { ImageSvg } from '@/components';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { FC } from 'react';

const ChatRecords: FC<ChatMsg> = ({ isMy, msg, user }) => {
  return (
    <div className={`chat chat-${isMy ? 'end' : 'start'}`}>
      <div className="chat-header leading-6">
        {unicodeToString(user!.nickname)}
      </div>
      <div className="chat-image avatar">
        <div className="w-10 rounded-lg">
          <ImageSvg className="w-10 h-10" name={user?.avatar}></ImageSvg>
        </div>
      </div>
      <div
        className={`${
          isMy ? 'chat-bubble-primary' : 'b3-opacity-6 text-base-content'
        } chat-bubble rounded-lg min-h-[unset]`}
      >
        <div className="whitespace-break-spaces break-words">{msg}</div>
      </div>
    </div>
  );
};

export const ClientChatRecords: FC<Chat> = (props) => {
  const { encryptData } = useRoomStore();

  return (
    <>
      {
        // 文字类型
        props.type === MESSAGE_TYPE.MSG && (
          <ChatRecords
            {...props}
            user={
              props.isMy
                ? {
                    avatar: encryptData.avatar,
                    nickname: encryptData.nickName,
                  }
                : props.user
            }
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
