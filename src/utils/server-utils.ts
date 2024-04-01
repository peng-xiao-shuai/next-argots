import { hashSync } from 'bcryptjs';

/**
 * 校验header hash 字段
 */
export const diffHash = (pwd: string, headerHash: string) => {
  const hash = hashSync(pwd, '$2a$10$' + process.env.NEXT_PUBLIC_SALT);

  return headerHash === hash;
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
