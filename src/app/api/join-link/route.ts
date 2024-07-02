import { InviteLink, Room } from '@/server/payload/payload-types';
import { NextRequest } from 'next/server';
import { res } from '../utils';
import payloadPromise from '@/server/payload/get-payload';

export interface Data extends InviteLink {
  /**
   * 频道数据
   */
  roomData: Room;
}

export type JoinLinkType = {
  code: string;
  data: Data;
  message?: string;
};

const handler = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')!;
  const payload = await payloadPromise;

  try {
    const data = await payload.findByID({
      collection: 'invite-link',
      id,
      depth: 2,
      context: {
        setStatus: '1',
      },
    });

    if (!data.id)
      return res(
        {
          data: {},
          message: 'link rot',
        },
        400
      );

    // 存在邀请链接
    if (data.status !== '0')
      return res(
        {
          data: {},
          message: 'The link has been used',
        },
        403
      );

    if (!(data.roomId as Room).id)
      return res(
        {
          data: {},
          message: 'Channel closed',
        },
        403
      );

    // 频道存在
    return res(
      {
        data: {
          ...data,
          roomData: data.roomId,
        },
      },
      200
    );
  } catch (error: any) {
    return res(
      {
        data: {},
        message: error.message,
      },
      500
    );
  }
};

export { handler as GET };
