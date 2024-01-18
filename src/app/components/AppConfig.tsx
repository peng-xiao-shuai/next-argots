'use client';
import { parseCookies } from '@/utils/string-transform';
import logo from '/public/logo4.png';
import { createContext, useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';

export type Language = {
  'zh-TW': {};
  'zh-CN': {};
  'en-US': {};
  'ja-JP': {};
};

export interface SettingData {
  locale: keyof Language;
  size: number;
  logo: StaticImageData;
}

const defaultData: SettingData = {
  locale: 'zh-CN',
  size: 16,
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
