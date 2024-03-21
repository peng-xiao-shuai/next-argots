'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { FC, useContext, useEffect, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { AppContext } from '@/context';
import { setLanguage } from '@/utils/set-app';
export type LangType = { label: string; value: Lng; desc?: string };
export const ClientLang: FC<{
  langs: LangType[];
  lng: Lng;
}> = ({ lng, langs }) => {
  const { t } = useContext(AppContext);
  const [locale, setLocale] = useState<Lng>();
  const handleSwitchLang = (item: LangType) => {
    if (item.value !== locale) {
      setLocale(item.value);
    }
  };

  const handleComplete = () => {
    setLanguage(locale!);
  };
  useBusWatch('complete', handleComplete);

  useEffect(() => {
    setLocale(lng);
  }, [lng]);

  return (
    <>
      {langs.map((item: any) => (
        <li key={item.label} className="row-active no-active w-full !h-14">
          <label
            className="w-full label p-0 h-full flex items-center justify-between"
            onClick={() => handleSwitchLang(item)}
          >
            <div>
              <span className="label-text">{item.label}</span>
              {item.desc && (
                <span className="text-xs opacity-70"> ({t!(item.desc)})</span>
              )}
            </div>

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
        </li>
      ))}
    </>
  );
};
