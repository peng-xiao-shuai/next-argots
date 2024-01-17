import { z } from 'zod';
import { procedure, router } from './trpc';
import { getPayloadClient } from '../get-payload';
import { TRPCError } from '@trpc/server';

export const PointsRouter = router({
  added: procedure
    .input(
      z.object({
        userId: z.number(),
        count: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const payload = await getPayloadClient();
      try {
        await payload.create({
          collection: 'points-record',
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
