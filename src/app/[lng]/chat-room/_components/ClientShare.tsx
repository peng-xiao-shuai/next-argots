'use client';
import { AvatarName, Dialog, ImageSvg, ShareForm } from '@/components';
import { usePusher } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { trpc } from '@/server/trpc/client';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import LoadingRender from '../../loading';
import { InviteLink } from '@/server/payload/payload-types';
import { GoLink, GoTrash } from 'react-icons/go';
import { copyText } from '@/utils/string-transform';
import { debounce } from '@/utils/debounce-throttle';
import { useBusWatch } from '@/hooks/use-bus-watch';

export const ClientShare = () => {
  const [visible, setVisible] = useState(false);
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

  const handleComplete = () => {
    setVisible(true);
  };

  useBusWatch('complete', handleComplete);

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
  if (isLoading) {
    return <LoadingRender></LoadingRender>;
  }

  if (list.length == 0) {
    return (
      <div className="h-20 w-full leading-10 text-center text-neutral-content">
        No Data
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
            className={`relative box-border w-full py-2 px-4 mb-2 flex justify-between items-center rounded-lg overflow-hidden ${
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
                  {user.nickName === '' ? 'No nickName' : `"${user.nickName}"`}
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
