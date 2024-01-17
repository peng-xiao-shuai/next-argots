/**
 * 积分记录
 */
import { CollectionBeforeChangeHook, CollectionConfig } from 'payload/types';
import { PointsRecord as PointsRecordType } from '../payload-types';
import { getPayloadClient } from '../get-payload';

const beforeChange: CollectionBeforeChangeHook<PointsRecordType> = async ({
  data,
}) => {
  const payload = await getPayloadClient();
  data.operateType = (data.count || 0) >= 0 ? 'added' : 'reduce';

  const result = await payload.findByID({
    collection: 'users', // required
    id: data.userId as number, // required
  });

  await payload.update({
    collection: 'users', // required
    id: data.userId as number, // required
    data: {
      ...result,
      points: (result.points || 0) + data.count!,
    },
  });

  return data;
};

export const PointsRecord: CollectionConfig = {
  slug: 'points-record',
  fields: [
    {
      name: 'userId',
      type: 'relationship',
      required: true,
      relationTo: 'users',
    },
    {
      name: 'count',
      type: 'number',
      required: true,
    },
    {
      name: 'operateType',
      type: 'select',
      hidden: true,
      options: [
        {
          label: '增加',
          value: 'added',
        },
        {
          label: '减少',
          value: 'reduce',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [beforeChange],
  },
  access: {
    read: () => true,
    delete: () => false,
    create: () => true,
    update: () => false,
  },
};
