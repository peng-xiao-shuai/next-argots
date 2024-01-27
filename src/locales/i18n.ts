import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// 导入你的翻译文件
import enUS from './en-US';
import jaJP from './ja-JP';
import zhTW from './zh-TW';
import zhCN from './zh-CN';

const resources = {
  'ja-JP': { translation: jaJP },
  'zh-TW': { translation: zhTW },
  'en-US': { translation: {} },
  'zh-CN': { translation: {} },
};

export type Resources = {
  [key in keyof typeof resources]: (typeof resources)[key] & {
    translation: Indexes;
  };
};

// 拆解中文语言 key 作为 英文
for (const i in zhCN) {
  (resources as Resources)['zh-CN'].translation[i] = (zhCN as Indexes)[i];
  (resources as Resources)['en-US'].translation[i] =
    (enUS as Indexes)[i] || i.replace(/\_/g, ' ');
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: resources,
  fallbackLng: 'en-US',
  debug: true,
});

export default i18n;
