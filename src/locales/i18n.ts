import { getOptions } from './settings';
import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import enUS from '../../public/locales/en-US';
import jaJP from '../../public/locales/ja-JP';
import zhTW from '../../public/locales/zh-TW';
import zhCN from '../../public/locales/zh-CN';

let cacheI18n: i18n;

export const DEFAULT_NS = 'translation';
export type Resources = {
  [key in keyof typeof resources]: (typeof resources)[key] & {
    [DEFAULT_NS]: Indexes;
  };
};
export type Lng = keyof typeof resources;

export const FALLBACK_LNG = 'en-US';
export const resources = {
  'ja-JP': { [DEFAULT_NS]: jaJP },
  'zh-TW': { [DEFAULT_NS]: zhTW },
  'en-US': { [DEFAULT_NS]: {} },
  'zh-CN': { [DEFAULT_NS]: {} },
};
export const languages = Object.keys(resources) as Lng[];

// 拆解中文语言 key 作为 英文
for (const i in zhCN) {
  (resources as Resources)['zh-CN'][DEFAULT_NS][i] = (zhCN as Indexes)[i];
  (resources as Resources)['en-US'][DEFAULT_NS][i] =
    (enUS as Indexes)[i] || i.replace(/\_/g, ' ');
}

const initI18next = async (lng: Lng, ns: string = DEFAULT_NS) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend(resources))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useTranslation(lng: Lng, options = { keyPrefix: '' }) {
  const i18nextInstance = cacheI18n ? cacheI18n : await initI18next(lng);
  if (!cacheI18n) {
    cacheI18n = i18nextInstance;
  }

  return {
    t: i18nextInstance.getFixedT(lng, options?.keyPrefix || ''),
    i18n: i18nextInstance,
  };
}
