import AES from '@/utils/aes';
import { useState } from 'react';
import Pusher from 'pusher-js';
import type { Channel } from 'pusher-js';
import { toast } from 'sonner';
import { useRoomStore } from './use-room-data';
import { API_URL } from '@/enum';

export enum MESSAGE_TYPE {
  INIT = 'init',
  PING = 'ping',
  PONG = 'pong',
  MSG = 'msg',
}

export type ChatObj = {
  type: MESSAGE_TYPE;
  msg: string;
};
export type Chat = ChatObj & {
  isMy?: boolean;
};

let channel: Channel;
let cachePusher: Pusher;
Pusher.logToConsole = true;
export const usePusher = () => {
  const [chat, setChat] = useState<Chat[]>([]);
  const [aes, setAes] = useState<AES>();
  const [pusher, setPusher] = useState<Pusher>(cachePusher);
  // 设置加密
  // const aes = ;
  // 3vS+Hi2uerOSnnOH49Epqw==

  // useEffect(() => {
  //   console.log('开始');

  //   // 特别注意执行 Aes 是一个昂贵的过程
  //   // setAes(
  //   //   new AES({
  //   //     passphrase: 'ccc',
  //   //     salt: 'cccc',
  //   //   })
  //   // );
  // }, []);

  const signin = () => {
    return new Promise((resolve, reject) => {
      const { encryptData } = useRoomStore.getState();

      cachePusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
        forceTLS: true,
        userAuthentication: {
          endpoint: API_URL.PUSHER_SIGNIN,
          transport: 'ajax',
          params: encryptData,
          headers: {},
        },
        channelAuthorization: {
          endpoint: API_URL.PUSHER_AUTH,
          transport: 'ajax',
          params: encryptData,
          headers: {},
        },
      });

      // cachePusher.disconnect();
      console.log(encryptData);

      setPusher(cachePusher);

      cachePusher?.bind_global((...arg: any) => {
        // 订阅成功
        console.log('全局监听', arg);
      });

      cachePusher!.signin();
      channel = cachePusher!.subscribe('presence-' + encryptData.roomName);

      channel.bind(
        'pusher:subscription_error',
        ({ status }: { status: number }) => {
          if (status == 403) {
            toast('用户已存在');

            channel.unbind('pusher:subscription_error');

            reject(new Error('用户已存在'));
            return;
          }
        }
      );
      channel.bind('pusher:subscription_succeeded', (data: any) => {
        channel.unbind('pusher:subscription_succeeded');
        resolve('');
      });
    });
  };

  return {
    chat,
    pusher,
    signin,
  };
};
