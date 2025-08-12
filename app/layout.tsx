import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL('https://braydenmay.com'),
  title: {
    default: 'Brayden — Website Redesigns for Ohio Small Businesses',
    template: '%s · Brayden',
  },
  description:
    'Flat fee website redesigns for Ohio small businesses. Modern, fast, mobile friendly. View work, process, pricing, and get a proposal.',
  openGraph: {
    title: 'Brayden — Website Redesigns for Ohio Small Businesses',
    description:
      'Flat fee website redesigns for Ohio small businesses. Modern, fast, mobile friendly.',
    url: 'https://braydenmay.com',
    siteName: 'Brayden Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Brayden portfolio' }],
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

