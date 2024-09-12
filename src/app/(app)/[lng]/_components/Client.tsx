'use client';
import { HOME_KEYS } from '@@/locales/keys';
import { useRouter, useSearchParams } from 'next/navigation';
import { RoomStatus } from '@/server/enum';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { Dialog, HomeForm } from '@/components';
import { AppContext } from '@/context';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const ClientOperate: FC<{
  lng: Lng;
}> = ({ lng }) => {
  const { t } = useContext(AppContext);
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>(RoomStatus.ADD);
  const router = useRouter();

  useEffect(() => {
    router.prefetch(`/${lng}/setting`);
    router.prefetch(`/${lng}/chat-room`);
  }, [router, lng]);

  // 点击加入/创建频道按钮
  const handleRoom = useCallback(
    (type: RoomStatus) => {
      setRoomStatus(type);
      setVisible(true);
    },
    [setRoomStatus, setVisible]
  );

  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg) {
      toast.error(msg);
      history.replaceState(null, '', `/${lng}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          className="w-[43%] btn btn-primary"
          onClick={() => handleRoom(RoomStatus.ADD)}
        >
          {t(HOME_KEYS.CREATE_ROOM)}
        </button>
      </div>
      <Dialog visible={visible} setVisible={setVisible}>
        <div className="flex flex-wrap justify-center">
          <HomeForm
            roomStatus={roomStatus}
            lng={lng}
            visible={visible}
          ></HomeForm>
        </div>
      </Dialog>
    </>
  );
};
