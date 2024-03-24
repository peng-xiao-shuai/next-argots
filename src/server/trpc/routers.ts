/*
 * @Author: peng-xiao-shuai
 * @Date: 2024-01-11 15:30:42
 * @LastEditors: peng-xiao-shuai
 * @LastEditTime: 2024-01-12 10:24:23
 * @Description:
 */
import { z } from 'zod';
import { procedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { hashSync } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { requestPusherApi } from '../../app/api/pusher/[path]/pusher-auth';
import pusher from '../../app/api/pusher/[path]/get-pusher';
import clientPromise from '../db';
import { FeedbackRecord, Room } from '../payload/payload-types';

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
      const client = await clientPromise;
      const collection = client
        .db(process.env.DATABASE_DB)
        .collection<FeedbackRecord>('feedback-records');

      try {
        await collection.insertOne({
          ...input,
          id: new ObjectId().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

      const client = await clientPromise;
      const collection = client
        .db(process.env.DATABASE_DB)
        .collection<Room>('rooms');
      try {
        const room = await collection.findOneAndDelete({
          id: recordId,
          houseOwnerId,
          roomId,
        });

        /**
         * 是否存在房间号
         */
        if (room.ok) {
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
