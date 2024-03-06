/**
 * 房间
 */
import { CollectionConfig } from 'payload/types';

export const Room: CollectionConfig = {
  slug: 'room',
  fields: [
    {
      name: 'roomName',
      type: 'text',
    },
    {
      name: 'houseOwnerId',
      type: 'text',
    },
    {
      name: 'hash',
      type: 'text',
    },
    {
      name: 'salt',
      type: 'text',
    },
    {
      name: 'iv',
      type: 'text',
    },
  ],
  access: {
    read: ({ req: { user } }) => user.role === 'admin',
    delete: ({ req: { user } }) => user.role === 'admin',
    create: () => true,
    update: () => false,
  },
};
