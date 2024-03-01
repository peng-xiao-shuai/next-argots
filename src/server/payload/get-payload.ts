/**
 * 处理缓存机制。确保应用中多处需要使用 Payload 客户端时不会重复初始化，提高效率。
 * @author peng-xiao-shuai
 */
import type { InitOptions } from 'payload/config';
import type { Payload } from 'payload';
import payload from 'payload';

// 使用 Node.js 的 global 对象来存储缓存。
let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

/**
 * 负责初始化 Payload 客户端
 * @return {Promise<Payload>}
 */
export const getPayloadClient = async ({
  initOptions,
}: {
  initOptions?: Partial<InitOptions>;
} = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is missing');
  }

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    // payload 初始化赋值
    cached.promise = payload.init({
      // email: {
      //   transport: transporter,
      //   fromAddress: 'hello@joshtriedcoding.com',
      //   fromName: 'DigitalHippo',
      // },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};

export default getPayloadClient;
