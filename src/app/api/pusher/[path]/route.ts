import { NextRequest } from 'next/server';
import { pusherAuthApi } from './pusher-auth';

type Params = Promise<{  path: keyof typeof pusherAuthApi }>
const handler = async  (
  req: NextRequest,
  segmentData: { params: Params }
) => {
  const { path } = await segmentData.params
  return pusherAuthApi[path](req);
};

export { handler as POST };
