/**
 * @author: peng-xiao-shuai
 * @date: 2024-01-We 06:58:00
 * @last Modified by: peng-xiao-shuai
 * @last Modified time: 2024-01-We 06:58:00
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { nextApp, nextRequestHandler } from './next-utils';
import { pusherAuthApi } from './pusher/pusher-auth';
import * as trpcExpress from '@trpc/server/adapters/express';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { inferAsyncReturnType } from '@trpc/server';
import nextBuild from 'next/dist/build';
import { config } from 'dotenv';
import { appRouter } from './trpc/routers';
import { getPayloadClient } from './payload/get-payload';

if (process.env.NODE_ENV === 'development') {
  config({ path: '.env.development.local' });
}
config({ path: '.env.local' });
config({ path: '.env' });

const port = Number(process.env.PORT) || 3000;
const app = express();

export const createContext = ({
  req,
  res,
}: CreateHTTPContextOptions | CreateWSSContextFnOptions) => ({ req, res });

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const start = async () => {
  // 获取 payload
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        console.log('\x1b[36m%s\x1b[0m', '✨✨Admin URL: ' + cms.getAdminURL());
      },
    },
  });
  if (process.env.NEXT_BUILD) {
    app.listen(port, async () => {
      payload.logger.info('Next.js is building for production');

      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'));

      process.exit();
    });

    return;
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());

  pusherAuthApi(app);

  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      /**
       * @see https://trpc.io/docs/server/adapters/express#3-use-the-express-adapter
       * @example
        // 加了 返回了 req, res 之后可以在 trpc 路由中直接访问
        import { createRouter } from '@trpc/server';
        import { z } from 'zod';

        const exampleRouter = createRouter<Context>()
          .query('exampleQuery', {
            input: z.string(),
            resolve({ input, ctx }) {
              // 直接访问 req 和 res
              const userAgent = ctx.req.headers['user-agent'];
              ctx.res.status(200).json({ message: 'Hello ' + input });

              // 你的业务逻辑
              ...
            },
          });
       */
      createContext,
    })
  );
  app.use((req, res) => nextRequestHandler(req, res));

  // 准备生成 .next 文件
  nextApp.prepare().then(() => {
    app.listen(port, () => {
      console.log(
        '\x1b[36m%s\x1b[0m',
        `🎉🎉> Ready on ${process.env.NEXT_PUBLIC_SERVER_URL}. Port: ${port}`
      );
    });
  });
};

start();
