/*
 * @Author: peng-xiao-shuai
 * @Date: 2024-01-11 16:06:09
 * @LastEditors: peng-xiao-shuai
 * @LastEditTime: 2024-01-11 16:32:47
 * @Description:
 */
'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '&/trpc/client';
import { httpBatchLink } from '@trpc/client';

export const TrpcProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,

          /**
           * @see https://trpc.io/docs/client/headers
           */
          // async headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },

          /**
           * @see https://trpc.io/docs/client/cors
           */
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
