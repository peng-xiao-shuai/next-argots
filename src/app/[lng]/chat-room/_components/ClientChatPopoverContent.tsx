import type { IconType } from 'react-icons';
import {
  RiCheckboxCircleLine,
  RiDeleteBin5Line,
  RiEditLine,
  RiFileCopy2Line,
  RiReplyAllLine,
} from 'react-icons/ri';
import React, { FC, MouseEvent, memo } from 'react';
import type { ChatMsg } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { COMMON_KEYS } from '@@/locales/keys';
import { ChatPopoverContextData } from '@/context';

export const COMMAND = {
  [COMMON_KEYS.REPLY]: COMMON_KEYS.REPLY,
  [COMMON_KEYS.EDIT]: COMMON_KEYS.EDIT,
  [COMMON_KEYS.COPY_TEXT]: COMMON_KEYS.COPY_TEXT,
  [COMMON_KEYS.DELETE]: COMMON_KEYS.DELETE,
  [COMMON_KEYS.SELECT]: COMMON_KEYS.SELECT,
} as const;

export type CommandType = {
  icon: IconType;
  text: string;
  command: keyof typeof COMMAND;
  role?: 'my' | 'other';
};
export const commands: CommandType[] = [
  {
    icon: RiReplyAllLine,
    text: '回复',
    command: COMMAND.REPLY,
  },
  {
    icon: RiEditLine,
    text: '编辑',
    command: COMMAND.EDIT,
    role: 'my',
  },
  {
    icon: RiFileCopy2Line,
    text: '复制文本',
    command: COMMAND.COPY_TEXT,
  },
  {
    icon: RiDeleteBin5Line,
    text: '删除消息',
    command: COMMAND.DELETE,
  },
  {
    icon: RiCheckboxCircleLine,
    text: '选择此消息',
    command: COMMAND.SELECT,
  },
];
const PopoverContent: FC<{
  cb: (command: CommandType['command']) => void;
  current: ChatPopoverContextData['current'];
}> = ({ cb, current }) => {
  const { userInfo } = useRoomStore();
  const handleClick = (e: MouseEvent<HTMLUListElement>) => {
    const liElement = (e.target as HTMLElement).offsetParent as HTMLElement;
    if (liElement.nodeName === 'LI') {
      const command = (liElement as HTMLElement).dataset
        .command as CommandType['command'];

      cb(command);
    }
  };
  return (
    <ul className="menu !bg-base-100 rounded-box" onClick={handleClick}>
      {commands
        .filter((item) =>
          item.role && item.role == 'my'
            ? current?.chat.user.nickname === userInfo.userId
            : true
        )
        .map((item, index) => (
          <li key={index} data-command={item.command}>
            <a>
              <item.icon className="pointer-events-none"></item.icon>
              <span className="pointer-events-none">{item.text}</span>
            </a>
          </li>
        ))}
    </ul>
  );
};
export const MemoPopoverContent = memo(PopoverContent);
