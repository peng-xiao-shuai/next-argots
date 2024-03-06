import { createContext } from '&/trpc/context';
import { appRouter } from '&/trpc/routers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

// export const config = {
//   runtime: 'edge',
// };

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
