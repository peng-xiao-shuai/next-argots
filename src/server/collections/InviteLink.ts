/**
 * 邀请链接
 */
import { CollectionConfig } from 'payload/types';

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
      name: 'userinfo',
      type: 'text',
      required: true,
    },
    {
      name: 'hash',
      type: 'text',
      required: true,
    },
  ],
  access: {
    read: () => true,
    delete: () => true,
    create: () => true,
    update: () => false,
  },
};
