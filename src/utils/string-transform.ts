/**
 * 字符串 token 转对象
 */
export function parseCookies(cookieString: string) {
  const list: { [key: string]: string } = {};
  cookieString &&
    cookieString.split(';').forEach((cookie) => {
      const parts: string[] = cookie.split('=');
      if (parts.length) {
        list[parts.shift()!.trim()] = decodeURI(parts.join('='));
      }
    });
  return list;
}

/**
 * @author: peng-xiao-shuai
 * @date: 2023-09-09 01:04:33
 * @last Modified by: peng-xiao-shuai
 * @last Modified time: 2023-09-09 01:04:33
 */

/**
 * 字符串转unicode
 * @author peng-xiao-shuai
 * @param {string} str
 */
export const stringToUnicode = (str: string) => {
  return str
    .split('')
    .map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
    .join('')
    .replace(/[\/\\]/g, '_');
};

/**
 * unicode 转字符串
 * @author peng-xiao-shuai
 * @param unicodeStr
 */
export const unicodeToString = (unicodeStr: string) => {
  return unicodeStr
    .replace(/[_]/g, '/')
    .split('\\u')
    .filter(Boolean)
    .map((uni) => String.fromCharCode(Number.parseInt(uni, 16)))
    .join('');
};
