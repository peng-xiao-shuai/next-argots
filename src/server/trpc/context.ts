import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

type Opts = Partial<FetchCreateContextFnOptions>;
/**
 * 创建上下文 服务端组件中没有req resHeaders
 * @see https://trpc.io/docs/server/adapters/fetch#create-the-context
 */
export function createContext(opts?: Opts): Opts & {
  hash?: string;
  pw?: string;
} {
  return { ...(opts || {}) };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
