import './style.css';
import Image from 'next/image';
import { SETTING_KEYS } from '@@/locales/keys';
import { useTranslation } from '@/locales/i18n';
import { GenerateMetadata } from '../../meta';
import { ClientRangeInput } from '../_components/ClientSizeChange';

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

export const generateMetadata = async ({
  params: { lng },
}: CustomReactParams) => await GenerateMetadata(lng, '/setting/size-change');

export default async function SizeChange({
  params: { lng },
}: CustomReactParams) {
  const { t } = await useTranslation(lng);

  return (
    <div>
      {/* 使用动态颜色的时候，必须先静态声明，否则不会存在样式 */}
      <div className="chat-end chat-start" />
      {chat.map((item, index) => (
        <div
          key={index}
          className={`chat transition-all duration-300 chat-${
            item.type === 'user' ? 'end' : 'start'
          }`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-lg">
              <Image
                alt="logo"
                className="filter invert-[80%] brightness-200 contrast-100 dark:invert-[5%]"
                width={40}
                height={40}
                src={item.type === 'user' ? '/logo.svg' : '/logo.svg'}
              />
            </div>
          </div>
          <div
            className={`${
              item.type === 'user'
                ? 'chat-bubble-primary bg-primary-focus text-primary-content'
                : 'bg-base-300'
            } chat-bubble rounded-lg min-h-[unset] text-base-content w-4/5`}
          >
            {t(item.locale)}
          </div>
        </div>
      ))}

      {/* 底部滑块 */}
      <div className="fixed w-[100vw] left-0 bottom-0 b3-opacity-6 p-[16px] leading-none">
        <div className="flex justify-between items-end mb-[8px] pl-[4px]">
          <div className="flex items-end">
            <div className="text-[14px] mr-[calc((100vw-32px)/7*3-32px)]">
              A
            </div>
            <span className="text-[16px]">{t(SETTING_KEYS.SIZE_DEFAULT)}</span>
          </div>

          <span className="text-[24px]">A</span>
        </div>

        <ClientRangeInput></ClientRangeInput>
      </div>
    </div>
  );
}
