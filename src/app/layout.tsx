// 保证layout为服务端组件
import { Inter } from 'next/font/google';
import { Navbar, Transition, AppConfig } from './components';
import { Toaster } from 'sonner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import '@/styles/index.scss';
// import meta from './meta';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = meta['/'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme={'dark'}>
      <body>
        <main className="w-full h-[100vh] m-0 p-[var(--padding)] relative box-border  overflow-x-hidden">
          <AppConfig>
            <Navbar />

            <Transition className="page-content w-full max-h-[calc(100vh-var(--padding)*2-3rem-1rem)] overflow-y-auto">
              {children}
            </Transition>
          </AppConfig>

          <Toaster />
        </main>
      </body>
    </html>
  );
}

export async function getServerSideProps({ locale }: any) {
  console.log(locale);

  return {
    props: {
      // 加载特定语言的翻译资源
      ...(await serverSideTranslations(locale, ['common', 'homepage'])),
    },
  };
}
