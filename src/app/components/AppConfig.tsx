'use client';
import logo from '/public/logo4.png';
import { createContext, useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';
import { Resources } from '@/locales/i18n';
import { COMMON_KEYS } from '@/locales/keys';
import { setDataTheme } from '@/utils/set-theme';
import '@/locales/i18n';

export interface SettingData {
  locale: keyof Resources;
  size: number;
  name: string;
  dataTheme: 'dark' | 'light' | 'auto';
  logo: StaticImageData;
}

const defaultData: SettingData = {
  locale: 'zh-CN',
  size: 16,
  dataTheme: 'dark',
  name: COMMON_KEYS.PACKAGE_NAME,
  logo,
};

export const AppContext = createContext(defaultData);

export function AppConfig({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [setting, setSetting] = useState(defaultData);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem('settings') || '{}'
    ) as SettingData;

    setSetting(data);

    document.documentElement.style.fontSize = data.size + 'px';

    setDataTheme(data.dataTheme);
  }, [path]);
  return (
    <AppContext.Provider
      value={{
        ...setting,
        logo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
