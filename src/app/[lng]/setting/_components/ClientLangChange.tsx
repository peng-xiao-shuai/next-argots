'use client';
import { useBusWatch } from '@/hooks/use-bus-watch';
import { FC, useEffect, useState } from 'react';
import { Lng } from '@/locales/i18n';
import { useTranslation } from '@/locales/client';
import { usePathname, useRouter } from 'next/navigation';
import { COOKIE_NAME } from '@/locales/settings';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
export type LangType = { label: string; value: Lng; desc?: string };
export const ClientLang: FC<{
  langs: LangType[];
  lng: Lng;
}> = ({ lng, langs }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const path = usePathname();
  const [, setCookie] = useCookies<typeof COOKIE_NAME>();
  const [locale, setLocale] = useState<Lng>();
  const handleSwitchLang = (item: LangType) => {
    if (item.value !== locale) {
      setLocale(item.value);
    }
  };

  const handleComplete = () => {
    setCookie(COOKIE_NAME, locale);

    router.replace(path.replace(lng, locale!));
    toast.success('successfully set');
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
                <span className="text-xs opacity-70"> ({t(item.desc)})</span>
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
