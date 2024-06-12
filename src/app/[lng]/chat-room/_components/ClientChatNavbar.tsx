'use client';

import { AiOutlineLeft } from 'react-icons/ai';
import { NavbarRightComponent } from './NavbarRight';
import { useRoomStore } from '@/hooks/use-room-data';
import { AppContext } from '@/context';
import { FC, useContext, useEffect, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { unicodeToString } from '@/utils/string-transform';
import { useRouter } from 'next/navigation';
import { useLine } from '@/hooks/use-line';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { CHAT_ROOM_KEYS, LOCALES_KEYS } from '@@/locales/keys';

export const ClientChatNavbar: FC<{
  language: Lng;
}> = ({ language }) => {
  const router = useRouter();
  const { t } = useContext(AppContext);
  const { encryptData } = useRoomStore();
  const [navTitle, setNavTitle] = useState(
    unicodeToString(encryptData.roomName)
  );

  useBusWatch('setNavTitle', (key) => {
    setNavTitle(t(key as LOCALES_KEYS));
  });

  useLine((e) => {
    if (e.type === 'offline') {
      setNavTitle(t(CHAT_ROOM_KEYS.NAV_TITLE_NO_NETWORK));
    } else {
      setNavTitle(unicodeToString(encryptData.roomName));
    }
  });

  useEffect(() => {
    setNavTitle(unicodeToString(encryptData.roomName));
  }, [encryptData.roomName]);

  return (
    <>
      <div className={`p-[var(--padding)] w-full`}>
        <div
          className={`navbar rounded-lg b3-opacity-6 bg-opacity-60 min-h-12`}
        >
          <div
            onClick={() => {
              router.back();
            }}
            className="transition-all duration-300"
          >
            <div className="flex-none leading-none">
              <AiOutlineLeft className="svg-icon swap-off  rtl:rotate-180" />
            </div>
          </div>

          <div className="flex-1 transition-all duration-300">
            <span className="font-sans _bold text-base-content pl-2 text-1rem normal-case">
              {navTitle}
            </span>
          </div>
          <div className="flex-none">
            <NavbarRightComponent></NavbarRightComponent>
          </div>
        </div>
      </div>
    </>
  );
};
