'use client';
import { useEffect, useState } from 'react';
import { DEFAULT_NS, Lng, Resources } from '@/locales/i18n';
import { AppContextData, AppContext, defaultData } from '@/context';
import { useTranslation } from '@/locales/client';
export function AppProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: Lng;
}) {
  const { t } = useTranslation();
  const [setting, setSetting] = useState<AppContextData>({
    ...defaultData,
    language: language,
    t: t as AppContextData['t'],
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      window.console.log = () => {};
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log(
              'ServiceWorker registration successful with scope: ',
              registration.scope
            );
          })
          .catch((error) => {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);

  return <AppContext.Provider value={setting}>{children}</AppContext.Provider>;
}
