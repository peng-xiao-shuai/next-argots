/*
 * @Author: peng-xiao-shuai
 * @Date: 2024-01-11 15:30:42
 * @LastEditors: peng-xiao-shuai
 * @LastEditTime: 2024-01-12 10:24:23
 * @Description:
 */
import { z } from 'zod';
import { procedure, router } from './trpc';
import { getPayloadClient } from '../payload/get-payload';
import { TRPCError } from '@trpc/server';
export const appRouter = router({
  feedbackAdd: procedure
    .input(
      z.object({
        type: z.enum(['1', '2', '3']),
        email: z.string().optional(),
        content: z.string().min(1).max(300),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payload = await getPayloadClient();
      try {
        await payload.create({
          collection: 'feedback-record',
          data: input,
        });
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
