import AES from '@/utils/aes';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import type { Channel } from 'pusher-js';
import { toast } from 'sonner';
import { useRoomStore } from './use-room-data';
import { API_URL, CustomEvent } from '@/enum';
import { unicodeToString } from '@/utils/string-transform';

export enum MESSAGE_TYPE {
  PING = 'ping',
  PONG = 'pong',
  MSG = 'msg',
  MEB_ADD = 'member_added',
  MEB_RF = 'member_removed',
}

export type ChatObj = {
  type: MESSAGE_TYPE;
  msg: string;
};
export type Chat = ChatObj & {
  isMy?: boolean;
};

export type MemberInfo = {
  id: string;
  info: {
    name: string;
  };
};

let channel: Channel;
let cachePusher: Pusher;
Pusher.logToConsole = true;
export const usePusher = (setChat?: Dispatch<SetStateAction<Chat[]>>) => {
  const [aes, setAes] = useState<AES>();
  const [pusher, setPusher] = useState<Pusher>(cachePusher);
  // 设置加密
  // const aes = ;
  // 3vS+Hi2uerOSnnOH49Epqw==

  useEffect(() => {
    console.log(setChat, 'setChat');

    if (channel) {
      removeObserve();

      ObserveEntryOrExit();
      receiveInformation();
    }
    // 特别注意执行 Aes 是一个昂贵的过程
    // setAes(
    //   new AES({
    //     passphrase: 'ccc',
    //     salt: 'cccc',
    //   })
    // );
  }, []);

  /**
   * 校验
   */
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
            // TODO
            toast('用户已存在');

            channel.unbind('pusher:subscription_error');

            // TODO
            reject(new Error('用户已存在'));
            return;
          }

          // TODO
          reject(new Error());
        }
      );
      channel.bind('pusher:subscription_succeeded', (data: any) => {
        channel.unbind('pusher:subscription_succeeded');
        resolve('');
      });
    });
  };

  /**
   * 观察用户进入房间或者离开房间
   */
  const ObserveEntryOrExit = () => {
    console.log('开启监听');

    channel.bind('pusher:member_added', ({ info: { name } }: MemberInfo) => {
      setChatValue({
        type: MESSAGE_TYPE.MEB_ADD,
        // TODO i18n
        msg: `🎉🎉 欢迎 ${unicodeToString(name)} 加入`,
      });
    });

    channel.bind('pusher:member_removed', ({ info: { name } }: MemberInfo) => {
      setChatValue({
        type: MESSAGE_TYPE.MEB_RF,
        // TODO i18n
        msg: `🔌🔌 ${unicodeToString(name)} 已退出`,
      });
    });
  };

  /**
   * 绑定自定义接受信息事件
   */
  const receiveInformation = () => {
    console.log(setChat, 'setChat');

    channel.bind(CustomEvent.RECEIVE_INFORMATION, ({ msg }: ChatObj) => {
      setChatValue({
        type: MESSAGE_TYPE.MSG,
        msg,
      });
    });
  };

  /**
   * 清除更改chat的监听
   */
  const removeObserve = () => {
    channel.unbind('pusher:member_removed');
    channel.unbind('pusher:member_added');
    channel.unbind(CustomEvent.RECEIVE_INFORMATION);
  };

  /**
   *修改数据
   */
  const setChatValue = (value: Chat) => {
    console.log(setChat, 'setChat');

    setChat?.((c) => c.concat(value));
  };

  return {
    pusher,
    signin,
    ObserveEntryOrExit,
  };
};
