import { toast } from 'sonner';

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
    .replace(/[_]/g, '\\')
    .split('\\u')
    .filter(Boolean)
    .map((uni) => String.fromCharCode(Number.parseInt(uni, 16)))
    .join('');
};

/**
 * COPY 字符串
 */
export function copyText(value: string, cb?: Function) {
  // 兼容低版本不存在 navigator.clipboard 情况
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success('Copy Successfully');
        cb?.();
      })
      .catch((err) => {
        console.error('Unable to copy text to clipboard', err);
      });
  } else {
    // 创建dom
    const input = document.createElement('input');
    input.setAttribute('value', value);
    input.style.position = 'fixed';
    input.style.left = '999px';
    input.style.top = '10px';
    // 选中文本
    document.body.appendChild(input);
    input.select();

    document.execCommand('copy');

    toast.success('Copy Successfully');
    //  删除dom
    document.body.removeChild(input);

    cb?.();
  }
}
