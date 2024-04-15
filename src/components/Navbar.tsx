'use client';
import meta from '../app/[lng]/meta';
import { Lng, languages } from '@/locales/i18n';
import { AiOutlineHome, AiOutlineLeft } from 'react-icons/ai';
import { usePathname, useRouter } from 'next/navigation';
import { NavRight } from './NavbarRight';
import { useRoomStore } from '@/hooks/use-room-data';
import { FC, useContext, useEffect, useMemo } from 'react';
import { COMMON_KEYS } from '@@/locales/keys';
import { unicodeToString } from '@/utils/string-transform';
import { AppContext } from '@/context';

export const Navbar: FC<{
  language: Lng;
}> = ({ language }) => {
  const { t } = useContext(AppContext);
  const { encryptData } = useRoomStore();
  // path 路径携带 / 开头
  const path = usePathname();
  const router = useRouter();
  const metadata = useMemo(() => {
    const pathArr = path.split('/');
    pathArr.splice(pathArr.length - 1, 1);

    if (languages.includes(path.replace('/', '') as Lng)) return meta['/'];
    else return meta[path.replace('/' + language, '')] || {};
  }, [language, path]);
  const navTitle = useMemo(() => {
    // 处理navbar 显示文字
    if (metadata.locale === COMMON_KEYS.CHAT) {
      return unicodeToString(encryptData.roomName);
    } else {
      return t!(metadata.locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptData.roomName, metadata.locale]);

  useEffect(() => {
    const beforeunload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'tip';
    };

    if (metadata.locale === COMMON_KEYS.CHAT) {
      window.addEventListener('beforeunload', beforeunload);
    }

    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptData, metadata.locale]);

  return (
    <>
      <div
        className={`p-[var(--padding)] w-full${
          metadata.isPlaceholder ? '' : ' pb-0 fixed z-10 '
        }`}
      >
        <div
          className={`navbar rounded-lg b3-opacity-6 bg-opacity-60 min-h-12`}
        >
          <div
            onClick={() => {
              if (metadata.title !== 'Home') {
                router.back();
              }
            }}
          >
            <div className="flex-none leading-none">
              <label
                className={`swap swap-rotate items-center ${
                  metadata.title === 'Home' ? 'swap-active' : ''
                }`}
              >
                <AiOutlineHome className="svg-icon !w-[1.3rem] !h-[1.3rem] mx-auto swap-on" />
                <AiOutlineLeft className="svg-icon swap-off  rtl:rotate-180" />
              </label>
            </div>
          </div>

          <div className="flex-1">
            <span className="font-sans _bold text-base-content pl-2 text-1rem normal-case">
              {navTitle}
            </span>
          </div>
          <div className="flex-none">
            <NavRight metadata={metadata} t={t!} language={language}></NavRight>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
