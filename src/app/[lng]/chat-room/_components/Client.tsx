'use client';
import '../style.css';
import {
  FC,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GrEmoji } from 'react-icons/gr';
import { CHAT_ROOM_KEYS } from '@@/locales/keys';
import { Chat, ChatMsg, MESSAGE_TYPE, usePusher } from '@/hooks/use-pusher';
import { usePathname } from 'next/navigation';
import { trpc } from '@/server/trpc/client';
import { debounce } from '@/utils/debounce-throttle';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { ImageSvg } from '@/components/ImageSvg';
import { toast } from 'sonner';
import { AppContext } from '@/context';
import Picker from '@emoji-mart/react';

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

export const ClientPicker: FC<{
  onEmojiSelect: (e: any) => void;
  onClickOutside: (e: any) => void;
}> = ({ onEmojiSelect, onClickOutside }) => {
  const { dataTheme } = useContext(AppContext);
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
      );
      const res = await response.json();

      setData(res);
    };

    getData();
  }, []);
  return data ? (
    <Picker
      data={data}
      searchPosition="none"
      previewPosition="none"
      theme={dataTheme}
      maxFrequentRows={1}
      perLine={8}
      onEmojiSelect={onEmojiSelect}
      onClickOutside={onClickOutside}
    />
  ) : (
    <></>
  );
};

export function ClientChat() {
  const { current: isMobile } = useRef(
    /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)
  );
  const pathname = usePathname();
  const { t } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [chat, setChat] = useState<Chat[]>([]);
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const ChatScroll = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState('');
  const { encryptData } = useRoomStore();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
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

    if (content.length === 0 && target.value.trim().length === 0) return;
    setContent(target.value);
  };

  /**
   * 发送信息或者接受信息滚动到底部
   */
  const handleScrollBottom = (duration: number = 200) => {
    const element = ChatScroll.current;
    if (!element) return;

    const start = element.scrollTop;
    const end = element.scrollHeight - element.clientHeight;
    const change = end - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      element.scrollTop = start + change * progress;

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  /**
   * send message
   */
  const handleSendMessage = () => {
    debounce(() => {
      if (content.trim() === '') {
        toast.warning(t!(CHAT_ROOM_KEYS.CONTENT_CANNOT_BE_EMPTY));
        return;
      }

      ClientSendMessage(content.trim());
      setContent('');

      textAreaRef.current?.focus();
    });
  };

  /**
   * 聚焦按键事件
   */
  const handleKeyDown = ({
    key,
    shiftKey,
  }: KeyboardEvent<HTMLTextAreaElement>) => {
    if (key === 'Enter' && !shiftKey && !isMobile) {
      handleSendMessage();
    } else if (key === 'Enter' && isMobile) {
      handleSendMessage();
    }
  };

  const onEmojiSelect = (e: any) => {
    setContent((state) => state + e.native);
    textAreaRef.current?.focus();
  };
  const onClickOutside = (e: any) => {
    console.log(e);
  };

  useEffect(() => {
    return () => {
      if (window.location.pathname !== pathname) {
        exitRoom<typeof mutate>(mutate);
      }
    };
  }, [pathname, exitRoom, mutate]);

  useEffect(() => {
    handleScrollBottom();
  }, [chat]);

  useEffect(() => {
    console.log(textAreaRef.current);

    textAreaRef.current?.focus();
  }, []);

  return (
    <>
      <div className="overflow-y-auto w-full flex-1 mb-4" ref={ChatScroll}>
        <div className="px-[var(--padding)]">
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
      </div>

      <div className="flex items-end w-full px-[var(--padding)]">
        <div className="relative h-[2.5rem] flex items-center">
          <GrEmoji
            className="w-8 h-8 text-accent-content/80 mr-4"
            onClick={() => {
              setVisibleEmoji((state) => !state);
            }}
          />
          <div
            className={`absolute left-0 ${
              visibleEmoji ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              bottom: height ? height + 'px' : '3rem',
            }}
          >
            <ClientPicker
              onEmojiSelect={onEmojiSelect}
              onClickOutside={onClickOutside}
            ></ClientPicker>
          </div>
        </div>

        {/* textarea */}
        <div className="textarea b3-opacity-6 flex-1 max-h-40 min-h-[2.5rem] p-2 box-border transition-all duration-300 border-primary shadow-sm shadow-primary">
          <div className="overflow-hidden max-h-[9rem]">
            <textarea
              value={content}
              rows={1}
              style={{
                height: !content ? 'auto' : height,
              }}
              className="w-full !bg-opacity-0 leading-6 text-base block caret-primary overflow-hidden resize-none outline-none"
              onInput={autoResize}
              onKeyDown={handleKeyDown}
              ref={textAreaRef}
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="ml-4">
          <button
            className="btn btn-primary min-h-[2.5rem] h-10"
            onClick={handleSendMessage}
          >
            {CHAT_ROOM_KEYS.SEND}
          </button>
        </div>
      </div>
    </>
  );
}
