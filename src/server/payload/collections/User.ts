import type { CollectionConfig } from 'payload';
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') {
        return true;
      }
      return {
        role: {
          equals: 'user',
        },
      };
    },
    delete: () => false,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
  },
};
