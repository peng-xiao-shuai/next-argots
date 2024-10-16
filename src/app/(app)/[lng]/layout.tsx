import { Transition, AppProvider, TrpcProviders } from '@/components';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { dir } from 'i18next';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
import { languages, useTranslation } from '@/locales/i18n';
import { default as dynamicFunction } from 'next/dynamic';
import { cookies, headers } from 'next/headers';
import { COOKIE } from '@/server/enum';
import { Viewport } from 'next';
const Navbar = dynamicFunction(() => import('@/components/Navbar'));

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
    maximumScale: 2,
    userScalable: true,
  };
}

export const fetchCache = 'default-cache';

const inter = localFont({
  src: '../../../../public/Helvetica-Neue.ttf',
});

export default async function RootLayout(props: CustomReactLayout) {
  const params = await props.params;
  const { lng } = params;
  const { children } = props;

  const cookieStore = await cookies();
  const size = cookieStore.get(COOKIE.SIZE)?.value;
  const theme = cookieStore.get(COOKIE.THEME)?.value;

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
      <body className={`${inter.className}`}>
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
                  className="flex-1 page-content px-[var(--padding)]"
                >
                  {children}
                </Transition>
              </div>
            </AppProvider>
          </TrpcProviders>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 1500,
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
