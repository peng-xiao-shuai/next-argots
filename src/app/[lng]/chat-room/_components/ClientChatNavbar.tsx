'use client';

import { AiOutlineLeft } from 'react-icons/ai';
import { NavbarRightComponent } from './NavbarRight';
import { useRoomStore } from '@/hooks/use-room-data';
import { AppContext, ChatPopoverContextData, CommandChatMsg } from '@/context';
import { FC, useContext, useEffect, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { unicodeToString } from '@/utils/string-transform';
import { useRouter } from 'next/navigation';
import { useLine } from '@/hooks/use-line';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { CHAT_ROOM_KEYS, COMMON_KEYS, LOCALES_KEYS } from '@@/locales/keys';
import { COMMAND } from './ClientChatPopoverContent';
import emitter from '@/utils/bus';

export const ClientChatNavbar: FC<{
  language: Lng;
}> = ({ language }) => {
  const router = useRouter();
  const { t } = useContext(AppContext);
  const { encryptData } = useRoomStore();
  const [navTitle, setNavTitle] = useState(
    unicodeToString(encryptData.roomName)
  );
  const [current, setCurrent] =
    useState<ChatPopoverContextData['current']>(null);

  useBusWatch('setNavTitle', (key) => {
    setNavTitle(t(key as LOCALES_KEYS));
  });
  useBusWatch('setSelectChat', (current) => {
    setCurrent(current as ChatPopoverContextData['current']);
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
          className={`navbar block rounded-lg b3-opacity-6 bg-opacity-60 min-h-12 max-h-12 overflow-hidden`}
        >
          <div
            className={`${
              current?.command === COMMAND.SELECT
                ? 'translate-y-[-2.5rem]'
                : 'translate-y-0'
            } duration-300 transition-all block`}
          >
            {/* 正常情况下显示 */}
            <div className={`flex justify-between items-center mb-2`}>
              <div
                onClick={() => {
                  router.back();
                }}
                className="transition-all duration-300 flex-1 inline-flex line-clamp-1"
              >
                <div className="flex-none leading-none">
                  <AiOutlineLeft className="svg-icon swap-off rtl:rotate-180" />
                </div>

                <span className="font-sans transition-all duration-300 _bold text-base-content pl-2 text-1rem normal-case">
                  {navTitle || 'xxxxx'}
                </span>
              </div>

              <div className="flex-none">
                <NavbarRightComponent></NavbarRightComponent>
              </div>
            </div>

            {/* 多选情况 */}
            <div className="flex justify-between items-center">
              <div className="flex">
                <button
                  className="btn btn-primary btn-sm mr-2"
                  onClick={() => {
                    emitter.emit(
                      'commandOperate',
                      COMMAND[COMMON_KEYS.COPY_TEXT]
                    );
                  }}
                >
                  {t(COMMON_KEYS.COPY_TEXT)}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    emitter.emit('commandOperate', COMMAND[COMMON_KEYS.DELETE]);
                  }}
                >
                  {t(COMMON_KEYS.DELETE)}
                </button>
              </div>

              <div>
                <span
                  className="text-primary font-bold cursor-pointer"
                  onClick={() => {
                    emitter.emit('complete', 'CANCEL');
                  }}
                >
                  {t(COMMON_KEYS.CANCEL)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
