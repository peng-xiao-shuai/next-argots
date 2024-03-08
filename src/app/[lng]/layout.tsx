// 保证layout为服务端组件
import { Inter } from 'next/font/google';
import { Navbar, Transition, AppProvider, TrpcProviders } from './components';
import { dir } from 'i18next';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
import { languages } from '@/locales/i18n';
// import meta from './meta';
const inter = Inter({ subsets: ['latin'] });

// export const metadata = meta['/'];

export async function getStaticPaths() {
  const paths = languages.map((lng) => ({
    params: { lng },
  }));

  return { paths, fallback: 'blocking' };
}

export default function RootLayout({
  children,
  params: { lng },
}: CustomReactLayout) {
  return (
    <html lang={lng} data-theme={'dark'} dir={dir(lng)}>
      <body>
        <main className="w-full h-[100vh] m-0 p-[var(--padding)] relative box-border  overflow-x-hidden">
          <TrpcProviders>
            <AppProvider language={lng}>
              <Navbar />

              <Transition
                language={lng}
                className="page-content w-full max-h-[calc(100vh-var(--padding)*2-3rem-1rem)] overflow-y-auto"
              >
                {children}
              </Transition>
            </AppProvider>
          </TrpcProviders>
          <Toaster richColors />
        </main>
      </body>
    </html>
  );
}
