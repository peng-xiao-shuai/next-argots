/**
 * 配置 payload CMS 无头内容管理系统
 * @author peng-xiao-shuai
 * @see https://www.youtube.com/watch?v=06g6YJ6JCJU&t=8070s
 */

import path from 'path';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';
import { Users } from '../collections/Users';
import { Feedback } from '../collections/Feedback';

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL?.replace('$PORT', '3000');

export default buildConfig({
  // 设置服务器的 URL，从环境变量 NEXT_PUBLIC_SERVER_URL 获取。
  serverURL,
  collections: [Users, Feedback],
  admin: {
    user: 'users',
    // 设置用于 Payload CMS 管理界面的打包工具，这里使用了
    bundler: webpackBundler(),
    // 配置管理系统 Meta
    meta: {
      titleSuffix: 'Payload manage',
    },
    autoLogin: {
      email: '1612565136@qq.com',
      password: 'test',
      prefillOnly: true,
    },
    components: {
      views: {},
    },
    // css: path.resolve(__dirname, '../../styles/payload-tailwindcss.css'),
  },
  debug: process.env.NODE_ENV === 'production' ? false : true,
  // 定义路由，例如管理界面的路由。
  routes: {
    admin: '/admin',
  },
  // 设置富文本编辑器，这里使用了 Slate 编辑器。
  editor: slateEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  rateLimit: {
    max: 500,
    trustProxy: false,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
  }),
});
