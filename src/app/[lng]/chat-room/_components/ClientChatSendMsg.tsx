import { ClientEmojiPicker, ClientSwapSvg } from './ClientEmoji';
import { debounce } from '@/utils/debounce-throttle';
import { toast } from 'sonner';
import { AppContext, ChatPopoverContext } from '@/context';
import React, {
  FC,
  KeyboardEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CHAT_ROOM_KEYS } from '@@/locales/keys';
import { COMMAND, CommandType, commands } from './ClientChatPopoverContent';
import { RiCloseLine } from 'react-icons/ri';

export const ClientChatSendMsg: FC<{
  sendMsg: (content: string, cb?: (() => void) | undefined) => Promise<void>;
}> = ({ sendMsg }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [visibleEmoji, setVisibleEmoji] = useState(false);
  const [content, setContent] = useState('');
  const { t } = useContext(AppContext);
  const { current, setCurrent } = useContext(ChatPopoverContext);
  const isMobile = useRef(false);

  useEffect(() => {
    textAreaRef.current?.focus();
    isMobile.current = /iPhone|iPad|iPod|Android|Mobile/i.test(
      navigator.userAgent
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCommandData = useMemo(() => {
    textAreaRef.current?.focus();

    if (current?.command === COMMAND.EDIT) {
      setContent(current?.chat.msg);
    }

    return commands.find((item) => item.command === current?.command);
  }, [current]);

  /**
   * send message
   */
  const handleSendMessage = () => {
    debounce(() => {
      if (content.trim() === '') {
        toast.warning(t(CHAT_ROOM_KEYS.CONTENT_CANNOT_BE_EMPTY));
        if (!visibleEmoji) {
          textAreaRef.current?.focus();
        }
        return;
      }

      sendMsg(content.trim());
      setContent('');

      if (!visibleEmoji) {
        textAreaRef.current?.focus();
      }
    });
  };

  /**
   * 聚焦按键事件
   */
  const handleKeyDown = ({
    key,
    shiftKey,
  }: KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(isMobile.current, shiftKey);

    if (key === 'Enter' && !shiftKey && !isMobile.current) {
      handleSendMessage();
    } else if (isMobile.current && key === 'Enter' && shiftKey) {
      handleSendMessage();
    }
  };

  /**
   * 聚焦
   */
  const handleFocus = () => {};

  // 自动增长高度
  const autoResize = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (target.value.trim().length === 0) {
      if (content.length === 0) return;
      setContent('');
      return;
    }

    setContent(target.value);
  };

  return (
    <div className="b3-opacity-6 relative">
      {currentCommandData &&
      (
        [COMMAND.EDIT, COMMAND.REPLY] as unknown as CommandType['command']
      ).includes(currentCommandData?.command) ? (
        <div className="absolute top-0 -translate-y-full w-full b3-opacity-6 p-[var(--padding)] pb-0 flex items-center">
          <currentCommandData.icon className="mr-[var(--padding)] size-5 text-primary" />

          <div>
            <strong className="text-primary">
              {currentCommandData.text}
              {current?.chat.user.nickname}
            </strong>
            <div>{current?.chat.msg}</div>
          </div>

          <RiCloseLine
            className="absolute right-[var(--padding)] size-6"
            onClick={() => setCurrent(null)}
          ></RiCloseLine>
        </div>
      ) : (
        <></>
      )}

      <div className="flex items-end w-full p-[var(--padding)]">
        <ClientSwapSvg
          visibleEmoji={visibleEmoji}
          setVisibleEmoji={setVisibleEmoji}
        ></ClientSwapSvg>

        {/* textarea */}
        <div className="textarea b3-opacity-6 flex-1 max-h-40 min-h-[2.5rem] h-auto p-2 box-border transition-all duration-300 border-primary shadow-sm shadow-primary">
          <div className="relative overflow-hidden max-h-[9rem] min-h-[1.4rem] h-auto">
            {/* 站位 */}
            <div className="max-h-[9rem] min-h-[1.4rem] w-full text-base box-border overflow-hidden whitespace-pre-wrap break-all invisible">
              {content.split('\n').map(function (item, index) {
                if (item.length === 0) {
                  return (
                    <React.Fragment key={`${index}-${item}`}>
                      <div>{item}</div>
                      <br />
                    </React.Fragment>
                  );
                }
                return <div key={`${index}-item`}>{item}</div>;
              })}
            </div>
            {/* absolute bottom-0  防止光标到最底部导致看不到 */}
            <textarea
              value={content}
              rows={1}
              placeholder={t(CHAT_ROOM_KEYS.SPEAK_OUT_FREELY)}
              style={{
                height: '100%',
              }}
              className="absolute bottom-0 w-full box-border !bg-opacity-0 text-base block caret-primary overflow-hidden resize-none outline-none"
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onClick={() => {
                setVisibleEmoji(false);
              }}
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
            {t(CHAT_ROOM_KEYS.SEND)}
          </button>
        </div>
      </div>

      <ClientEmojiPicker
        setContent={setContent}
        textAreaRef={textAreaRef}
        visibleEmoji={visibleEmoji}
        setVisibleEmoji={setVisibleEmoji}
      ></ClientEmojiPicker>
    </div>
  );
};
