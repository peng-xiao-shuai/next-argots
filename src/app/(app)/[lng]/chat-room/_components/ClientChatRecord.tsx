'use client';
import { ImageSvg } from '@/components';
import { AppContext, ChatPopoverContext, LinkPreviewInfo } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { COMMAND } from './ClientChatPopoverContent';
import emitter from '@/utils/bus';
import { COMMON_KEYS } from '@@/locales/keys';
import { cn } from '@/utils/utils';
import { ChatMsgRender } from './ClientChatRecordMsg';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

type ExtensionRecord<T> = {
  last: T | null;
  next: T | null;
};

const ChatRecords: FC<
  {
    chatItem: ChatMsg;
    replyMsg: string | undefined;
    onChatClick: (timestamp: ChatMsg['timestamp']) => void;
  } & ExtensionRecord<Chat>
> = memo(({ chatItem, next, last, replyMsg, onChatClick }) => {
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
        'group-[.group-select]:*:z-[100]'
      )}
    >
      <div
        className={cn(
          'chat-image avatar rounded-lg',
          !isSystemType(next) && 'b3-opacity-6'
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
        className={cn(
          'chat-bubble min-h-[unset]',
          'group-[.group-select-model]:cursor-pointer group-[.group-select.group-select-model]:chat-bubble-primary',
          !isSystemType(next)
            ? `user-last ${isUserMessage ? 'rounded-tr-md' : 'rounded-tl-md'}`
            : `before:hidden ${
                isUserMessage ? '!rounded-r-md' : '!rounded-l-md'
              }`,
          !isSystemType(last) ? 'user-first !rounded-t-box' : ''
        )}
        onClick={handleClick}
      >
        {!isSystemType(last) && (
          <div
            className={cn(
              'chat-header text-primary leading-6 line-clamp-1 font-bold text-ellipsis block duration-300 transition-all',
              isUserMessage ? 'text-right' : 'text-left',
              'group-[.group-select.group-select-model]:text-primary-content'
            )}
          >
            {unicodeToString(chatItem.user!.nickname)}
          </div>
        )}
        {/* 回复 */}
        {chatItem.reply ? (
          <div
            className={cn(
              'border-l-4 border-primary rounded-md px-2 bg-primary/5 mb-1 duration-300 transition-[border,background-color]',
              'group-[.group-select.group-select-model]:border-primary-content group-[.group-select.group-select-model]:text-primary-content group-[.group-select.group-select-model]:bg-white/10'
            )}
          >
            <div
              className={cn(
                'font-bold transition-colors duration-300 text-primary',
                'group-[.group-select.group-select-model]:text-inherit'
              )}
            >
              {unicodeToString(chatItem.reply.user.nickname)}
            </div>
            <div
              className={cn('whitespace-break-spaces break-words text-inherit')}
            >
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
});
ChatRecords.displayName = 'ChatRecords';

const Row: FC<ListChildComponentProps> = ({ index, style, data }) => {
  console.log('渲染');

  const { chatsData, isSelectModel, onChatClick, setRowHeight } = data;
  const { item, isSelected, replyMsg, last, next } = chatsData[index];
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          setRowHeight(index, height);
        }
      });

      observer.observe(rowRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [index, item, setRowHeight]);

  if (item.type === MESSAGE_TYPE.SYSTEM) {
    return (
      <div
        ref={rowRef}
        style={style}
        className="py-2 text-center text-base-content text-opacity-60 text-sm w-full justify-between"
      >
        {item.msg}
      </div>
    );
  }

  return (
    <div ref={rowRef} style={{ ...style, height: 'auto' }}>
      <div
        className={cn(
          'group',
          isSelected && 'group-select',
          isSelectModel && 'group-select-model'
        )}
      >
        <ChatRecords
          last={last}
          next={next}
          chatItem={item}
          replyMsg={replyMsg}
          onChatClick={onChatClick}
        />
      </div>
    </div>
  );
};

