'use client';
import { GrEmoji, GrKeyboard } from 'react-icons/gr';
import Picker from '@emoji-mart/react';
import React, {
  FC,
  PointerEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppContext } from '@/context';
import LoadingRender from '../../loading';

export const ClientEmojiPicker: FC<{
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  visibleEmoji: boolean;
  setVisibleEmoji: React.Dispatch<React.SetStateAction<boolean>>;
}> = React.memo(
  ({ setContent, textAreaRef, visibleEmoji, setVisibleEmoji }) => {
    const { dataTheme } = useContext(AppContext);
    const [emojiData, setEmojiData] = useState();
    const cursorPosition = useRef(0);

    /**
     * 选中表情
     */
    const onEmojiSelect = (e: any) => {
      setContent((state) => {
        cursorPosition.current =
          textAreaRef.current?.selectionStart || cursorPosition.current + 1;

        return (
          state.substring(0, cursorPosition.current) +
          e.native +
          state.substring(cursorPosition.current, state.length)
        );
      });
    };

    /**
     * 表情外点击
     */
    const onClickOutside = (e: PointerEvent) => {
      if ((e.target as HTMLElement).dataset.hide === 'true') {
        setVisibleEmoji(false);
      }
    };

    useEffect(() => {
      const getData = async () => {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
          , { cache: 'force-cache' });
        const res = await response.json();
        setEmojiData(res);
      };

      getData();
    }, []);

    useEffect(() => {
      const emojiPicker = document.querySelector('em-emoji-picker');
      if (emojiPicker) {
        const style = document.createElement('style');
        style.innerHTML = `
        section {
          --em-color-border-over: transparent !important;
          --em-rgb-background: transparent !important;
          --em-color-border: transparent !important;
          --padding: 16px !important;
        }
      `;
        emojiPicker?.shadowRoot?.appendChild(style);
      }
    }, [emojiData]);

    return (
      <div
        className={`!duration-300 !transition-all ${
          visibleEmoji
            ? // 这里 336 是 320 （em-emoji-picker 的高度）+ 边距 16
              'opacity-100 h-[336px] pb-[var(--padding)]'
            : 'opacity-0 h-0 overflow-hidden pb-0'
        }`}
      >
        {Boolean(emojiData) ? (
          <Picker
            data={emojiData}
            searchPosition="none"
            previewPosition="none"
            theme={dataTheme}
            maxFrequentRows={2}
            emojiSize={26}
            dynamicWidth
            onEmojiSelect={onEmojiSelect}
            onClickOutside={onClickOutside}
          />
        ) : (
          <LoadingRender></LoadingRender>
        )}
      </div>
    );
  }
);
ClientEmojiPicker.displayName = 'ClientEmojiPicker';

export const ClientSwapSvg: FC<{
  setVisibleEmoji: React.Dispatch<React.SetStateAction<boolean>>;
  visibleEmoji: boolean;
}> = React.memo(({ setVisibleEmoji, visibleEmoji }) => (
  <label
    className="relative text-accent-content/80 mr-4 h-[2.5rem] swap"
    onClick={() => {
      const bol = visibleEmoji;
      setVisibleEmoji((state) => !bol);
      if (!bol) {
        // @ts-ignore
        document.activeElement?.blur?.();
      }
    }}
  >
    <GrKeyboard
      className={`w-8 h-8 duration-300 transition-all ${
        visibleEmoji ? 'opacity-100' : 'opacity-0'
      }`}
    />
    <GrEmoji
      className={`w-8 h-8 duration-300 transition-all ${
        !visibleEmoji ? 'opacity-100' : 'opacity-0'
      }`}
    />
  </label>
));
ClientSwapSvg.displayName = 'ClientSwapSvg';
