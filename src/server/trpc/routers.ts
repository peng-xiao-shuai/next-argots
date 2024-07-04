import { z } from 'zod';
import { authProcedure, procedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { hashSync } from 'bcryptjs';
import payloadPromise from '../payload/get-payload';

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
      const payload = await payloadPromise;

      try {
        await payload.create({
          collection: 'feedback-record',
          data: {
            ...input,
          },
        });
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
  removeRoom: authProcedure
    .input(
      z.object({
        roomName: z.string(),
        nickName: z.string(),
        recordId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomName, nickName, recordId } = input;
      const roomId = hashSync(roomName + ctx.pw, process.env.NEXT_PUBLIC_SALT!);
      const houseOwnerId = hashSync(nickName, process.env.NEXT_PUBLIC_SALT!);

      const payload = await payloadPromise;

      try {
        const room = await payload.delete({
          collection: 'rooms',
          where: {
            id: { equals: recordId },
            roomId: { equals: roomId },
            houseOwnerId: { equals: houseOwnerId },
          },
          context: {
            roomName: roomName,
            recordId: recordId,
          },
        });

        /**
         * 是否存在频道号
         */
        if (room.docs.length) {
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

  inviteLinkCreate: authProcedure
    .input(
      z.object({
        userInfo: z.object({
          nickName: z.string().optional(),
          avatar: z.string().optional(),
        }),
        roomName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomName, userInfo } = input;
      const roomRecordId = hashSync(
        roomName + ctx.pw,
        process.env.NEXT_PUBLIC_SALT!
      );

      const payload = await payloadPromise;

      try {
        const { docs: roomData } = await payload.find({
          collection: 'rooms',
          where: {
            roomId: { equals: roomRecordId },
          },
        });

        const data = await payload.create({
          collection: 'invite-link',
          data: {
            roomId: roomData[0].id,
            userInfo: JSON.stringify({
              ...userInfo,
              roomName,
            }),
            status: '0',
          },
        });

        if (data.id) {
          return data.id;
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Link generation failure',
          });
        }
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  inviteLinkGet: authProcedure
    .input(
      z.object({
        roomName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { roomName } = input;

      const payload = await payloadPromise;

      try {
        const data = await payload.find({
          collection: 'invite-link',
          where: {
            userInfo: { contains: '"roomName":"' + roomName },
          },
        });

        return data.docs;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

  inviteLinkRemove: authProcedure
    .input(
      z.object({
        id: z.string(),
        roomName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, roomName } = input;
      const roomId = hashSync(roomName + ctx.pw, process.env.NEXT_PUBLIC_SALT!);

      const payload = await payloadPromise;

      try {
        const data = await payload.delete({
          collection: 'invite-link',
          where: {
            id: { equals: id },
            roomId: { equals: roomId },
          },
        });

        return Boolean(data.docs.length);
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});

export type AppRouter = typeof appRouter;
