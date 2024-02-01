import { Lng, languages, FALLBACK_LNG } from './i18n';

export const DEFAULT_NS = 'translation';
export const COOKIE_NAME = 'i18next';

export function getOptions(lng: Lng = FALLBACK_LNG, ns: string = DEFAULT_NS) {
  return {
    // debug: true,
    supportedLngs: languages,
    // preload: languages,
    fallbackLng: FALLBACK_LNG,
    lng,
    fallbackNS: DEFAULT_NS,
    defaultNS: DEFAULT_NS,
    ns,
  };
}
