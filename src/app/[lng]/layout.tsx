import { Transition, AppProvider, TrpcProviders } from '../../components';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { dir } from 'i18next';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
import { languages, useTranslation } from '@/locales/i18n';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { COOKIE } from '@/server/enum';
import { Viewport } from 'next';
const Navbar = dynamic(() => import('@/components/Navbar'));

export async function getStaticPaths() {
  const paths = languages.map((lng) => ({
    params: { lng },
  }));

  return { paths, fallback: 'blocking' };
}

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'cyan' },
      { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
    colorScheme: 'dark light',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default async function RootLayout({
  children,
  params: { lng },
}: CustomReactLayout) {
  const cookieStore = cookies();
  const size = cookieStore.get(COOKIE.SIZE)?.value;
  const theme = cookieStore.get(COOKIE.THEME)?.value;
  const { t } = await useTranslation(lng);

  return (
    <html
      suppressHydrationWarning
      lang={lng}
      dir={dir(lng)}
      data-theme={theme || 'dark'}
      style={{
        fontSize: (size || 16) + 'px',
      }}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `const dataTheme=(function(cookieString=document.cookie){const list={};cookieString&&cookieString.split(';').forEach((cookie)=>{const parts=cookie.split('=');if(parts.length){list[parts.shift().trim()]=decodeURI(parts.join('='));}});return list['theme'];}());if(dataTheme==='auto'){const isDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.setAttribute('data-theme',isDark?'dark':'light');}else{document.documentElement.setAttribute('data-theme',dataTheme||'dark');}`,
          }}
        ></script>
        <main className="w-full h-[100vh] m-0 relative box-border overflow-x-hidden">
          <TrpcProviders>
            <AppProvider language={lng}>
              <div className="flex flex-col h-full">
                <Navbar language={lng} />

                <Transition
                  language={lng}
                  className="flex-1 page-content w-full px-[var(--padding)]"
                >
                  {children}
                </Transition>
              </div>
            </AppProvider>
          </TrpcProviders>
          <Toaster
            toastOptions={{
              duration: 1000,
            }}
          />
        </main>

        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
