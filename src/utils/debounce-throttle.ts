/**
 * @author: peng-xiao-shuai
 * @date: 2023-09-25 14:24:00
 * @last Modified by: peng-xiao-shuai
 * @last Modified time: 2023-09-25 14:24:00
 */

let timer: any;
// 只执行一次
let debounceOnly = true;
/**
 * 防抖
 * @param callback - 回调事件(必传)
 * @param time - 间隔时间，默认300
 * @param arg - callback 参数
 * @param immediate - 开始时还是结束时 默认false结束时, true开始时
 *  例：<el-button @click="debounce(callback,300)"></el-button>
 */

export const debounce = (
  callback: () => void,
  time?: number,
  arg?: any[],
  immediate = true
): void => {
  const args = arg ? arg : [];
  // 是否立即执行
  if (immediate && debounceOnly) {
    debounceOnly = false;
    callback(...(args as []));

    return;
  }

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    callback(...(args as []));
  }, time || 300);
};

let bol = true;
// 只执行一次
let throttleOnly = true;
/**
 * 节流
 * @param callback - 回调事件(必传)
 * @param time - 间隔时间，默认300
 * @param arg - callback 参数
 * @param immediate - 开始时还是结束时 默认false结束时, true开始时
 *  例：<el-button @click="throttle(callback,300)"></el-button>
 */
export const throttle = (
  callback: () => void,
  time?: number,
  arg?: any[],
  immediate = true
): void => {
  const args = arg ? arg : [];

  // 是否立即执行
  if (immediate && throttleOnly) {
    throttleOnly = false;
    callback(...(args as []));
  }

  if (bol) {
    bol = false;
    setTimeout(() => {
      bol = true;
      callback(...(args as []));
    }, time || 300);
  }
};
