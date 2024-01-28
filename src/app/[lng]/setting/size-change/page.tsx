'use client';
import './style.css';
import logo from '/public/logo4.png';
import { useContext, useState } from 'react';
import Image from 'next/image';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { AppContext, LocaleContext } from '@/context';
import { SETTING_KEYS } from '@/locales/keys';

const BASE_SIZE = 13;
const chat = [
  {
    type: 'user',
    locale: SETTING_KEYS.FONT_PREVIEW,
    msg: '预览字体大小',
  },
  {
    type: 'other',
    locale: SETTING_KEYS.CHAT1,
    msg: '拖动下方滑块，可改变字体大小',
  },
  {
    type: 'other',
    locale: SETTING_KEYS.CHAT2,
    msg: '设置后，会改变聊天以及设置中字体大小，如果在使用中存在什么问题或意见，可以反馈给我们',
  },
];
const rangeData: Indexes<number> = {
  [BASE_SIZE]: 0,
  14: 10,
  15: 20,
  16: 30,
  17: 40,
  18: 50,
  19: 60,
  20: 70,
};

export default function SizeChange() {
  const { t } = useContext(LocaleContext);
  const setting = useContext(AppContext);

  // range 长度
  const [rangeValue, setRangeValue] = useState(rangeData[setting.size]);

  /**
   * 修改字体，在没有点击完成时，退出会将字体改回原样
   */
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(target.value));

    document.documentElement.style.fontSize = `${
      Number(target.value) / 10 + BASE_SIZE
    }px`;
  };

  const handleComplete = () => {
    window.localStorage.setItem(
      'settings',
      JSON.stringify({
        ...setting,
        size: rangeValue / 10 + BASE_SIZE,
      })
    );
  };

  useBusWatch('complete', handleComplete);

  return (
    <>
      {/* 使用动态颜色的时候，必须先静态声明，否则不会存在样式 */}
      <div className="chat-end chat-start" />
      {chat.map((item, index) => (
        <div
          key={index}
          className={`chat chat-${item.type === 'user' ? 'end' : 'start'}`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-lg">
              <Image
                alt="logo"
                width={40}
                height={40}
                src={
                  item.type === 'user'
                    ? 'https://avatars.githubusercontent.com/u/53845479?v=4'
                    : logo
                }
              />
            </div>
          </div>
          <div
            className={`${
              item.type === 'user'
                ? '!chat-bubble-primary !bg-primary-focus text-primary-content'
                : ''
            } chat-bubble rounded-lg min-h-[unset] bg-base-300"`}
          >
            {t(item.locale)}
          </div>
        </div>
      ))}

      {/* 底部滑块 */}
      <div className="fixed w-[100vw] -left-[var(--padding)] -bottom-[var(--padding)] bg-base-300 p-[16px]">
        <div className="flex justify-between items-end mb-[8px] pl-[4px]">
          <div className="flex items-end">
            <div className="text-[14px] mr-[calc((100vw-32px)/7*3-32px)]">
              A
            </div>
            <span className="text-[16px]">{t(SETTING_KEYS.SIZE_DEFAULT)}</span>
          </div>

          <span className="text-[24px]">A</span>
        </div>

        <div className="relative leading-[24px] h-[30px] overflow-y-hidden">
          <div className="w-full flex justify-between absolute top-[6px] pointer-events-none px-[8px]">
            {Object.keys(rangeData).map((_item, i) => (
              <div key={i} className="w-[1px] h-[16px] bg-base-content" />
            ))}
          </div>
          <input
            value={rangeValue}
            type="range"
            min="0"
            max="70"
            step={70 / 7}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}
