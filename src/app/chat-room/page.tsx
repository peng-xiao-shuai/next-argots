'use client';
import './style.scss';
import { useState } from 'react';
import KEYS from './locales/keys';
import { useWebsocket } from '@/hooks/use-websocket';
import logo from '/public/logo.jpg';
import Image from 'next/image';

const ChatRecords = (
  {
    isMy,
    msg,
  }: {
    isMy?: boolean;
    msg: string;
  } = {
    isMy: false,
    msg: '',
  }
) => {
  return (
    <div className={`chat chat-${isMy ? 'end' : 'start'}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-lg">
          <Image
            alt="profile photo"
            src={
              isMy
                ? 'https://avatars.githubusercontent.com/u/53845479?v=4'
                : logo
            }
          />
        </div>
      </div>
      <div
        className={`${
          isMy ? 'chat-bubble-primary' : ''
        } chat-bubble rounded-lg min-h-[unset]`}
      >
        <div className="whitespace-break-spaces">{msg}</div>
      </div>
    </div>
  );
};

export default function Chat() {
  const [content, setContent] = useState('');
  const [height, setHeight] = useState('');
  const { handleSend, chat } = useWebsocket();

  // 自动增长高度
  const autoResize = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHeight(`${target.scrollHeight}px`);
    setContent(target.value);
  };
  return (
    <>
      <div className="overflow-y-auto w-full flex-1 mb-4">
        {chat.map((item, index) => (
          <div key={index}>
            {/* 文字类型 */}
            <ChatRecords isMy={item.isMy} msg={item.msg}></ChatRecords>
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
              handleSend(content);
              setContent('');
            }}
          >
            {KEYS.SEND}
          </button>
        </div>
      </div>
    </>
  );
}
