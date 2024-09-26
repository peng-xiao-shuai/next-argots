import { getOptions } from './settings';
import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import enUS from '../../public/locales/en-US';
import jaJP from '../../public/locales/ja-JP';
import zhTW from '../../public/locales/zh-TW';
import zhCN from '../../public/locales/zh-CN';
import { LOCALES_KEYS } from '@@/locales/keys';

let cacheI18n: i18n;

export const DEFAULT_NS = 'translation' as const;
export type Lng = keyof typeof resources;

export type Resources = {
  [K in Lng]: (typeof resources)[K] & {
    [DEFAULT_NS]: {
      [P in LOCALES_KEYS]: P extends keyof (typeof resources)[K][typeof DEFAULT_NS]
        ? (typeof resources)[K][typeof DEFAULT_NS][P]
        : P extends keyof (typeof resources)[typeof FALLBACK_LNG][typeof DEFAULT_NS]
        ? (typeof resources)[typeof FALLBACK_LNG][typeof DEFAULT_NS][P]
        : 'undefined';
    };
  };
};

// 更改默认语言时需要更改next.config.mjs的重写路径
export const FALLBACK_LNG = 'en-US' as const;
export const resources = {
  'en-US': { [DEFAULT_NS]: enUS },
  'ja-JP': { [DEFAULT_NS]: jaJP },
  'zh-TW': { [DEFAULT_NS]: zhTW },
  'zh-CN': { [DEFAULT_NS]: zhCN },
};
export const languages = Object.keys(resources) as Lng[];

// 拆解中文语言 key 作为 英文
for (const i in zhCN) {
  (resources['en-US'][DEFAULT_NS] as any)[i] =
    (enUS as Indexes)[i] || i.replace(/\_/g, ' ');
}

const initI18next = async (lng: Lng, ns: string = DEFAULT_NS) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend(resources))
    .init(getOptions(FALLBACK_LNG, ns));
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
