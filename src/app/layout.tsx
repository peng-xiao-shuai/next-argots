import { Inter } from 'next/font/google';
import { Navbar, Transition, AppConfig } from './components';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
// import meta from './meta';

const inter = Inter({ subsets: ['latin'] });

// export const metadata = meta['/'];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme={'dark'}>
      <body className={inter.className}>
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
