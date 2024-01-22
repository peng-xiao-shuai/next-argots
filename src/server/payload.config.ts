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
import { Users } from './collections/Users';
import { PointsRecord } from './collections/PointsRecord';

export default buildConfig({
  // 设置服务器的 URL，从环境变量 NEXT_PUBLIC_SERVER_URL 获取。
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  collections: [Users, PointsRecord],
  admin: {
    user: 'users',
    // 设置用于 Payload CMS 管理界面的打包工具，这里使用了
    bundler: webpackBundler(),
    // 配置管理系统 Meta
    meta: {
      titleSuffix: 'Payload manage',
    },
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
  // 配置请求的速率限制，这里设置了最大值。
  rateLimit: {
    max: 2000,
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL!,
  }),
});
