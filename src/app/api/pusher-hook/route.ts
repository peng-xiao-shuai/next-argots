import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  const body = await req.json();
  console.log(req.headers.get('user-agent'));

  console.log(req.headers.get('X-Pusher-Key'));
  console.log(req.headers.get('X-Pusher-Signature'));
  return Response.json({ a: 1 });
};

export { handler as POST };
