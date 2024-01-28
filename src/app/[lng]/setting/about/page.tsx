'use client';
import './style.css';
import { AppContext } from '@/context';
import { COMMON_KEYS } from '@/locales/keys';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import pck from '../../../../../package.json';

type AboutList = {
  label: string;
  locale: string;
  path?: string;
  click?: (item: AboutList) => void;
};

const aboutList: AboutList[] = [
  // {
  //   label: '检查更新',
  //   locale: COMMON_KEYS.CHECK_FOR_UPDATES,
  //   click(item) {
  //     console.log(item.label);
  //   },
  // },
  {
    label: '意见反馈',
    locale: COMMON_KEYS.FEEDBACK,
    path: '/setting/about/feedback',
  },
  // {
  //   label: '隐私政策',
  //   locale: 'Privacy.policy',
  //   path: '/issue-opinion',
  // },
  {
    label: '邮件联系',
    locale: COMMON_KEYS['E-MAIL_CONTACT'],
    click(item) {
      const recipient = 'pxs161256513@gmail.com';

      const mailtoLink = `mailto:${encodeURIComponent(recipient)}`;

      window.location.href = mailtoLink;
    },
  },
];
export default function About() {
  const setting = useContext(AppContext);
  const router = useRouter();
  return (
    <>
      <div className="pt-12 flex justify-center flex-wrap">
        <Image
          className="w-32 h-32 mb-4 mask mask-squircle"
          src={setting.logo || ''}
          alt=""
        />

        <div className="w-full text-center text-xl">{setting.name}</div>
        <div className="text-sm">{pck.version}</div>
      </div>

      <ul className="menu w-1/1 rounded-box py-4 px-0">
        {aboutList.map((item, index) => (
          <li
            key={item.label}
            className="border-t flex-row h-12 items-center justify-between row-active"
            style={{
              borderTopColor: index ? 'oklch(var(--nc) / 0.15)' : 'transparent',
            }}
            onClick={() =>
              item.path
                ? router.push(item.path)
                : item.click && item.click(item)
            }
          >
            <span className="px-0 !bg-opacity-0">{item.locale}</span>
            {item.path ? <AiOutlineRight className="w-3 h-3 p-0" /> : <></>}
          </li>
        ))}
      </ul>
    </>
  );
}
