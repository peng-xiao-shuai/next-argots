'use client';
import { ChatPopoverContext } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import {
  FC,
  memo,
  Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { COMMAND } from './ClientChatPopoverContent';
import emitter from '@/utils/bus';
import { cn } from '@/utils/utils';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { ClientChatRecordContent } from './ClientChatRecordContent';

const Row: FC<ListChildComponentProps<RowData>> = memo(
  ({ index, style, data }) => {
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
            'group duration-300 transition-opacity',
            'group-[.visible]/list:opacity-20',
            isSelected && 'group-select !opacity-100',
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
  },
  (prevProps, nextProps) => {
    for (let key of Object.keys(prevProps.data.chatsData[prevProps.index])) {
      if (
        // @ts-ignore
        prevProps.data.chatsData[prevProps.index][key] !=
        // @ts-ignore
        nextProps.data.chatsData[prevProps.index][key]
      ) {
        return false;
      }
    }

    return (
      prevProps.index === nextProps.index &&
      prevProps.style === nextProps.style &&
      prevProps.data.onChatClick === nextProps.data.onChatClick &&
      prevProps.data.setRowHeight === nextProps.data.setRowHeight &&
      prevProps.data.isSelectModel === nextProps.data.isSelectModel
    );
  }
);
Row.displayName = 'ClientChatRecordRow';

interface ChatDataType {
  item: Chat;
  isSelected: boolean;
  replyMsg: string | undefined;
  last: Chat;
  next: Chat;
}
interface RowData {
  chatsData: ChatDataType[];
  isSelectModel: boolean;
  onChatClick: (timestamp: ChatMsg['timestamp']) => void;
  setRowHeight: (index: number, size: number) => void;
}
const useChatData = (chats: Chat[], current: any) => {
  return useMemo<ChatDataType[]>(() => {
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
  const setRowHeight = useCallback<RowData['setRowHeight']>(
    (index, size) => {
      const timestamp = chats[index].timestamp;
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

export const ClientChatRecords: FC<{
  chats: Chat[];
  chatScroll: Ref<HTMLDivElement | null>;
  handleScrollBottom: (duration: number, targetHeight?: number) => void;
}> = memo(({ chats, chatScroll, handleScrollBottom }) => {
  const {
    syncCurrent,
    current,
    visible,
    setCurrent,
    setReferenceElement,
    setVisible,
  } = useContext(ChatPopoverContext);
  const chatsData = useChatData(chats, current);
  const { listRef, getRowHeight, setRowHeight } = useRowHeights(chats);
  const handleChatClick = useCallback<RowData['onChatClick']>(
    (timestamp) => {
      // TODO 滚动到引用位置
      const chatItem = chats.find(
        (chat) => chat.timestamp === timestamp
      )! as ChatMsg;

      if (syncCurrent?.current.command === COMMAND.SELECT) {
        setCurrent((state) => {
          const newState = {
            chat: [...state.chat],
            command: COMMAND.SELECT,
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

  const isSelectModel = syncCurrent?.current.command === COMMAND.SELECT;

  const rowData = useMemo<RowData>(
    () => ({
      chatsData,
      isSelectModel,
      onChatClick: handleChatClick,
      setRowHeight,
    }),
    [chatsData, isSelectModel, handleChatClick, setRowHeight]
  );

  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          // @ts-ignore
          <VariableSizeList<RowData>
            ref={listRef}
            width={width}
            height={height}
            itemCount={chatsData.length}
            itemSize={getRowHeight}
            itemData={rowData}
            itemKey={(index, data) => {
              data.chatsData[index].item.timestamp;
            }}
            outerRef={chatScroll}
            style={{
              zIndex: 100,
            }}
            className={`${visible && 'visible pointer-events-none'} group/list`}
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
