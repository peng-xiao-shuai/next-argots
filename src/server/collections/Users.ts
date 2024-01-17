import { CollectionConfig } from 'payload/types';
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'address',
      required: true,
      type: 'text',
    },
    {
      name: 'points',
      hidden: true,
      defaultValue: 0,
      type: 'number',
    },
  ],
  access: {
    read: () => true,
    delete: () => false,
    create: ({ data, id, req }) => {
      // 设置管理系统不能添加
      return !req.headers.referer?.includes('/admin');
    },
    update: ({ data, id, req }) => {
      // 设置管理系统不能添加
      return !req.headers.referer?.includes('/admin');
    },
  },
};
