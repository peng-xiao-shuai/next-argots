'use client';
import { ImageSvg } from '@/components';
import { AppContext, ChatPopoverContext, LinkPreviewInfo } from '@/context';
import { Chat, ChatMsg, MESSAGE_TYPE } from '@/hooks/use-pusher';
import { useRoomStore } from '@/hooks/use-room-data';
import { unicodeToString } from '@/utils/string-transform';
import { FC, memo, useCallback, useContext, useMemo } from 'react';
import { COMMON_KEYS } from '@@/locales/keys';
import { cn } from '@/utils/utils';
import { ContentMsg, ContentReply } from './ClientChatRecordContentModule';

type ExtensionRecord<T> = {
  last: T | null;
  next: T | null;
};

export const ClientChatRecordContent: FC<
  {
    chatItem: ChatMsg;
    replyMsg: string | undefined;
    onChatClick: (timestamp: ChatMsg['timestamp']) => void;
  } & ExtensionRecord<Chat>
> = memo(({ chatItem, next, last, replyMsg, onChatClick }) => {
  const { t } = useContext(AppContext);
  const isSystemType = useCallback(
    (data: Chat | null) =>
      data?.type === MESSAGE_TYPE.SYSTEM
        ? false
        : data?.user.id == chatItem.user.id,
    [chatItem.user.id]
  );
  const { userInfo } = useRoomStore();
  const isUserMessage = useMemo(() => {
    return chatItem.user.nickname === userInfo.nickname;
  }, [chatItem.user.nickname, userInfo.nickname]);
  const handleClick = useCallback(() => {
    onChatClick(chatItem.timestamp);
  }, [chatItem.timestamp, onChatClick]);

  return (
    <div
      className={cn(
        'chat !pb-0 pt-[0.15rem] *:transition-all *:duration-300 *:relative hover:*:z-[100]',
        `chat-${isUserMessage ? 'end' : 'start'}`,
        !isSystemType(last) && '!pt-2',
        'group-[.group-select]:*:z-[100]'
      )}
    >
      {/* 头像 html 结构 */}
      <div
        className={cn(
          'chat-image avatar rounded-lg',
          !isSystemType(next) && 'b3-opacity-6'
        )}
      >
        <div className="w-10">
          {/* 头像 */}
          {!isSystemType(next) && (
            <ImageSvg
              className="w-10 h-10 border-base-200 border overflow-hidden rounded-lg"
              name={chatItem.user?.avatar}
            ></ImageSvg>
          )}
        </div>
      </div>

      {/* 主体内容 */}
      <div
        id={String(chatItem.timestamp)}
        className={cn(
          'chat-bubble min-h-[unset]',
          'group-[.group-select-model]:cursor-pointer group-[.group-select.group-select-model]:chat-bubble-primary',
          !isSystemType(next)
            ? `user-last ${isUserMessage ? 'rounded-tr-md' : 'rounded-tl-md'}`
            : `before:hidden ${
                isUserMessage ? '!rounded-r-md' : '!rounded-l-md'
              }`,
          !isSystemType(last) ? 'user-first !rounded-t-box' : ''
        )}
        onClick={handleClick}
      >
        {/* 昵称 */}
        {!isSystemType(last) && (
          <div
            className={cn(
              'chat-header text-primary leading-6 line-clamp-1 font-bold text-ellipsis block duration-300 transition-all',
              isUserMessage ? 'text-right' : 'text-left',
              'group-[.group-select.group-select-model]:text-primary-content'
            )}
          >
            {unicodeToString(chatItem.user!.nickname)}
          </div>
        )}
        {/* 回复 */}
        {chatItem.reply && (
          <ContentReply title={unicodeToString(chatItem.reply.user.nickname)}>
            <div
              className={cn('whitespace-break-spaces break-words text-inherit')}
            >
              {replyMsg}
            </div>
          </ContentReply>
        )}
        {/* 内容 */}
        <ContentMsg msg={chatItem.msg}></ContentMsg>
        {/* 已编辑 */}
        {chatItem.isEdit === '1' && (
          <div className="text-right text-sm">{t(COMMON_KEYS.EDIT)}</div>
        )}
      </div>
    </div>
  );
});
ClientChatRecordContent.displayName = 'ClientChatRecordContent';
