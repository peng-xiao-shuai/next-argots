'use client';
import { useRouter } from 'next/navigation';
import { FC, useContext } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { useTranslation } from '@/locales/client';
import { COMMON_KEYS } from '@@/locales/keys';

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

export const ClientAboutMenu: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <>
      {aboutList.map((item, index) => (
        <li
          key={item.label}
          className="row-active"
          onClick={() =>
            item.path ? router.push(item.path) : item.click && item.click(item)
          }
        >
          <span className="px-0 !bg-opacity-0">{t(item.locale)}</span>
          {item.path ? <AiOutlineRight className="w-3 h-3 p-0" /> : <></>}
        </li>
      ))}
    </>
  );
};
