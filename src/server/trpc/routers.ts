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
import { hashSync } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { requestPusherApi } from '../pusher/pusher-auth';
import pusher from '../pusher/get-pusher';
import { UserRole } from '../enum';

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
  removeRoom: procedure
    .input(
      z.object({
        roomName: z.string(),
        nickName: z.string(),
        recordId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomName, nickName, recordId } = input;
      const roomId = hashSync(
        roomName,
        '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
      );
      const houseOwnerId = hashSync(
        nickName,
        '$2a$10$' + process.env.NEXT_PUBLIC_SALT!
      );
      const payload = await getPayloadClient();
      try {
        const room = await payload.findByID({
          collection: 'room',
          id: recordId,
        });

        /**
         * 是否存在房间号
         */
        if (room.id) {
          await payload.delete({
            collection: 'room',
            where: {
              roomId: { equals: roomId },
              houseOwnerId: { equals: houseOwnerId },
            },
          });

          const data = await requestPusherApi<{ users: { id: string }[] }>(
            `/apps/${process.env.PUSHER_APP_ID}/channels/presence-${roomName}/users`
          );

          if (data?.users?.length) {
            // 断开所有用户
            data.users.forEach((user) => {
              pusher.terminateUserConnections(user.id);
            });
          }

          return;
        } else {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'do not have permission',
          });
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
