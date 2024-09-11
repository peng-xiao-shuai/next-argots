/**
 * 配置 payload CMS 无头内容管理系统
 * @author peng-xiao-shuai
 * @see https://www.youtube.com/watch?v=06g6YJ6JCJU&t=8070s
 */

import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { en } from 'payload/i18n/en';
import { zh } from 'payload/i18n/zh';
import { ja } from 'payload/i18n/ja';
import { fileURLToPath } from 'url';
import { slateEditor } from '@payloadcms/richtext-slate';
import { Feedback } from './collections/Feedback';
import { Room } from './collections/Room';
import { InviteLink } from './collections/InviteLink';
import { Users } from './collections/User';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: slateEditor({}),
  collections: [Users, Feedback, Room, InviteLink],

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  debug: process.env.NODE_ENV === 'production' ? false : true,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
    connectOptions: {
      dbName: process.env.DATABASE_DB || 'test',
    },
  }),

  /**
   * Payload can now accept specific translations from 'payload/i18n/en'
   * This is completely optional and will default to English if not provided
   */
  i18n: {
    supportedLanguages: { en, zh, ja },
  },

  admin: {
    user: 'users',
    meta: {
      titleSuffix: 'Payload manage',
    },
    autoLogin: {
      email: 'test@test.com',
      password: 'test',
      prefillOnly: true,
    },
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: '1612565136@qq.com',
          role: 'user',
          password: 'test',
        },
      });
    }
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.

  // This is temporary - we may make an adapter pattern
  // for this before reaching 3.0 stable
  sharp,
});
