import { Inter } from 'next/font/google';
import { Navbar } from './components';
import meta from './meta';
import { Toaster } from 'sonner';
import '@/styles/index.scss';
import { headers } from 'next/headers';
import { parseCookies } from '@/utils/string-transform';

const inter = Inter({ subsets: ['latin'] });
const headersList = headers();
const path = headersList.get('next-url') || '/';
const cookies = parseCookies(headersList.get('cookie') || '');

export const metadata = meta[path];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = cookies.theme || 'dark';

  return (
    <html lang="en" data-theme={theme}>
      <body className={inter.className}>
        <main className="w-full h-[100vh] m-0 p-[var(--padding)] relative box-border">
          <Navbar metadata={metadata}></Navbar>

          <div className="w-[calc(100vw-var(--padding)*2)] h-[calc(100vh-var(--padding)*2-3rem-1rem)] overflow-x-auto">
            {children}
          </div>

          <Toaster />
        </main>
      </body>
    </html>
  );
}
