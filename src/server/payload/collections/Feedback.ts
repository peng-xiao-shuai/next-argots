/**
 * 反馈
 */
import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload';
import type { FeedbackRecord } from '../payload-types';
import { Resend } from 'resend';
import { slateToHtml } from '../payload-utils';

const beforeChange: CollectionBeforeChangeHook<FeedbackRecord> = async ({
  data,
}) => {
  if (data.email && data.replyContent && data.replyContent.length) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const response = await resend.emails.send({
        from: 'Peng Xiao Shuai <send@argots.cn>',
        to: [data.email],
        subject: '[Feed Back] ' + data.content?.substring(0, 10) + '...',
        html: slateToHtml(data.replyContent),
        reply_to: 'pxs1612565136@gmail.com',
      });

      if (response.error) {
        throw response.error;
      }
    } catch (error) {
      console.log('send Error', error);

      return data;
    }
  }

  // 修改状态为已回复
  data.status = '1';

  return data;
};

export const Feedback: CollectionConfig = {
  slug: 'feedback-record',
  fields: [
    {
      name: 'email',
      type: 'text',
      access: {
        read: ({ req: { user } }) => user?.role === 'admin',
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
    update: ({ req: { user } }) => user?.role === 'admin',
  },
};
