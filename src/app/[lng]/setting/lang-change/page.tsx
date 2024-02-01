'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { useState } from 'react';
import { Lng } from '@/locales/i18n';
import { useTranslation } from '@/locales/client';
import { usePathname, useRouter } from 'next/navigation';
import { COOKIE_NAME } from '@/locales/settings';
import { useCookies } from 'react-cookie';

const langs: { label: string; value: Lng }[] = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: '繁體中文',
    value: 'zh-TW',
  },
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: '日本語',
    value: 'ja-JP',
  },
];

export default function LangChange({ params: { lng } }: CustomReactParams) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const path = usePathname();
  const [, setCookie] = useCookies([COOKIE_NAME]);
  const [locale, setLocale] = useState(i18n.language);
  const handleSwitchLang = (item: (typeof langs)[0]) => {
    if (item.value !== locale) {
      setLocale(item.value);
    }
  };

  const handleComplete = () => {
    setCookie(COOKIE_NAME, locale);

    router.replace(path.replace(lng, locale));
  };
  useBusWatch('complete', handleComplete);

  return (
    <div className="lang-list bg-opacity-10 bg-neutral-content rounded-lg">
      {langs.map((item, index) => (
        <label
          key={item.label}
          className="border-t lang-list-item label px-4 h-14 flex items-center justify-between"
          onClick={() => handleSwitchLang(item)}
          style={{
            borderTopColor: index ? 'oklch(var(--bc) / 0.1)' : 'transparent',
          }}
        >
          <span className="label-text">{item.label}</span>
          <input
            type="radio"
            name="radio"
            className={`
            ${locale !== item.value ? 'opacity-0' : ''},
            radio checked:bg-primary
            `}
            checked={locale === item.value}
            value={item.value}
            onChange={({ target }) => {
              setLocale(target.value as Lng);
            }}
          />
        </label>
      ))}
    </div>
  );
}
