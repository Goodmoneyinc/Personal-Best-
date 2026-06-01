import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipNav } from '@/components/layout/SkipNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'Fulatelier | Mississippi digital workshop',
    template: '%s | Fulatelier',
  },
  description:
    'Fulatelier builds practical digital products, templates, and custom web systems for Mississippi businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        <SkipNav />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
