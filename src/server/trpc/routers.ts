/*
 * @Author: peng-xiao-shuai
 * @Date: 2024-01-11 15:30:42
 * @LastEditors: peng-xiao-shuai
 * @LastEditTime: 2024-01-12 10:24:23
 * @Description:
 */
import { procedure, router } from './trpc';
import { authRouter } from './auth-router';
import { PointsRouter } from './points-router';
export const appRouter = router({
  auth: authRouter,
  pointsRouter: PointsRouter,
  hello: procedure.query((opts) => {
    return 'hello world';
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
