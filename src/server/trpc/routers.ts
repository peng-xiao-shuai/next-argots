/*
 * @Author: peng-xiao-shuai
 * @Date: 2024-01-11 15:30:42
 * @LastEditors: peng-xiao-shuai
 * @LastEditTime: 2024-01-12 10:24:23
 * @Description:
 */
import { procedure, router } from './trpc';
export const appRouter = router({
  hello: procedure.query(({ ctx }) => {
    console.log(ctx);

    return 'hello world';
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
