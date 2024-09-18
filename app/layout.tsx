import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/theme-switcher';
import HeaderAuth from '@/components/header-auth';

const inter = Inter({ subsets: ['latin'] });
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Wolian AI',
  description: 'Transform your content with into a API endpoint',
  openGraph: {
    images: ['/logo.svg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <nav className="w-full flex justify-between items-center">
                  <Link href="/">
                    <Image src="/logo.svg" alt="Wolian AI" width={32} height={32} />
                  </Link>
                  <HeaderAuth />
                </nav>
                {children}
                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <p>
                    Powered by <Link href="https://wolian.cc">Vector Parallel Inc.</Link>
                  </p>
                  <ThemeSwitcher />
                </footer>
              </div>
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
