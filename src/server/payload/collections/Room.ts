/**
 * 频道
 */
import type { CollectionBeforeDeleteHook, CollectionConfig } from 'payload';
import { UserRole } from '../../enum';
import { requestPusherApi } from '@/app/api/utils';
import pusher from '@/app/api/pusher/[path]/get-pusher';

const beforeDelete: CollectionBeforeDeleteHook = async ({ context, req }) => {
  const data = await requestPusherApi<{ users: { id: string }[] }>(
    `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${context.roomName}/users`
  );

  if (data?.users?.length) {
    // 断开所有用户
    data.users.forEach((user) => {
      pusher.terminateUserConnections(user.id);
    });
  }

  /**
   * 清除房间记录
   */
  req.payload.delete({
    collection: 'invite-link',
    where: {
      /**
       * 这里只会有一个
       */
      roomId: { equals: context.recordId },
    },
  });
};

export const Room: CollectionConfig = {
  slug: 'rooms',
  fields: [
    {
      name: 'roomId',
      type: 'text',
      required: true,
    },
    {
      name: 'houseOwnerId',
      type: 'text',
      required: true,
    },
    {
      name: 'channel',
      type: 'text',
      required: true,
    },
    {
      name: 'hash',
      type: 'text',
      required: true,
    },
    {
      name: 'iv',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    beforeDelete: [beforeDelete],
  },
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    create: () => false,
    update: () => false,
  },
};
