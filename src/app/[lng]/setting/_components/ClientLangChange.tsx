'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { FC, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { useTranslation } from '@/locales/client';
import { usePathname, useRouter } from 'next/navigation';
import { COOKIE_NAME } from '@/locales/settings';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
export type LangType = { label: string; value: Lng };
export const ClientLang: FC<{
  item: LangType;
  lng: Lng;
}> = ({ lng, item }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const path = usePathname();
  const [, setCookie] = useCookies([COOKIE_NAME]);
  const [locale, setLocale] = useState(i18n.language);
  const handleSwitchLang = (item: LangType) => {
    if (item.value !== locale) {
      setLocale(item.value);
    }
  };

  const handleComplete = () => {
    setCookie(COOKIE_NAME, locale);

    router.replace(path.replace(lng, locale));
    toast.success('successfully set');
  };
  useBusWatch('complete', handleComplete);

  return (
    <label
      className="first-of-type:border-transparent border-t border-t-base-content border-opacity-10 lang-list-item label px-4 h-14 flex items-center justify-between"
      onClick={() => handleSwitchLang(item)}
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
  );
};
