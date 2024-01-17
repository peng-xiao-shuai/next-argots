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
