/**
 * @author: peng-xiao-shuai
 * @date: 2024-01-We 06:58:00
 * @last Modified by: peng-xiao-shuai
 * @last Modified time: 2024-01-We 06:58:00
 */
import express from 'express';
import { nextApp, nextRequestHandler } from './next-utils';
import { getPayloadClient } from './get-payload';
import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType } from '@trpc/server';
import { config } from 'dotenv';
import { appRouter } from './trpc/routers';
config({ path: '.env.local' });
config({ path: '.env' });

const port = Number(process.env.PORT) || 3000;
const app = express();

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

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

  // @see https://github.com/vercel/next.js/issues/54977
  // app.get('/setting', async (req, res) => {
  //   try {
  //     // 手动渲染页面到 HTML
  //     const html = await nextApp.renderToHTML(req, res, '/setting', {});

  //     if (!html) {
  //       res.status(500).end('Internal Server Error');
  //       return;
  //     }

  //     console.log(parseCookies(req.cookies));

  //     // 修改 HTML 内容
  //     const modifiedHtml = html.replace(
  //       `data-theme="dark"`,
  //       `data-theme="light"`
  //     );

  //     // 发送修改后的 HTML
  //     res.send(modifiedHtml);
  //   } catch (error: any) {
  //  报错 Cannot read properties of undefined (reading 'ensurePage')
  //     console.log('\x1b[36m%s\x1b[0m', error.message);
  //   }
  // });

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
        `🎉🎉> Ready on http://localhost:${port}`
      );
    });
  });
};

start();
