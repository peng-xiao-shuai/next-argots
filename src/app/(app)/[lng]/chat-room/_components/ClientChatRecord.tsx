'use client';
import { ImageSvg } from '@/components';
import { AppContext, ChatPopoverContext } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { FC, memo, useCallback, useContext, useMemo } from 'react';
import { COMMAND } from './ClientChatPopoverContent';
import emitter from '@/utils/bus';
import { COMMON_KEYS } from '@@/locales/keys';
import { cn } from '@/utils/utils';
import { ChatMsgRender } from './ClientChatRecordMsg';

type ExtensionRecord<T> = {
  last: T | null;
  next: T | null;
};

const ChatRecords: FC<
  {
    chatItem: ChatMsg;
    replyMsg: string | undefined;
    isSelected: boolean;
    isMultiSelect: boolean;
    onChatClick: (timestamp: ChatMsg['timestamp']) => void;
  } & ExtensionRecord<Chat>
> = memo(
  ({
    chatItem,
    next,
    last,
    replyMsg,
    isSelected,
    isMultiSelect,
    onChatClick,
  }) => {
    const { t } = useContext(AppContext);
    const isSystemType = useCallback(
      (data: Chat | null) =>
        data?.type === MESSAGE_TYPE.SYSTEM
          ? false
          : data?.user.id == chatItem.user.id,
      [chatItem.user.id]
    );
    const { userInfo } = useRoomStore();
    const isUserMessage = useMemo(() => {
      return chatItem.user.nickname === userInfo.nickname;
    }, [chatItem.user.nickname, userInfo.nickname]);
    const handleClick = useCallback(() => {
      onChatClick(chatItem.timestamp);
    }, [chatItem.timestamp, onChatClick]);

    return (
      <div
        className={cn(
          'chat !pb-0 pt-[0.15rem] *:transition-all *:duration-300 *:relative hover:*:z-[100]',
          `chat-${isUserMessage ? 'end' : 'start'}`,
          !isSystemType(last) && '!pt-2',
          isSelected && '*:z-[100]'
        )}
      >
        <div
          className={cn(
            'chat-image avatar rounded-lg',
            !isSystemType(next) && 'bg-base-100'
          )}
        >
          <div className="w-10">
            {!isSystemType(next) && (
              <ImageSvg
                className="w-10 h-10 border-base-200 border overflow-hidden rounded-lg"
                name={chatItem.user?.avatar}
              ></ImageSvg>
            )}
          </div>
        </div>

        <div
          id={String(chatItem.timestamp)}
          className={cn('chat-bubble min-h-[unset]')}
          onClick={handleClick}
        >
          {!isSystemType(last) && (
            <div
              className={cn(
                'chat-header leading-6 line-clamp-1 font-bold text-ellipsis block duration-300 transition-all',
                isUserMessage ? 'text-right' : 'text-left',
                isMultiSelect ? 'text-primary-content' : 'text-primary'
              )}
            >
              {unicodeToString(chatItem.user!.nickname)}
            </div>
          )}
          {/* 回复 */}
          {chatItem.reply ? (
            <div
              className={cn(
                'border-l-4 border-primary rounded-md px-2 bg-primary/10 mb-1 duration-300 transition-[border,background-color]',
                isMultiSelect &&
                  'border-primary-content text-primary-content bg-white/10'
              )}
            >
              <div
                className={cn(
                  'font-bold transition-colors duration-300',
                  !isMultiSelect && 'text-primary '
                )}
              >
                {unicodeToString(chatItem.reply.user.nickname)}
              </div>
              <div className={cn('whitespace-break-spaces break-words')}>
                {replyMsg}
              </div>
            </div>
          ) : (
            <></>
          )}
          <ChatMsgRender msg={chatItem.msg}></ChatMsgRender>
          {/* 已编辑 */}
          {chatItem.isEdit === '1' ? (
            <div className="text-right text-sm">{t(COMMON_KEYS.EDIT)}</div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
);
ChatRecords.displayName = 'ChatRecords';

export const ClientChatRecords: FC<{ chats: Chat[] }> = memo(({ chats }) => {
  const { current, setCurrent, setReferenceElement, setVisible } =
    useContext(ChatPopoverContext);

  const handleChatClick = useCallback(
    (timestamp: ChatMsg['timestamp']) => {
      const chatItem = chats.find(
        (chat) => chat.timestamp === timestamp
      )! as ChatMsg;
      if (current?.command === COMMAND[COMMON_KEYS.SELECT]) {
        setCurrent((state) => {
          const newState = { ...state!, command: COMMAND[COMMON_KEYS.SELECT] };

          if (Array.isArray(newState.chat)) {
            const index = newState.chat.findIndex(
              (item) => item.timestamp === timestamp
            );

            if (index === -1) {
              newState.chat = newState.chat.concat(chatItem);
            } else {
              newState.chat.splice(index, 1);
            }
          } else {
            newState.chat = [newState.chat!, chatItem];
          }

          if (Array.isArray(newState.chat) && newState.chat.length === 0) {
            emitter.emit('setSelectChat', null);
            return null;
          }

          emitter.emit('setSelectChat', newState);

          return newState;
        });
      } else {
        setReferenceElement(document.getElementById(String(timestamp)));
        setVisible(true);

        setCurrent({
          command: '',
          chat: [chatItem],
        });
      }
    },
    [chats, current?.command, setCurrent, setReferenceElement, setVisible]
  );

  const selectedChats = useMemo(() => {
    return new Set(current?.chat?.map((chat) => chat.timestamp) || []);
  }, [current?.chat]);

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
          /**
           * 当前内容是否被选中
           */
          const isSelected = selectedChats.has(item.timestamp);
          /**
           * 是否多选状态
           */
          const isMultiSelect =
            isSelected && current?.command === COMMAND[COMMON_KEYS.SELECT];

          return (
            <ChatRecords
              key={item.timestamp}
              last={chats[index - 1]}
              next={chats[index + 1]}
              chatItem={item}
              replyMsg={replyMsg}
              isSelected={isSelected}
              isMultiSelect={isMultiSelect}
              onChatClick={handleChatClick}
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
});
ClientChatRecords.displayName = 'ClientChatRecords';
