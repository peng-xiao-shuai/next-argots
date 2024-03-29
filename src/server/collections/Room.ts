/**
 * 频道
 */
import { CollectionConfig } from 'payload/types';
import { UserRole } from '../enum';

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
  access: {
    read: ({ req: { context, user } }) =>
      context.role === UserRole.MEMBER ||
      context.role === UserRole.HOUSE_OWNER ||
      user.role === 'admin',
    delete: ({ req: { context, user } }) =>
      context.role === UserRole.HOUSE_OWNER || user.role === 'admin',
    create: ({ req: { context } }) => context.role === UserRole.MEMBER,
    update: () => false,
  },
};
