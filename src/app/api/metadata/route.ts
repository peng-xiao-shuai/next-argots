import type { NextApiRequest, NextApiResponse } from 'next';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server';
function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const data = req.cookies._parsed.get('setting');
  console.log(data);

  return NextResponse.json({ body: data }, { status: 200 });
}

export { handler as GET };
