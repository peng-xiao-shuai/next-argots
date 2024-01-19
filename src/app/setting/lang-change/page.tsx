'use client';
import { AppContext } from '@/app/components';
import { Language } from '@/language';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { useContext, useState } from 'react';

const langs: { label: string; value: keyof Language }[] = [
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

export default function LangChange() {
  const setting = useContext(AppContext);
  const [locale, setLocale] = useState(setting.locale);
  // const { locale } = useI18n()
  const handleSwitchLang = (item: (typeof langs)[0]) => {
    if (item.value !== locale) {
      setLocale(item.value);
    }
  };
  const handleComplete = () => {
    window.localStorage.setItem(
      'settings',
      JSON.stringify({
        ...setting,
        locale,
      })
    );
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
            v-model="lang"
            type="radio"
            name="radio"
            className={`
            ${locale !== item.value ? 'opacity-0' : ''},
            radio checked:bg-primary
            `}
            checked={locale === item.value}
            value={item.value}
          />
        </label>
      ))}
    </div>
  );
}