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
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.NODE_ENV === 'production'
  ) {
    return `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const TrpcProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,

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
