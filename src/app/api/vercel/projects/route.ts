import bcrypt from 'bcryptjs';
import { Room } from '@/server/payload/payload-types';
import payloadPromise from '@/server/payload/get-payload';

const handleSetSALT = async (req: Request) => {
  // 使用 Vercel 的 API 更新环境变量
  const vercelToken = process.env.TK;
  console.log(req.headers.get('Authorization'));

  if (req.headers.get('Authorization') !== `Bearer ${vercelToken}`) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const projectId = process.env.PROJECT_ID;

  // 生成新的 salt
  const newSalt = await bcrypt.genSalt(10);

  const payload = await payloadPromise;

  const data = await payload.count({
    collection: 'rooms',
  });

  /**
   * 集合中没有文档才更新
   */
  if (data.totalDocs === 0) {
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
