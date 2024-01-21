'use client';
import logo from '/public/logo4.png';
import { createContext, useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';
import { Language } from '@/language';
import KEYS from '@/language/keys';
import { setDataTheme } from '@/utils/set-theme';

export interface SettingData {
  locale: keyof Language;
  size: number;
  name: string;
  dataTheme: 'dark' | 'light' | 'auto';
  logo: StaticImageData;
}

const defaultData: SettingData = {
  locale: 'zh-CN',
  size: 16,
  dataTheme: 'dark',
  name: KEYS.PACKAGE_NAME,
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
