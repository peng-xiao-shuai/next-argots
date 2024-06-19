/**
 * @description 类型保护
 * @see https://www.tslang.cn/docs/handbook/advanced-types.html 搜索 “自定义类型保护”
 * @param {T} obj 值，它必须是联合类型
 * @param {(obj: T) => boolean} cb 回调函数，返回一个布尔值
 * @example
 * const a = [] | string
 * a.push() // 报错
 * if (isTypeProtect<typeof a, []>(a, (a) => Array.isArray(a))) {
 *   a.push() // 正常
 * }
 * @returns {boolean}
 */
export const isTypeProtect = <T, P extends T>(
  obj: T,
  cb: (obj: P) => boolean
): obj is P => cb(obj as P);
