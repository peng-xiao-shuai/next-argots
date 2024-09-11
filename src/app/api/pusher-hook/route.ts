import payloadPromise from '@/server/payload/get-payload';
import { InviteLink, Room } from '@/server/payload/payload-types';
import { createHmac } from 'crypto';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  const body = (await req.json()) as {
    time_ms: number;
    events: { name: string; channel: string }[];
  };

  console.log('body', body);
  console.log('user-agent', req.headers.get('user-agent'));
  console.log('x-pusher-signature', req.headers.get('x-pusher-signature'));

  if (req.headers.get('user-agent') === 'pusher-webhooks') {
    const receivedSignature = req.headers.get('x-pusher-signature');
    // const receivedKey = req.headers.get('x-pusher-key');

    const payload = JSON.stringify(body);

    const expectedSignature = createHmac(
      'sha256',
      process.env.PUSHER_APP_SECRET!
    )
      .update(payload)
      .digest('hex');

    console.log('expectedSignature', expectedSignature);

    if (receivedSignature === expectedSignature) {
      const payload = await payloadPromise;
      const remove = async (event: (typeof body)['events'][number]) => {
        if (
          event.channel.includes('presence-') &&
          event.name === 'channel_vacated'
        ) {
          try {
            await payload.login({
              collection: 'users',
              data: {
                email: process.env.PAYLOAD_ADMIN_EMAIL!,
                password: process.env.PAYLOAD_ADMIN_PWD!,
              },
            });
            const { docs: room } = await payload.delete({
              collection: 'rooms',
              where: {
                channel: { equals: event.channel },
              },
            });

            console.log(room);
            console.log('删除：' + event.channel, room);
          } catch (err) {
            console.log(err, '删除报错');
          }
        }
      };
      console.log('body.events', body.events);

      body.events.forEach((event) => {
        remove(event);
      });
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
};

export { handler as POST };
