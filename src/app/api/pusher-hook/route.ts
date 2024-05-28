import { NextRequest } from 'next/server';

const handler = (req: NextRequest) => {
  console.log(req);

  return Response.json({ a: 1 });
};

export { handler as POST };
