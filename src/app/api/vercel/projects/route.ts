import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import clientPromise from '@/server/db';
import { Room } from '@/server/payload/payload-types';

const handleSetSALT = async (req: NextApiRequest) => {
  // 生成新的 salt
  const newSalt = await bcrypt.genSalt(10);

  // 使用 Vercel 的 API 更新环境变量
  const vercelToken = process.env.TK;
  const projectId = process.env.PROJECT_ID;

  const client = await clientPromise;
  const collection = client
    .db(process.env.DATABASE_DB)
    .collection<Room>('rooms');

  const data = await collection.countDocuments();

  /**
   * 集合中没有文档才更新
   */
  if (data === 0) {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/env/vX80WDhItfPi7IhC`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: newSalt,
          target: ['production', 'preview', 'development'],
        }),
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ message: 'Failed' }), {
        status: response.status,
      });
    }

    return new Response(
      JSON.stringify({
        message: 'updated successfully',
      }),
      {
        status: 200,
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: 'cancel update',
    }),
    {
      status: 200,
    }
  );
};

export { handleSetSALT as POST };
