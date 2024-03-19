'use client';
import '../style.css';
import { FC, useEffect, useState } from 'react';
import { CHAT_ROOM_KEYS } from '@@/locales/keys';
import { Chat, ChatMsg, MESSAGE_TYPE, usePusher } from '@/hooks/use-pusher';
import { usePathname } from 'next/navigation';
import { trpc } from '@/server/trpc/client';
import { debounce } from '@/utils/debounce-throttle';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { ImageSvg } from '@/components/ImageSvg';

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
          isMy ? 'chat-bubble-primary' : 'bg-base-300 text-base-content'
        } chat-bubble rounded-lg min-h-[unset]`}
      >
        <div className="whitespace-break-spaces break-words">{msg}</div>
      </div>
    </div>
  );
};

export function ClientChat() {
  const pathname = usePathname();
  const [content, setContent] = useState('');
  const [chat, setChat] = useState<Chat[]>([]);
  const [height, setHeight] = useState('');
  const { encryptData } = useRoomStore();
  const { ClientSendMessage, exitRoom, unsubscribe } = usePusher(setChat);
  const { mutate } = trpc.removeRoom.useMutation({
    onSuccess: () => {
      unsubscribe();
    },
    onError: (err, v) => {
      console.log(err, v);
    },
  });
  // 自动增长高度
  const autoResize = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHeight(`${target.scrollHeight}px`);
    setContent(target.value);
  };

  useEffect(() => {
    return () => {
      if (window.location.pathname !== pathname) {
        exitRoom<typeof mutate>(mutate);
      }
    };
  }, [pathname, exitRoom, mutate]);

  return (
    <>
      <div className="overflow-y-auto w-full flex-1 mb-4">
        {chat.map((item, index) => (
          <div key={index}>
            {
              // 文字类型
              item.type === MESSAGE_TYPE.MSG && (
                <ChatRecords
                  {...item}
                  user={
                    item.isMy
                      ? {
                          avatar: encryptData.avatar,
                          nickname: encryptData.nickName,
                        }
                      : item.user
                  }
                ></ChatRecords>
              )
            }

            {
              // 系统通知
              item.type === MESSAGE_TYPE.SYSTEM && (
                <div className="py-2 text-center text-base-content text-opacity-60 text-sm w-full">
                  {item.msg}
                </div>
              )
            }
          </div>
        ))}
      </div>

      <div className="flex items-end w-full">
        {/* textarea */}
        <div className="textarea flex-1 max-h-40 min-h-[2.5rem] p-2 box-border transition-all duration-300 border-primary shadow-sm shadow-primary">
          <div className="overflow-hidden max-h-[9rem]">
            {/* v-focus.forever */}
            <textarea
              value={content}
              rows={1}
              style={{
                height: !content ? 'auto' : height,
              }}
              className="w-full leading-6 text-base block caret-primary overflow-hidden resize-none outline-none bg-[rgba(0,0,0,0)]"
              onInput={autoResize}
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="ml-4">
          <button
            className="btn btn-primary min-h-[2.5rem] h-10"
            onClick={() => {
              debounce(() => {
                ClientSendMessage(content);
                setContent('');
              });
            }}
          >
            {CHAT_ROOM_KEYS.SEND}
          </button>
        </div>
      </div>
    </>
  );
}
