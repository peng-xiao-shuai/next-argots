'use client';
import {
  AvatarName,
  Dialog,
  ImageSvg,
  ShareForm,
  type ShareFormDataRules,
} from '@/components';
import { usePusher } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { trpc } from '@/server/trpc/client';
import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';
import LoadingRender from '../../loading';
import { InviteLink } from '@/server/payload/payload-types';
import { GoLink, GoTrash } from 'react-icons/go';
import { copyText } from '@/utils/string-transform';
import { debounce } from '@/utils/debounce-throttle';
import { LinkUserInfo } from './Client';
import type { FieldPath } from 'react-hook-form';
import { AppContext, ClientChatContext } from '@/context';
import { CHAT_ROOM_KEYS, COMMON_KEYS } from '@@/locales/keys';

export type JoinChannel = (
  formData: ShareFormDataRules,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => Promise<{
  prop: FieldPath<ShareFormDataRules> | `root.${string}` | 'root';
  msg: string;
} | void>;

export const ClientShare: FC<{
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  joinChannelSignin: (formData?: ShareFormDataRules) => Promise<string>;
}> = ({ visible, setVisible, joinChannelSignin }) => {
  const { joinData } = useContext(ClientChatContext);

  const joinChannel = useMemo<JoinChannel | undefined>(
    () =>
      !joinData
        ? undefined
        : async (formData, setLoading) => {
            const userInfo = JSON.parse(joinData!.userInfo) as LinkUserInfo;
            const { data, message } = await (
              await fetch('/api/pusher/checkNickName', {
                method: 'post',
                body: JSON.stringify({
                  roomName: userInfo.roomName,
                  nickName: formData.nickName,
                }),
              })
            ).json();

            /**
             * 使 nickname 输入框下弹出错误提示
             */
            if (data) {
              return {
                prop: 'root.nickName',
                msg: message,
              };
            }
            setLoading(true);

            joinChannelSignin(formData)
              .then((res) => {
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);

                setLoading(false);
              });
          },
    [joinChannelSignin, joinData]
  );

  const [listVisible, setListVisible] = useState(false);
  const { isChannelUserExist } = usePusher();
  const [list, setList] = useState<InviteLink[]>([]);
  const { mutate, isLoading } = trpc.inviteLinkGet.useMutation({
    onSuccess: (data) => {
      setList(data);
    },
  });
  const { mutate: removeMutate } = trpc.inviteLinkRemove.useMutation();
  const showLinkList = () => {
    setVisible(false);
    setListVisible(true);
    mutate({
      roomName: useRoomStore.getState().encryptData.roomName,
    });
  };

  const setListVIsibleCb = (bol: boolean) => {
    setListVisible(bol);

    if (!bol) {
      setVisible(true);
    }
  };

  return (
    <>
      <Dialog
        contentClassName="bg-base-100 w-[90vw]"
        visible={listVisible}
        setVisible={setListVIsibleCb}
      >
        <LinkRecord
          isLoading={isLoading}
          list={list || []}
          removeMutate={removeMutate}
          setList={setList}
        ></LinkRecord>
      </Dialog>

      <Dialog visible={visible} setVisible={setVisible}>
        <div className="flex flex-wrap justify-center">
          <ShareForm
            showLinkList={showLinkList}
            isChannelUserExist={isChannelUserExist}
            joinChannel={joinChannel}
          ></ShareForm>
        </div>
      </Dialog>
    </>
  );
};

const LinkRecord: FC<{
  isLoading: boolean;
  removeMutate: (opts: { roomName: string; id: string }) => void;
  list: InviteLink[];
  setList: Dispatch<SetStateAction<InviteLink[]>>;
}> = ({ isLoading, list, removeMutate, setList }) => {
  const { t } = useContext(AppContext);

  if (isLoading) {
    return <LoadingRender></LoadingRender>;
  }

  if (list.length == 0) {
    return (
      <div className="h-20 w-full leading-10 text-center text-neutral-content">
        {t(COMMON_KEYS.NO_DATA)}
      </div>
    );
  }
  const handleClick = (item: InviteLink) => {
    if (item.status === '1') {
      return;
    }

    copyText(`${location.href}?link=${item.id}`);
  };

  const handleRemove = (item: InviteLink) => {
    setList((state) => {
      const CopyList = [...state];
      CopyList.splice(list.indexOf(item), 1);
      return CopyList;
    });

    removeMutate({
      id: item.id,
      roomName: useRoomStore.getState().encryptData.roomName,
    });
  };

  return (
    <div className="max-h-72 overflow-y-auto">
      {list.map((item) => {
        const user = JSON.parse(item.userInfo) as {
          avatar: AvatarName;
          nickName: string;
        };
        return (
          <div
            key={item.id}
            className={`relative box-border w-full py-2 px-4 mb-2 last-of-type:mb-0 flex justify-between items-center rounded-lg overflow-hidden ${
              item.status != '1'
                ? 'bg-gradient-to-l from-primary/25 to-base-200'
                : 'b3-opacity-6'
            }`}
            onClick={() => {
              handleClick(item);
            }}
          >
            {item.status !== '1' && (
              <div className="absolute right-[25%] top-2/4 -translate-y-2/4 z-0">
                <GoLink className="size-10 fill-white/15"></GoLink>
              </div>
            )}

            <div className="info relative z-10">
              <div className="flex gap-2 items-center">
                <ImageSvg className="h-7 w-7" name={user.avatar}></ImageSvg>
                <div className="line-clamp-1 text-sm leading-none">
                  {user.nickName === ''
                    ? t(CHAT_ROOM_KEYS.NO_NICKNAME)
                    : `"${user.nickName}"`}
                </div>
              </div>
              <span className="text-sm leading-none text-base-content text-opacity-50">
                {item.id}
              </span>
            </div>
            <div className="flex gap-2 items-center h-full">
              <button
                className="btn btn-sm btn-outline h-full"
                onClick={(e) => {
                  e.stopPropagation();

                  debounce(() => {
                    handleRemove(item);
                  });
                }}
              >
                <GoTrash></GoTrash>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
