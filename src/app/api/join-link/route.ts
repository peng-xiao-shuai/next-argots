import clientPromise from '@/server/db';
import { InviteLink, Room } from '@/server/payload/payload-types';
import { NextRequest } from 'next/server';
import { res } from '../utils';

export interface Data extends InviteLink {
  roomData: Room[];
  roomId: string;
}

export type JoinLinkType = {
  code: string;
  data: Data;
  message?: string;
};

const handler = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get('id')!;
  const client = await clientPromise;
  const collection = client
    .db(process.env.DATABASE_DB)
    .collection<InviteLink>('invite-link');
  try {
    const data = await collection
      .aggregate<Data>([
        {
          $lookup: {
            from: 'rooms', // 集合B的名称
            localField: 'roomId', // 集合A中用于匹配的字段
            foreignField: 'roomId', // 集合B中匹配的字段
            as: 'roomData', // 添加到集合A文档中的字段名，包含匹配的集合B的文档
          },
        },
        {
          $match: {
            id,
          },
        },
      ])
      .toArray();

    if (data.length) {
      // 存在邀请链接
      if (data[0].status === '0') {
        // 未被使用
        await collection.updateOne(
          {
            id,
          },
          {
            $set: {
              status: '1',
            },
          }
        );

        if (data[0].roomData.length) {
          // 频道存在
          return res(
            {
              data: data[0],
            },
            200
          );
        } else {
          return res(
            {
              data: {},
              message: 'Channel closed',
            },
            403
          );
        }
      } else {
        return res(
          {
            data: {},
            message: 'The link has been used',
          },
          403
        );
      }
    } else {
      return res(
        {
          data: {},
          message: 'link rot',
        },
        400
      );
    }
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
