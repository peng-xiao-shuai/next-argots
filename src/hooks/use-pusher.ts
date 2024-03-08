import AES from '@/utils/aes';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import type { Channel } from 'pusher-js';
import { toast } from 'sonner';
import { useRoomStore } from './use-room-data';
import { API_URL, CustomEvent, RoomStatus, UserRole } from '@/server/enum';
import { unicodeToString } from '@/utils/string-transform';
import { debounce } from '@/utils/debounce-throttle';
import { hashSync } from 'bcryptjs';
import { UserAuthenticationData } from 'pusher-js/types/src/core/auth/options';
import {
  AuthSuccessUserData,
  SigninSuccessUserData,
  SubscriptionSuccessMember,
} from '@/server/pusher/type';
import { useTranslation } from '@/locales/client';
import { API_KEYS, CHAT_ROOM_KEYS } from '@@/locales/keys';
import { UseMutateFunction } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

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
let cachePusher: Pusher | null;
Pusher.logToConsole = true;
export const usePusher = (setChat?: Dispatch<SetStateAction<Chat[]>>) => {
  const { t, i18n } = useTranslation();
  const { replace } = useRouter();
  const [aes, setAes] = useState<AES>();
  const [pusher, setPusher] = useState<typeof cachePusher>(cachePusher);
  // 设置加密
  // const aes = ;
  // 3vS+Hi2uerOSnnOH49Epqw==

  useEffect(() => {
    debounce(() => {
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 校验
   */
  const signin = (roomStatus: RoomStatus) => {
    return new Promise((resolve, reject) => {
      const { encryptData, setUserInfoData } = useRoomStore.getState();
      const hash = hashSync(
        encryptData.password,
        '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
      );

      if (!cachePusher) {
        cachePusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
          forceTLS: true,
          userAuthentication: {
            endpoint: API_URL.PUSHER_SIGNIN,
            transport: 'ajax',
            params: {
              roomStatus,
              ...encryptData,
            },
            headers: {
              hash,
            },
          },
          channelAuthorization: {
            endpoint: API_URL.PUSHER_AUTH,
            transport: 'ajax',
            params: {
              roomStatus,
              ...encryptData,
            },
            headers: {
              hash,
            },
          },
        });

        setPusher(cachePusher);

        cachePusher.bind_global((...arg: any) => {
          // 订阅成功
          console.log('全局监听', arg);
        });
        // cachePusher?.connection.bind('state_change', (error: any) => {
        //   console.error('state_change', error);
        // });
        // cachePusher?.connection.bind('connecting', (error: any) => {
        //   console.error('connection', error);
        // });
        // cachePusher?.connection.bind('connected', (error: any) => {
        //   console.error('connected', error);
        // });
      }

      cachePusher.signin();
      /**
       * 签名成功
       */
      cachePusher.bind(
        'pusher:signin_success',
        ({ user_data }: UserAuthenticationData) => {
          const { user_info } = JSON.parse(user_data) as SigninSuccessUserData;

          /**
           * 判断状态码
           */
          if (user_info.code !== '200') {
            toast.error(user_info.message);
            cachePusher!.unbind('pusher:signin_success');
            // 断开连接并且清除缓存的pusher 否则会导致无法重新签名
            cachePusher!.disconnect();
            cachePusher = null;
            reject(new Error(user_info.message));
            return;
          }
          /**
           * 开始订阅频道会发起 API_URL.PUSHER_AUTH 请求
           */
          channel = cachePusher!.subscribe('presence-' + encryptData.roomName);
          channel.bind(
            'pusher:subscription_error',
            ({ status }: { type: string; status: number; error: string }) => {
              console.log(status);

              switch (status) {
                case 400:
                  toast.error(t(API_KEYS.PUSHER_AUTH_400));
                  break;
                case 500:
                  toast.error(t(API_KEYS.PUSHER_AUTH_500));
                  break;
                case 403:
                  toast.error(t(API_KEYS.PUSHER_AUTH_403));
                  break;
                case 401:
                  toast.error(t(API_KEYS.PUSHER_AUTH_401));
                  break;
                case 423:
                  toast.error(t(API_KEYS.PUSHER_AUTH_423));
                  break;
              }

              channel.unbind('pusher:subscription_error');
              // 断开连接并且清除缓存的pusher 否则会导致无法重新签名
              cachePusher!.disconnect();
              cachePusher = null;
              reject(new Error());
            }
          );
          channel.bind(
            'pusher:subscription_succeeded',
            ({ me: { info } }: SubscriptionSuccessMember) => {
              setUserInfoData(info);
              channel.unbind('pusher:subscription_succeeded');
              resolve('');
            }
          );
        }
      );
    });
  };

  /**
   * 观察用户进入房间或者离开房间
   */
  const ObserveEntryOrExit = () => {
    console.log('开启监听');

    channel.bind(
      'pusher:member_added',
      ({ info }: { info: AuthSuccessUserData['user_info'] }) => {
        setChatValue({
          type: MESSAGE_TYPE.MEB_ADD,
          msg: `🎉🎉 ${t(CHAT_ROOM_KEYS.MEMBER_ADDED, {
            name: unicodeToString(info.name),
          })}`,
        });
      }
    );

    channel.bind(
      'pusher:member_removed',
      ({ info }: { info: AuthSuccessUserData['user_info'] }) => {
        console.log(info);

        setChatValue({
          type: MESSAGE_TYPE.MEB_RF,
          msg: `🔌🔌 ${
            info.role !== UserRole.HOUSE_OWNER
              ? t(CHAT_ROOM_KEYS.MEMBER_REMOVED, {
                  name: unicodeToString(info.name),
                })
              : t(CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED, {
                  name: unicodeToString(info.name),
                })
          }`,
        });

        if (info.role === UserRole.HOUSE_OWNER) {
          unsubscribe();
          const timeID = setTimeout(() => {
            clearTimeout(timeID);
            replace('/' + i18n.language);
          }, 1000);
        }
      }
    );
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
    channel?.unbind('pusher:member_removed');
    channel?.unbind('pusher:member_added');
    channel?.unbind(CustomEvent.RECEIVE_INFORMATION);
  };

  /**
   *修改数据
   */
  const setChatValue = (value: Chat) => {
    console.log(setChat, 'setChat');

    setChat?.((c) => c.concat(value));
  };

  /**
   * 房主退出清除房间人员以及删除数据
   */
  const exitRoom = <
    T extends UseMutateFunction<
      never,
      any,
      {
        roomName: string;
        nickName: string;
        recordId: string;
      }
    >
  >(
    mutate: T
  ) => {
    const { userInfo, encryptData } = useRoomStore.getState();

    if (userInfo.role === UserRole.HOUSE_OWNER) {
      mutate({
        roomName: encryptData.roomName,
        nickName: encryptData.nickName,
        recordId: userInfo.roomRecordId || '',
      });
    } else {
      unsubscribe();
    }
  };

  /**
   * 退订
   */
  const unsubscribe = () => {
    const { encryptData } = useRoomStore.getState();
    removeObserve();
    cachePusher?.unsubscribe('presence-' + encryptData.roomName);
    cachePusher?.disconnect();
    cachePusher = null;
  };

  return {
    pusher,
    signin,
    ObserveEntryOrExit,
    exitRoom,
    unsubscribe,
  };
};
