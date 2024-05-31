import { compareSync } from 'bcryptjs';

/**
 * 校验header hash 字段
 */
export const diffHash = (pwd: string, headerHash: string) => {
  return compareSync(pwd, headerHash);
};

/**
 * 判断参数是否存在
 */
export const isPresence = <T, K extends keyof T>(params: T, keys: K[]) => {
  for (let k of keys) {
    if (!Boolean(params[k])) {
      return {
        code: '400',
        message: `'${String(k)}' Parameter missing`,
        data: {},
      };
    }
  }
  return true;
};

export function getBaseUrl() {
  if (
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.NODE_ENV === 'production'
  ) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}`;
  }

  if (typeof window !== 'undefined') {
    return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`;
    return `${process.env.NEXT_PUBLIC_SITE_URL}`;
  }

  if (typeof window !== 'undefined') {
    return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`;
  }

  // assume localhost
  return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`;
}
