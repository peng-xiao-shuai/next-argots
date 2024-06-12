import AES from '@/utils/aes';
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
} from 'react';
import Pusher from 'pusher-js';
import type { Channel, PresenceChannel } from 'pusher-js';
import Metadata from 'pusher-js/types/src/core/channels/metadata';
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
} from '@/app/api/pusher/[path]/pusher-type';
import { API_KEYS, CHAT_ROOM_KEYS } from '@@/locales/keys';
import { UseMutateFunction } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AvatarName } from '@/components/ImageSvg';
import { AppContext } from '@/context';
import emitter from '@/utils/bus';

export enum MESSAGE_TYPE {
  PING = 'ping',
  PONG = 'pong',
  MSG = 'msg',
  SYSTEM = 'system',
}

export interface ChatBase {
  type: MESSAGE_TYPE;
  msg: string;
  timestamp: number;
}

export interface ChatMsg extends ChatBase {
  type: MESSAGE_TYPE.MSG;
  isMy: boolean;
  user: {
    id: string;
    avatar: AvatarName;
    nickname: string;
  };
  status: 'loading' | 'success' | 'error';
}
export interface ChatSystem extends ChatBase {
  type: MESSAGE_TYPE.SYSTEM;
  status?: 'success';
}

export type Chat = ChatMsg | ChatSystem;

export type MemberInfo = {
  id: string;
  info: {
    name: string;
  };
};