const useChatData = (chats: Chat[], current: any) => {
  return useMemo(() => {
    const selectedChats = new Set(
      current?.chat?.map((chat: Chat) => chat.timestamp) || []
    );
    return chats.map((item, index) => ({
      item,
      isSelected:
        item.type === MESSAGE_TYPE.MSG && selectedChats.has(item.timestamp),
      replyMsg:
        item.type === MESSAGE_TYPE.MSG && item.reply && item.reply.timestamp
          ? chats.find(
              (c) =>
                c.timestamp === item.reply!.timestamp &&
                c.type === MESSAGE_TYPE.MSG
            )?.msg
          : undefined,
      last: chats[index - 1] || null,
      next: chats[index + 1] || null,
    }));
  }, [chats, current?.chat]);
};
const useRowHeights = (chats: Chat[]) => {
  const listRef = useRef<VariableSizeList>(null);
  const rowHeights = useRef<{ [key: string]: number }>({});
  const getRowHeight = useCallback(
    (index: number) => rowHeights.current[chats[index].timestamp] || 80,
    [chats]
  );
  const setRowHeight = useCallback(
    (index: number, size: number) => {
      const timestamp = chats[index].timestamp;
      console.log('触发set', rowHeights.current[timestamp], size);
      if (rowHeights.current[timestamp] !== size) {
        rowHeights.current[timestamp] = size;
        if (listRef.current) {
          listRef.current.resetAfterIndex(index, true);
        }
      }
    },
    [chats]
  );

  return { listRef, getRowHeight, setRowHeight };
};

export const ClientChatRecords: FC<{ chats: Chat[] }> = memo(({ chats }) => {
  const { syncCurrent, current, setCurrent, setReferenceElement, setVisible } =
    useContext(ChatPopoverContext);
  const chatsData = useChatData(chats, current);
  const { listRef, getRowHeight, setRowHeight } = useRowHeights(chats);
  const handleChatClick = useCallback(
    (timestamp: ChatMsg['timestamp']) => {
      const chatItem = chats.find(
        (chat) => chat.timestamp === timestamp
      )! as ChatMsg;

      if (syncCurrent?.current.command === COMMAND[COMMON_KEYS.SELECT]) {
        setCurrent((state) => {
          const newState = {
            chat: [...state.chat],
            command: COMMAND[COMMON_KEYS.SELECT],
          };

          if (Array.isArray(newState.chat)) {
            const index = newState.chat.findIndex(
              (item) => item.timestamp === timestamp
            );

            if (index === -1) {
              newState.chat.push(chatItem);
            } else {
              newState.chat.splice(index, 1);
            }
          } else {
            newState.chat = [newState.chat!, chatItem];
          }

          // 最后一个选择被取消选择时
          if (Array.isArray(newState.chat) && newState.chat.length === 0) {
            emitter.emit('setSelectChat', {
              command: '',
              chat: [],
            });
            return {
              command: '',
              chat: [],
            };
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
    [chats, setCurrent, setReferenceElement, setVisible, syncCurrent]
  );

  const isSelectModel =
    syncCurrent?.current.command === COMMAND[COMMON_KEYS.SELECT];

  const rowData = useMemo(
    () => ({
      chatsData,
      isSelectModel,
      onChatClick: handleChatClick,
      setRowHeight,
    }),
    [chatsData, isSelectModel, handleChatClick, setRowHeight]
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [chats, listRef]);

  return (
    <AutoSizer>
      {({ height, width }) => {
        console.log(height);

        return (
          // @ts-ignore
          <VariableSizeList
            ref={listRef}
            width={width}
            height={height}
            itemCount={chatsData.length}
            itemSize={getRowHeight}
            itemData={rowData}
          >
            {/* @ts-ignore */}
            {Row}
          </VariableSizeList>
        );
      }}
    </AutoSizer>
  );
});
ClientChatRecords.displayName = 'ClientChatRecords';
