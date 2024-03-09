'use client';
import { useTranslation } from '@/locales/client';
import { HOME_KEYS } from '@@/locales/keys';
import { useRouter } from 'next/navigation';
import { RoomStatus } from '@/server/enum';
import { FC, useEffect, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { Dialog, HomeForm } from '../components';

export const ClientOperate: FC<{
  lng: Lng;
}> = ({ lng }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(RoomStatus.ADD);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/${lng}/setting`);
    router.prefetch(`/${lng}/chat-room`);
  }, [router, lng]);

  // 点击加入/创建房间按钮
  const handleRoom = (type: RoomStatus) => {
    setRoomStatus(type);
    setVisible(true);
  };
  return (
    <>
      <div className="flex my-auto m-t w-[100%] justify-around">
        <button
          className="w-[43%] btn btn-outline border-base-content text-base-content"
          onClick={() => handleRoom(RoomStatus.JOIN)}
        >
          {t(HOME_KEYS.SELECT_ROOM)}
        </button>
        <button
          className="w-[43%] btn btn-primary btn-active"
          onClick={() => handleRoom(RoomStatus.ADD)}
        >
          {t(HOME_KEYS.CREATE_ROOM)}
        </button>
      </div>

      <Dialog visible={visible} setVisible={setVisible}>
        <div className="bg-base-300 flex flex-wrap justify-center">
          <HomeForm roomStatus={roomStatus}></HomeForm>
        </div>
      </Dialog>
    </>
  );
};
