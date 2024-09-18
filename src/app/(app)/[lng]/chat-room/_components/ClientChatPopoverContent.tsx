import type { IconType } from 'react-icons';
import {
  RiCheckboxCircleLine,
  RiDeleteBin5Line,
  RiEditLine,
  RiFileCopy2Line,
  RiReplyAllLine,
} from 'react-icons/ri';
import React, { FC, MouseEvent, memo, useCallback, useContext } from 'react';
import { useRoomStore } from '@/hooks/use-room-data';
import { COMMON_KEYS } from '@@/locales/keys';
import { AppContext, ChatPopoverContextData } from '@/context';

export const COMMAND = {
  REPLY: COMMON_KEYS.REPLY,
  EDIT: COMMON_KEYS.EDIT,
  COPY_TEXT: COMMON_KEYS.COPY_TEXT,
  DELETE: COMMON_KEYS.DELETE,
  SELECT: COMMON_KEYS.SELECT,
} as const;

export type CommandType = {
  icon: IconType;
  text: COMMON_KEYS;
  command: (typeof COMMAND)[keyof typeof COMMAND];
  role?: 'my' | 'other';
};
export const commands: CommandType[] = [
  {
    icon: RiReplyAllLine,
    text: COMMON_KEYS.REPLY,
    command: COMMAND.REPLY,
  },
  {
    icon: RiEditLine,
    text: COMMON_KEYS.EDIT,
    command: COMMAND.EDIT,
    role: 'my',
  },
  {
    icon: RiFileCopy2Line,
    text: COMMON_KEYS.COPY_TEXT,
    command: COMMAND.COPY_TEXT,
  },
  {
    icon: RiDeleteBin5Line,
    text: COMMON_KEYS.DELETE,
    command: COMMAND.DELETE,
  },
  {
    icon: RiCheckboxCircleLine,
    text: COMMON_KEYS.SELECT,
    command: COMMAND.SELECT,
  },
];
export const MemoPopoverContent: FC<{
  cb: (command: CommandType['command']) => void;
  current: ChatPopoverContextData['current'];
}> = memo(({ cb, current }) => {
  const { t } = useContext(AppContext);
  const { userInfo } = useRoomStore();
  const handleClick = useCallback(
    (e: MouseEvent<HTMLUListElement>) => {
      const liElement = (e.target as HTMLElement).offsetParent as HTMLElement;
      if (liElement.nodeName === 'LI') {
        const command = (liElement as HTMLElement).dataset
          .command as CommandType['command'];

        cb(command);
      }
    },
    [cb]
  );
  /**
   * 当前内容是否可以显示指令
   */
  const isSelect = useCallback(() => {
    if (current?.chat) {
      return current.chat[0].user.nickname === userInfo.userId;
    }
    return false;
  }, [current, userInfo.userId]);
  return (
    <ul className="menu b3-opacity-6 rounded-box" onClick={handleClick}>
      {commands
        .filter((item) => (item.role && item.role == 'my' ? isSelect() : true))
        .map((item, index) => (
          <li key={index} data-command={item.command}>
            <a className="px-2">
              <item.icon className="pointer-events-none"></item.icon>
              <span className="pointer-events-none">{t(item.text)}</span>
            </a>
          </li>
        ))}
    </ul>
  );
});
MemoPopoverContent.displayName = 'MemoPopoverContent';
