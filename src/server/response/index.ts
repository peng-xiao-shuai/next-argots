export * from './code';
import { CODE } from './code';

type responseClientReturn = {
  code: number;
  data: any;
  message: string;
};

export const MSG = {
  [CODE.success]: 'successfully',
  [CODE.error]: 'failure',
};

/**
 * 管理返回数据到客户端函数
 * @param {typeof CODE} code 状态码
 * @param {any} data 返回数据
 * @param {string|undefined} message 返回信息
 */
export const responseClient = (
  codeKey: keyof typeof CODE,
  data: any,
  message?: string
): responseClientReturn => {
  return {
    code: Number(CODE[codeKey]),
    data,
    message: message || MSG[CODE[codeKey]],
  };
};
