// 保证layout为服务端组件
import { Inter } from 'next/font/google';
import { Transition, AppProvider, TrpcProviders } from '../../components';
import { dir } from 'i18next';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
import { languages, useTranslation } from '@/locales/i18n';
import Head from 'next/head';
import { META } from '@@/locales/keys';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { COOKIE } from '@/server/enum';
const inter = Inter({ subsets: ['latin'] });
const Navbar = dynamic(() => import('@/components/Navbar'));

export async function getStaticPaths() {
  const paths = languages.map((lng) => ({
    params: { lng },
  }));

  return { paths, fallback: 'blocking' };
}

export default async function RootLayout({
  children,
  params: { lng },
}: CustomReactLayout) {
  const { t } = await useTranslation(lng);
  const cookieStore = cookies();
  const size = cookieStore.get(COOKIE.SIZE);
  const theme = cookieStore.get(COOKIE.THEME);

  return (
    <html
      lang={lng}
      data-theme={theme?.value}
      dir={dir(lng)}
      style={{
        fontSize: size?.value + 'px',
      }}
    >
      <Head>
        <meta name="description" content={t(META.DESC)} />
        <meta name="keywords" content={t(META.KEYWORDS)} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
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
          <Toaster richColors />
        </main>
      </body>
    </html>
  );
}
