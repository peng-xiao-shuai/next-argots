'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Lng } from '@/locales/i18n';
import { SettingContextData, AppContext, defaultData } from '@/context';
import { setDataTheme } from '@/utils/set-theme';
import { LocaleProvider } from './LocaleProvider';

export function AppProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: Lng;
}) {
  const path = usePathname();
  const [setting, setSetting] = useState({
    ...defaultData,
    language: language,
  });

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem('settings') || '{}'
    ) as SettingContextData;

    if (Object.keys(data).length) {
      setSetting(data);

      document.documentElement.style.fontSize = data.size + 'px';

      setDataTheme(data.dataTheme);
    }
  }, [path]);
  return (
    <AppContext.Provider value={setting}>
      <LocaleProvider language={language}>{children}</LocaleProvider>
    </AppContext.Provider>
  );
}
