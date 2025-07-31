import AES from '@/utils/aes';
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useContext,
  useRef,
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
import {
  AppContext,
  ChatPopoverContext,
  CommandChatMsg,
  definedCurrent,
} from '@/context';
import emitter from '@/utils/bus';
import { createPusherSignature } from '@/app/api/utils';
import { COMMAND } from '@/app/(app)/[lng]/chat-room/_components/ClientChatPopoverContent';
import { isTypeProtect } from '@/utils/type';

export enum MESSAGE_TYPE {
  PING = 'ping',
  PONG = 'pong',
  MSG = 'msg',
  SYSTEM = 'system',
}

export interface ChatBase {
  type: MESSAGE_TYPE;
  msg: string;
  /**
   * 作为id
   */
  timestamp: number;
}

export interface ChatMsg extends ChatBase {
  type: MESSAGE_TYPE.MSG;
  user: {
    id: string;
    avatar: AvatarName;
    nickname: string;
  };
  isEdit: '0' | '1';
  reply?: {
    timestamp: ChatBase['timestamp'];
    user: ChatMsg['user'];
  };
  /**
   * 操作时间，包括回复时间，编辑信息时间
   */
  operateTimestamp?: ChatBase['timestamp'];
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
let lastChatHistory: Chat;

Pusher.logToConsole = process.env.NODE_ENV === 'development';
export const usePusher = (
  setChat?: Dispatch<SetStateAction<Chat[]>>,
  chats?: Chat[]
) => {
  const { replace } = useRouter();
  const { t, language } = useContext(AppContext);
  const { syncCurrent, setCurrent } = useContext(ChatPopoverContext);
  const chatDataCopy = useRef<Chat[]>([]);
  const [pusher, setPusher] = useState<typeof cachePusher>(cachePusher);
  // const decryptionFailure = useMemo(
  //   () =>
  //     t(CHAT_ROOM_KEYS.DECRYPTION_FAILURE, {
  //       origin:
  //         process.env.NEXT_PUBLIC_SERVER_URL +
  //         '/' +
  //         language +
  //         '/setting/about/feedback',
  //     }).replace(/&#x2F;/g, '/'),
  //   [language]
  // );

  useEffect(() => {
    if (channel && window.location.pathname.includes('/chat-room') && chats) {
      lastChatHistory = chats[chats.length - 1] || [];
      chatDataCopy.current = chats;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  useEffect(() => {
    if (channel && window.location.pathname.includes('/chat-room') && setChat) {
      observeEntryOrExit();
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
      const pwdHash =
        opts.hash ||
        hashSync(encryptData.password, process.env.NEXT_PUBLIC_SALT!);

      if (!cachePusher) {
        cachePusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
          forceTLS: true,
          userAuthentication: {
            endpoint: API_URL.PUSHER_SIGNIN,
            transport: 'ajax',
            paramsProvider: () => {
              const data = {
                roomStatus: opts.roomStatus,
                ...encryptData,
                pwdHash,
                reconnection: (!!useRoomStore.getState().userInfo
                  .userId).toString(),
              };
              const hash = createPusherSignature({
                method: 'POST',
                path: API_URL.PUSHER_SIGNIN,
                params: data,
                secret: process.env.NEXT_PUBLIC_SALT!,
              });
              return {
                data: JSON.stringify(data),
                hash,
              };
            },
          },
          channelAuthorization: {
            endpoint: API_URL.PUSHER_AUTH,
            transport: 'ajax',
            paramsProvider: () => {
              const data = {
                ...opts,
                ...encryptData,
                pwdHash,
                reconnection: (!!useRoomStore.getState().userInfo
                  .userId).toString(),
              };
              const hash = createPusherSignature({
                method: 'POST',
                path: API_URL.PUSHER_AUTH,
                params: data,
                secret: process.env.NEXT_PUBLIC_SALT!,
              });
              return {
                data: JSON.stringify(data),
                hash,
              };
            },
          },
        });

        setPusher(cachePusher);

        if (process.env.NODE_ENV === 'development') {
          cachePusher.bind_global((...arg: any) => {
            // 订阅成功
            console.log('全局监听', arg);
          });
        }

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
              reject(new Error(status.toString()));
            }
          );
          channel.bind(
            'pusher:subscription_succeeded',
            ({ me: { info, id } }: SubscriptionSuccessMember) => {
              const { setUserInfoData } = useRoomStore.getState();
              setUserInfoData(info);

              Aes = new AES({
                passphrase: pwdHash,
                ivHexString: info.iv,
              });
              channel.unbind('pusher:subscription_succeeded');
              resolve(pwdHash);
            }
          );
        }
      );
    });
  };

  /**
   * 观察用户进入频道或者离开频道,订阅成功
   */
  const observeEntryOrExit = () => {
    console.log('重新监听');

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
            name: unicodeToString(info.nickname),
          })}`,
        });

        DistributionHistory(info);
      }
    );

    channel.bind(
      'pusher:member_removed',
      ({ info }: { info: AuthSuccessUserData['user_info'] }) => {
        setChatValue({
          type: MESSAGE_TYPE.SYSTEM,
          timestamp: Date.now(),
          msg: `🔌🔌 ${
            info.role !== UserRole.HOUSE_OWNER
              ? t(CHAT_ROOM_KEYS.MEMBER_REMOVED, {
                  name: unicodeToString(info.nickname),
                })
              : t(CHAT_ROOM_KEYS.OWNER_MEMBER_REMOVED, {
                  name: unicodeToString(info.nickname),
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
    interface DecryptedValue extends CommandChatMsg {
      chat: ChatMsg[];
    }

    const handleCommand = (
      decryptedValue: DecryptedValue,
      user: ChatMsg['user']
    ) => {
      let setFun: Parameters<typeof setChatValue>[0] = (state) => state;
      const { command, chat } = decryptedValue;
      switch (command) {
        case COMMAND.DELETE:
          setFun = (state) =>
            state.filter(
              (item) => !chat.map((c) => c.timestamp).includes(item.timestamp)
            );
          break;
        case COMMAND.EDIT:
          setFun = (state) => {
            const CopyState = [...state];
            /**
             * edit 和 reply chat 只会有一个所以直接使用 0 下标
             */
            const index = state.findIndex(
              (item) => item.timestamp === chat[0].timestamp
            );

            const data = CopyState[index] as ChatMsg;

            if (data) {
              data.isEdit = '1';
              data.msg = chat[0].msg;
              data.operateTimestamp = chat[0].operateTimestamp;
            }

            return CopyState;
          };
          break;
        case COMMAND.REPLY:
          setFun = {
            timestamp: chat[0].timestamp,
            msg: chat[0].msg,
            type: MESSAGE_TYPE.MSG,
            user,
            reply: chat[0].reply,
            isEdit: '0',
            status: 'success',
          };
          break;
      }

      setChatValue(setFun);
    };
    channel.bind(
      CustomEvent.RECEIVE_INFORMATION,
      async (dataStr: string, metadata: Metadata) => {
        const user_info = (channel as PresenceChannel)?.members.get(
          metadata.user_id!
        ).info as AuthSuccessUserData['user_info'];

        const decryptedValue = JSON.parse(
          (await Aes?.decrypt(dataStr)) || ''
        ) as ChatMsg[] | DecryptedValue;

        console.log('解密后数据', decryptedValue);

        /**
         * ChatMsg 类型则是普通发送信息
         */
        if (
          isTypeProtect<typeof decryptedValue, DecryptedValue>(
            decryptedValue,
            (obj) => Boolean(obj.command)
          )
        ) {
          /**
           * CommandChatMsg 指令类型消息
           */
          handleCommand(decryptedValue, {
            id: metadata.user_id!,
            nickname: user_info.nickname,
            avatar: user_info.avatar as AvatarName,
          });
        } else {
          setChatValue({
            timestamp: decryptedValue[0].timestamp,
            msg: decryptedValue[0].msg,
            type: MESSAGE_TYPE.MSG,
            user: {
              id: metadata.user_id!,
              nickname: user_info.nickname,
              avatar: user_info.avatar as AvatarName,
            },
            isEdit: '0',
            status: 'success',
          });
        }
      }
    );
  };

  /**
   * 客户端发送
   * @param {string} content 内容
   * @param {(() => void) | undefined} cb
   */
  const clientSendMessage = async (content: string, cb?: () => void) => {
    if (!cachePusher || !channel) {
      toast(t(CHAT_ROOM_KEYS.UNCONNECTED_CHANNEL));
      return;
    }
    const { encryptData, userInfo } = useRoomStore.getState();
    const timestamp = Date.now();
    /**
     * 需要加密的信息, 当正常发消息没有指令时，只需要加密 chat 数组
     */

    const chatData: CommandChatMsg = {
      command: '',
      chat: [
        {
          type: MESSAGE_TYPE.MSG,
          msg: content,
          timestamp,
          user: {
            id: userInfo.userId!,
            avatar: encryptData.avatar,
            nickname: encryptData.nickName,
          },
          isEdit: '0',
          status: 'loading',
        },
      ],
    };
    /**
     * 发送过去的 加密信息
     */
    let encryptedValue: string | undefined = '';
    let setFun: Parameters<typeof setChatValue>[0] = (state) => state;

    if (syncCurrent.current?.command) {
      chatData.command = syncCurrent.current?.command;
      switch (syncCurrent.current!.command) {
        /**
         * COMMAND.EDIT | COMMAND.REPLY 指令时 syncCurrent.current.chat 只有一个对象，所以大胆使用 [0]
         */
        case COMMAND.EDIT:
          if (syncCurrent.current?.chat[0].msg === content) return;

          setFun = (state) => {
            const CopyState = [...state];
            const index = state.findIndex((item) => {
              return item.timestamp === syncCurrent.current?.chat[0]?.timestamp;
            });

            const data = CopyState[index] as ChatMsg;

            if (data) {
              data.isEdit = '1';
              data.msg = content;
              data.operateTimestamp = timestamp;
            }

            return CopyState;
          };
          chatData.chat = [
            {
              ...syncCurrent.current!.chat[0],
              msg: content,
              isEdit: '1',
              operateTimestamp: timestamp,
            },
          ];
          break;
        case COMMAND.REPLY:
          chatData.chat[0].reply = {
            timestamp: syncCurrent.current.chat[0].timestamp,
            user: syncCurrent.current.chat[0].user,
          };
          chatData.chat[0].operateTimestamp = timestamp;
          setFun = chatData.chat[0];
          break;
      }

      encryptedValue = await Aes?.encrypt(JSON.stringify(chatData));
    } else {
      setFun = chatData.chat[0];
      encryptedValue = await Aes?.encrypt(JSON.stringify(chatData.chat));
    }
    setChatValue(setFun);

    cb?.();

    const triggered = channel.trigger(
      CustomEvent.RECEIVE_INFORMATION,
      encryptedValue
    );

    /**
     * 清除当前的操作指令信息
     */
    setCurrent({
      ...definedCurrent,
    });

    setChatValue((state) => {
      const copyState = [...state];
      let index: number | undefined;

      if (syncCurrent.current?.command) {
        index = copyState.findIndex(
          (item) => (item as ChatMsg).operateTimestamp == timestamp
        );
      } else {
        index = copyState.findIndex((item) => item.timestamp == timestamp);
      }

      if (index >= 0) {
        copyState[index].status = triggered ? 'success' : 'error';
      }

      return copyState;
    });
  };

  /**
   * 客户端聊天记录操作
   * @param {((triggered: boolean) => void) | undefined} cb
   */
  const clientOperateMessage = async (cb?: (triggered: boolean) => void) => {
    if (!cachePusher || !channel) {
      toast(t(CHAT_ROOM_KEYS.UNCONNECTED_CHANNEL));
      return;
    }
    if (!syncCurrent.current) return;

    const timestamp = Date.now();
    const chatData: ChatMsg[] = syncCurrent.current.chat.map((item) => ({
      ...item,
      operateTimestamp: timestamp,
    }));

    const encryptedValue = await Aes?.encrypt(
      JSON.stringify({
        command: syncCurrent.current!.command,
        chat: chatData,
      })
    );
    let triggered: boolean = false;
    let setFun: (state: Chat[]) => Chat[] = (state) => state;
    switch (syncCurrent.current?.command) {
      case COMMAND.DELETE:
        triggered = channel.trigger(
          CustomEvent.RECEIVE_INFORMATION,
          encryptedValue
        );
        setFun = (state) =>
          state.filter(
            (item) => !chatData.map((c) => c.timestamp).includes(item.timestamp)
          );
        break;
    }

    if (triggered) {
      setChatValue(setFun);
    } else {
      syncCurrent.current?.command && toast(t(syncCurrent.current?.command));
    }

    cb?.(triggered);
  };

  /**
   * 清除更改chat的监听
   */
  const removeObserve = () => {
    console.log('断开监听');

    channel?.unbind_all();
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
    >,
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
    cachePusher?.disconnect();
    cachePusher?.unsubscribe('presence-' + encryptData.roomName);
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

  /**
   * 发起聊天记录读取请求（非频道主才会使用）
   */
  const getChatHistory = async () => {
    const { encryptData } = useRoomStore.getState();
    cachePusher!.connect();

    /**
     * 如果存在聊天则读取记录（非频道主）
     */
    if (lastChatHistory) {
      cachePusher?.bind(
        'pusher:signin_success',
        ({ user_data }: { user_data: string }) => {
          const data = JSON.parse(user_data) as SigninSuccessUserData;
          console.log('订阅 recordChannels', data);

          let recordChannels: Channel | null = cachePusher!.subscribe(
            'private-' + encryptData.roomName + data.id
          );
          recordChannels.bind(
            'pusher:subscription_count',
            async (data: { subscription_count: number }) => {
              if (data.subscription_count === 2) {
                const encryptedValue = await Aes?.encrypt(
                  JSON.stringify(lastChatHistory)
                );
                /**
                 * 发送获取聊天记录请求
                 */
                recordChannels!.trigger(CustomEvent.GET_RECORDS_REQ, {
                  chatStr: encryptedValue,
                });
              }
            }
          );
          recordChannels.bind(
            CustomEvent.GET_RECORDS_RES,
            async ({ chatsStr }: { chatsStr: string }, metadata: Metadata) => {
              const decodeChats = JSON.parse(
                (await Aes?.decrypt(chatsStr)) || '[]'
              ) as Chat[];
              setChatValue((state) => state.concat(decodeChats));

              recordChannels!.unbind_all();
              recordChannels?.cancelSubscription();
              cachePusher?.unsubscribe(
                'private-' + encryptData.roomName + data.id
              );
              console.log('退订 recordChannels', recordChannels);
            }
          );
        }
      );
    }
  };

  /**
   * 频道主分发聊天记录
   */
  const DistributionHistory = (
    info: SubscriptionSuccessMember['me']['info']
  ) => {
    const { userInfo, encryptData } = useRoomStore.getState();

    /**
     * 频道主分配记录给重连用户
     */
    if (info.reconnection === 'true' && userInfo.roomRecordId) {
      const recordChannels = cachePusher!.subscribe(
        'private-' + encryptData.roomName + info.socket_id
      );
      recordChannels.bind(
        CustomEvent.GET_RECORDS_REQ,
        async ({ chatStr }: { chatStr: string }) => {
          const decodeChat = JSON.parse(
            (await Aes?.decrypt(chatStr)) || '{}'
          ) as unknown as Chat;
          const lastIndex = chatDataCopy.current.findIndex(
            (item) => item.timestamp === decodeChat.timestamp
          );
          /**
           * 发送聊天记录
           */
          const encryptedChats = await Aes?.encrypt(
            JSON.stringify([...chatDataCopy.current].splice(lastIndex + 1))
          );
          recordChannels.trigger(CustomEvent.GET_RECORDS_RES, {
            chatsStr: encryptedChats,
          });
          recordChannels.unbind_all();
          cachePusher?.unsubscribe(
            'private-' + encryptData.roomName + info.socket_id
          );
        }
      );
    }
  };
  /**
   * 主动断开连接
   */
  const disconnect = () => {
    cachePusher?.disconnect();
  };

  return {
    pusher,
    signin,
    isChannelUserExist,
    clientSendMessage,
    clientOperateMessage,
    observeEntryOrExit,
    exitRoom,
    unsubscribe,
    disconnect,
    getChatHistory,
  };
};
