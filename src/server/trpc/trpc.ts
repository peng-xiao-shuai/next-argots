import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';
import { cookies } from 'next/headers';
import { diffHash } from '@/utils/server-utils';
const t = initTRPC.context<Context>().create();

const authMiddleware = t.middleware(({ ctx, next }) => {
  const hash = cookies().get('hash')?.value;
  if (!diffHash(cookies().get('pw-256')?.value || '', hash || '')) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      hash,
    },
  });
});
// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
/**
 * @see https://trpc.nodejs.cn/docs/server/middlewares#authorization
 */
export const authProcedure = t.procedure.use(
  authMiddleware.unstable_pipe(({ ctx, next }) => {
    return next({
      ctx,
    });
  })
);

export const createCallerFactory = t.createCallerFactory;
