'use client';
import meta from '../meta';
import { useTranslation } from '@/locales/client';
import { Lng, languages } from '@/locales/i18n';
import { AiOutlineHome, AiOutlineLeft } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import { NavRight } from './NavbarRight';
import Link from 'next/link';
import { useRoomStore } from '@/hooks/use-room-data';
import { useEffect, useState } from 'react';
import { COMMON_KEYS } from '@@/locales/keys';
import { unicodeToString } from '@/utils/string-transform';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { encryptData } = useRoomStore();
  // path 路径携带 / 开头
  const path = usePathname();
  const pathArr = path.split('/');
  pathArr.splice(pathArr.length - 1, 1);

  const metadata = languages.includes(path.replace('/', '') as Lng)
    ? meta['/']
    : meta[path.replace('/' + i18n.language, '')] || {};

  const [navTitle, setNavTitle] = useState(t(metadata.locale));

  useEffect(() => {
    // 处理navbar 显示文字
    if (metadata.locale === COMMON_KEYS.CHAT) {
      setNavTitle(unicodeToString(encryptData.roomName));
    } else {
      setNavTitle(t(metadata.locale));
    }

    const beforeunload = (event: BeforeUnloadEvent) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.

      event.returnValue = 'tip';
    };

    if (metadata.locale === COMMON_KEYS.CHAT) {
      window.addEventListener('beforeunload', beforeunload);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    };
  }, [encryptData, metadata.locale, t]);

  return (
    <>
      <div
        className={`p-[var(--padding)] w-full${
          metadata.isPlaceholder ? '' : ' pb-0 fixed z-10 '
        }`}
      >
        <div className={`navbar rounded-lg bg-base-300 min-h-12`}>
          <Link href={metadata.title === 'Home' ? '' : pathArr.join('/')}>
            <div className="flex-none leading-none">
              <label
                className={`swap swap-rotate items-center ${
                  metadata.title === 'Home' ? 'swap-active' : ''
                }`}
              >
                <AiOutlineHome className="svg-icon !w-[1.3rem] !h-[1.3rem] mx-auto swap-on" />
                <AiOutlineLeft className="svg-icon swap-off" />
              </label>
            </div>
          </Link>

          <div className="flex-1">
            <span className="font-sans _bold text-base-content pl-2 text-1rem normal-case">
              {navTitle}
            </span>
          </div>
          <div className="flex-none">
            <NavRight metadata={metadata}></NavRight>
          </div>
        </div>
      </div>
    </>
  );
};
