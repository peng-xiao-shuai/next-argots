/**
 * 邀请链接
 */
import { UserRole } from '@/server/enum';
import type { CollectionAfterReadHook, CollectionConfig } from 'payload';
import { InviteLink as InviteLinkType } from '../payload-types';

const afterRead: CollectionAfterReadHook<InviteLinkType> = ({
  context,
  req,
  doc,
}) => {
  if (context.setStatus) {
    req.payload.update({
      collection: 'invite-link',
      id: doc.id,
      data: {
        status: context.setStatus as InviteLinkType['status'],
      },
    });
  }
};

export const InviteLink: CollectionConfig = {
  slug: 'invite-link',
  fields: [
    {
      name: 'roomId',
      type: 'relationship',
      required: true,
      relationTo: 'rooms',
    },
    {
      name: 'userInfo',
      type: 'text',
      required: true,
    },
    {
      // 邀请状态
      name: 'status',
      type: 'select',
      defaultValue: '0',
      options: [
        {
          label: 'unused',
          value: '0',
        },
        {
          label: 'used',
          value: '1',
        },
      ],
    },
  ],
  hooks: {
    afterRead: [afterRead],
  },
  access: {
    read: ({ req: { context, user } }) => user?.role === 'admin',
    delete: () => false,
    create: () => false,
    update: () => false,
  },
};
