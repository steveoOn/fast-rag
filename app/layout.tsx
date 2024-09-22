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
import LanguageSelector from '@/components/modules/language/language-selector-client';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Wolian AI',
  description: 'Transform your content with into a API endpoint',
  openGraph: {
    images: ['/1024-t.svg'],
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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen flex flex-col">
              <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-2 sm:px-4 lg:px-6 py-1">
                  <Link href="/">
                    <Image
                      src="/1024-t.svg"
                      alt="Wolian AI"
                      width={20}
                      height={20}
                      className="sm:w-12 sm:h-12 lg:w-16 lg:h-16"
                    />
                  </Link>
                  <HeaderAuth />
                </div>
              </nav>
              <main className="flex-grow relative top-[64px] sm:top-[80px] lg:top-[96px]">
                {children}
              </main>
              <footer className="relative top-[64px] sm:top-[80px] lg:top-[96px] w-full flex flex-col sm:flex-row items-center justify-center border-t mx-auto text-center text-xs gap-4 sm:gap-8 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <p>
                  Powered by <Link href="https://wolian.cc">Vector Parallel Inc.</Link>
                </p>
                <ThemeSwitcher />
                <LanguageSelector />
              </footer>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
