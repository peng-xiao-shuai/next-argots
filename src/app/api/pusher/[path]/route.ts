import { NextRequest } from 'next/server';
import { pusherAuthApi } from './pusher-auth';

const handler = (
  req: NextRequest,
  { params: { path } }: { params: { path: keyof typeof pusherAuthApi } }
) => {
  return pusherAuthApi[path](req);
};

export { handler as GET, handler as POST };
