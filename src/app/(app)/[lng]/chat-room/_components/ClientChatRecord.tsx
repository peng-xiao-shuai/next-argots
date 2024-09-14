'use client';
import { ChatPopoverContext } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
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
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ClientChatRecordContent } from './ClientChatRecordContent';

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
        <ClientChatRecordContent
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
