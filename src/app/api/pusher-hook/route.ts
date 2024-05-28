import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  console.log(await req.json());
  console.log(req.headers['X-Pusher-Key']);
  console.log(req.headers['X-Pusher-Signature']);

  return Response.json({ a: 1 });
};

export { handler as POST };
