import { z } from 'zod';
import { procedure, router } from './trpc';
import { verifyMessage } from 'ethers';
import { responseClient } from '../response';
import { getPayloadClient } from '../get-payload';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  signIn: procedure
    .input(
      z.object({
        message: z.string(),
        signature: z.string(),
        address: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      /**
       * address 需要传入的是转小写
       */
      const { message, signature, address } = input;
      const { res } = ctx;

      // 从签名中恢复地址
      const signerAddress = verifyMessage(message, signature);

      // 比较恢复的地址和预期的地址
      if (signerAddress.toLowerCase() === address) {
        try {
          const payload = await getPayloadClient();
          const { docs: users } = await payload.find({
            collection: 'users',
            where: {
              address: {
                equals: address,
              },
            },
          });

          console.log(users.length ? '存在用户信息' : '不存在用户');

          if (users.length) {
            await payload.login({
              collection: 'users',
              data: {
                email: address + '@payloadcms.com',
                password: address,
              },
              res,
            });

            return responseClient('success', {});
          } else {
            await payload.create({
              collection: 'users',
              data: {
                email: address + '@payloadcms.com',
                address,
                password: address,
              },
            });

            await payload.login({
              collection: 'users',
              data: {
                email: address + '@payloadcms.com',
                password: address,
              },
              res,
            });

            return responseClient('success', {});
          }
        } catch (error: any) {
          console.log(error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '签名验证失败',
        });
      }
    }),
});
