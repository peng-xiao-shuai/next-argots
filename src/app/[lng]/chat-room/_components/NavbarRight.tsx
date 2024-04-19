'use client';
import { NavRightProps } from '@/components/NavbarRight';
import { COMMON_KEYS } from '@@/locales/keys';
import bus from '@/utils/bus';
import { FC, useEffect, useState } from 'react';
import { useRoomStore } from '@/hooks/use-room-data';
import { UserRole } from '@/server/enum';

export const NavbarRightComponent: FC<NavRightProps> = ({
  metadata,
  t,
  language,
}) => {
  const { userInfo } = useRoomStore();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (userInfo.role === UserRole.HOUSE_OWNER) {
      setVisible(true);
    }
  }, [userInfo.role]);
  return visible ? (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => {
        bus.emit('complete');
      }}
    >
      {t(COMMON_KEYS.SHARE)}
    </button>
  ) : (
    <></>
  );
};