let channel: PresenceChannel | Channel;
let cachePusher: Pusher | null;
let Aes: AES | null;
Pusher.logToConsole = process.env.NODE_ENV === 'development';
export const usePusher = (setChat?: Dispatch<SetStateAction<Chat[]>>) => {
  const { replace } = useRouter();
  const { t, language } = useContext(AppContext);
  const [pusher, setPusher] = useState<typeof cachePusher>(cachePusher);

  useEffect(() => {
    if (channel && window.location.pathname.includes('/chat-room') && setChat) {
      ObserveEntryOrExit();
      receiveInformation();

      return () => {
        removeObserve();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChat]);

  /**
   * 身份验证
   *
   * roomStatus 进入频道状态，RoomStatus.JOIN 为加入频道， RoomStatus.ADD 为创建频道
   *
   * roomId 只有在通过邀请链接进入时存在
   *
   * hash 只有在通过邀请链接进入时存在
   */
  const signin = (opts: {
    roomStatus: RoomStatus;
    roomId?: string;
    hash?: string;
  }) => {
    return new Promise<string>((resolve, reject) => {
      const { encryptData } = useRoomStore.getState();
      const hash =
        opts.hash ||
        hashSync(encryptData.password, process.env.NEXT_PUBLIC_SALT!);

      if (!cachePusher) {
        cachePusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
          forceTLS: true,
          userAuthentication: {
            endpoint: API_URL.PUSHER_SIGNIN,
            transport: 'ajax',
            params: {
              roomStatus: opts.roomStatus,
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
              ...opts,
              ...encryptData,
            },
            paramsProvider: () => ({
              reconnection: !!useRoomStore.getState().userInfo.userId,
            }),
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
        cachePusher?.connection.bind('state_change', (error: any) => {
          if (
            error.previous === 'connecting' &&
            error.current === 'unavailable'
          ) {
            emitter.emit(
              'setNavTitle',
              CHAT_ROOM_KEYS.NAV_TITLE_CONNECT_UNAVAILABLE
            );
          }
        });
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
              cachePusher?.disconnect();
              cachePusher = null;
              reject(new Error());
            }
          );
          channel.bind(
            'pusher:subscription_succeeded',
            ({ me: { info, id } }: SubscriptionSuccessMember) => {
              const { setUserInfoData, setData } = useRoomStore.getState();
              setUserInfoData(info);

              Aes = new AES({
                passphrase: hash,
                ivHexString: info.iv,
              });
              channel.unbind('pusher:subscription_succeeded');
              resolve(hash);
            }
          );
        }
      );
    });
  };

  /**
   * 观察用户进入频道或者离开频道
   */
  const ObserveEntryOrExit = () => {
    console.log('开启监听');

    /**
     * 重连也会触发加入和删除
     */
    channel.bind(
      'pusher:member_added',
      ({ info }: { info: AuthSuccessUserData['user_info'] }) => {
        setChatValue({
          type: MESSAGE_TYPE.SYSTEM,
          timestamp: Date.now(),
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
          type: MESSAGE_TYPE.SYSTEM,
          timestamp: Date.now(),
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
            replace('/' + language);
          }, 1000);
        }
      }
    );
  };

  /**
   * 绑定自定义接受信息事件
   */
  const receiveInformation = () => {
    channel.bind(
      CustomEvent.RECEIVE_INFORMATION,
      async ({ msg, timestamp }: ChatMsg, metadata: Metadata) => {
        const user_info = (channel as PresenceChannel)?.members.get(
          metadata.user_id!
        ).info as AuthSuccessUserData['user_info'];

        const decryptedValue = await Aes?.decrypt(msg);

        setChatValue({
          type: MESSAGE_TYPE.MSG,
          isMy: false,
          user: {
            id: metadata.user_id!,
            nickname: user_info.name,
            avatar: user_info.avatar as AvatarName,
          },
          timestamp,
          msg:
            decryptedValue ||
            t(CHAT_ROOM_KEYS.DECRYPTION_FAILURE, {
              origin:
                process.env.NEXT_PUBLIC_SERVER_URL +
                '/' +
                language +
                '/setting/about/feedback',
            }).replace(/&#x2F;/g, '/'),
          status: 'success',
        });
      }
    );
  };

  /**
   * 客户端发送
   */
  const ClientSendMessage = async (content: string, cb?: () => void) => {
    if (!cachePusher || !channel) {
      toast(t(CHAT_ROOM_KEYS.UNCONNECTED_CHANNEL));
      return;
    }
    const { encryptData, userInfo } = useRoomStore.getState();
    const timestamp = Date.now();
    setChatValue({
      type: MESSAGE_TYPE.MSG,
      msg: content,
      timestamp,
      isMy: true,
      user: {
        id: userInfo.userId!,
        avatar: encryptData.avatar,
        nickname: encryptData.nickName,
      },
      status: 'loading',
    });

    cb?.();
    const encryptedValue = await Aes?.encrypt(content);

    const triggered = channel.trigger(CustomEvent.RECEIVE_INFORMATION, {
      type: MESSAGE_TYPE.MSG,
      msg: encryptedValue,
      timestamp,
    });

    setChatValue((state) => {
      const copyState = [...state];
      const index = copyState.findIndex((item) => item.timestamp == timestamp);
      if (index >= 0) {
        copyState[index].status = triggered ? 'success' : 'error';
      }

      return copyState;
    });
  };

  /**
   * 清除更改chat的监听
   */
  const removeObserve = () => {
    console.log('removeObserve');

    channel?.unbind('pusher:member_removed');
    channel?.unbind('pusher:member_added');
    channel?.unbind(CustomEvent.RECEIVE_INFORMATION);
  };

  /**
   *修改数据
   */
  const setChatValue = (value: Chat | ((state: Chat[]) => Chat[])) => {
    setChat?.(typeof value === 'function' ? value : (c) => c.concat(value));
  };

  /**
   * 頻道主退出清除频道人员以及删除数据
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
    const { encryptData, userInfo } = useRoomStore.getState();
    const user_info = (channel as PresenceChannel)?.members.get(
      userInfo.userId!
    )?.info;

    if (user_info?.role === UserRole.HOUSE_OWNER) {
      mutate({
        roomName: encryptData.roomName,
        nickName: encryptData.nickName,
        recordId: user_info.roomRecordId || '',
      });
    } else {
      unsubscribe();
    }
  };

  /**
   * 退订
   */
  const unsubscribe = () => {
    const { encryptData, setUserInfoData } = useRoomStore.getState();
    setUserInfoData({});

    removeObserve();
    cachePusher?.unsubscribe('presence-' + encryptData.roomName);
    cachePusher?.disconnect();
    cachePusher = null;
    Aes = null;
  };

  /**
   * 判断用户是否存在
   */
  const isChannelUserExist = (nickName: string) =>
    Object.keys((channel as PresenceChannel)?.members.members).includes(
      nickName
    );

  return {
    pusher,
    signin,
    isChannelUserExist,
    ClientSendMessage,
    ObserveEntryOrExit,
    exitRoom,
    unsubscribe,
  };
};
