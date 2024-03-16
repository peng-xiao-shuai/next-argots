// 保证layout为服务端组件
import { Inter } from 'next/font/google';
import {
  Navbar,
  Transition,
  AppProvider,
  TrpcProviders,
} from '../../components';
import { dir } from 'i18next';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
import { languages, useTranslation } from '@/locales/i18n';
import Head from 'next/head';
import { META } from '@@/locales/keys';
// import meta from './meta';
const inter = Inter({ subsets: ['latin'] });

// export const metadata = meta['/'];

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
  return (
    <html lang={lng} data-theme={'dark'} dir={dir(lng)}>
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
                <Navbar />

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
