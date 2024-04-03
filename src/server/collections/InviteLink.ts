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
  access: {
    read: () => true,
    delete: () => true,
    create: () => true,
    update: () => false,
  },
};
