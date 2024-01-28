'use client';
import { useState } from 'react';
import { useRoomStore } from '@/hooks/use-room-data';
import { debounce } from '@/utils/debounce-throttle';
import { Dialog, HomeForm } from './components';

export default function Home({ params: { lng } }: CustomReactParams) {
  const [roomStatus, setRoomStatus] = useState<'ADD' | 'JOIN'>('ADD');
  const { encryptData } = useRoomStore();
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* <button onClick={signin}>连接</button> */}

      <button onClick={() => debounce(setVisible, 300, [true], true)}>
        连接欧易
      </button>

      {/* <Dialog visible={visible} setVisible={setVisible}>
        <div className="bg-base-300 flex flex-wrap justify-center">
          <HomeForm roomStatus={roomStatus}></HomeForm>
        </div>
      </Dialog> */}
    </>
  );
}
