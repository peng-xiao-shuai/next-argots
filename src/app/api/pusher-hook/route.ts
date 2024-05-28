import { createHmac } from 'crypto';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  const body = await req.json();
  console.log();
  if (req.headers.get('user-agent') === 'pusher-webhooks') {
    const receivedSignature = req.headers.get('x-pusher-signature');
    const receivedKey = req.headers.get('x-pusher-key');
    console.log(
      'receivedSignature:' + receivedSignature,
      'receivedKey:' + receivedKey
    );

    const payload = JSON.stringify(body);

    const expectedSignature = createHmac(
      'sha256',
      process.env.PUSHER_APP_SECRET!
    )
      .update(payload)
      .digest('hex');

    if (receivedSignature === expectedSignature) {
      console.log('Valid webhook');
      // 处理有效的 webhook 逻辑
      return new Response(
        JSON.stringify({
          data: 'Webhook received',
        }),
        {
          status: 200,
        }
      );
    } else {
      console.log('Invalid webhook');
      return new Response(
        JSON.stringify({
          data: 'Invalid webhook signature',
        }),
        {
          status: 401,
        }
      );
    }
  }
  return Response.json({ a: 1 });
};

export { handler as POST };
