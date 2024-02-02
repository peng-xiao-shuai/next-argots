/**
 * 反馈
 */
import { CollectionBeforeChangeHook, CollectionConfig } from 'payload/types';
import { FeedbackRecord } from '../payload/payload-types';
import { getPayloadClient } from '../payload/get-payload';

const beforeChange: CollectionBeforeChangeHook<FeedbackRecord> = async ({
  data,
}) => {
  // const payload = await getPayloadClient();
  // data.operateType = (data.count || 0) >= 0 ? 'added' : 'reduce';

  // const result = await payload.findByID({
  //   collection: 'users', // required
  //   id: data.userId as any, // required
  // });

  // await payload.update({
  //   collection: 'users', // required
  //   id: data.userId as any, // required
  //   data: {
  //     ...result,
  //     points: (result.points || 0) + data.count!,
  //   },
  // });

  return data;
};

export const Feedback: CollectionConfig = {
  slug: 'feedback-record',
  fields: [
    {
      name: 'email',
      type: 'text',
      access: {
        read: ({ req: { user } }) => user.role === 'admin',
      },
      admin: {
        readOnly: true,
      },
    },
    {
      // 回复状态
      name: 'status',
      type: 'select',
      defaultValue: '0',
      options: [
        {
          label: 'no reply',
          value: '0',
        },
        {
          label: 'replied',
          value: '1',
        },
      ],
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      admin: {
        readOnly: true,
      },
      options: [
        {
          label: 'issus',
          value: '1',
        },
        {
          label: 'opinion',
          value: '2',
        },
        {
          label: 'i want to',
          value: '3',
        },
      ],
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'replyContent',
      type: 'richText',
      admin: {},
    },
  ],
  hooks: {
    beforeChange: [beforeChange],
  },
  access: {
    read: () => true,
    delete: () => false,
    create: () => false,
    update: ({ req: { user } }) => user.role === 'admin',
  },
};
