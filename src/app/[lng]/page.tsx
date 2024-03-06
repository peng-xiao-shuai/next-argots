'use client';
import logo from '/public/logo4.png';
import { useEffect, useState } from 'react';
import { Dialog, HomeForm } from './components';
import { useTranslation } from '@/locales/client';
import { HOME_KEYS } from '@@/locales/keys';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RoomStatus } from '@/server/enum';

export default function Home({ params: { lng } }: CustomReactParams) {
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(RoomStatus.ADD);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
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
      <div className="flex flex-wrap h-[80%] items-center">
        <Image
          className="w-32 h-32 m-auto mask mask-squircle"
          src={logo}
          alt="Logo"
        />

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
      </div>

      <Dialog visible={visible} setVisible={setVisible}>
        <div className="bg-base-300 flex flex-wrap justify-center">
          <HomeForm roomStatus={roomStatus}></HomeForm>
        </div>
      </Dialog>
    </>
  );
}
