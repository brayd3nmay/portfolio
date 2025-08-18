import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL('https://braydenmay.com'),
  title: {
    default: 'Brayden May — Website Redesigns for Ohio Small Businesses',
    template: '%s · Brayden May',
  },
  description:
    'Flat fee website redesigns for Ohio small businesses. Modern, fast, mobile friendly. View work, process, pricing, and get a proposal.',
  openGraph: {
    title: 'Brayden May — Website Redesigns for Ohio Small Businesses',
    description:
      'Flat fee website redesigns for Ohio small businesses. Modern, fast, mobile friendly.',
    url: 'https://braydenmay.com',
    siteName: 'Brayden May Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Brayden May portfolio' }],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'Brayden May — Website Redesigns for Ohio Small Businesses',
    description: 'Flat fee website redesigns for Ohio small businesses. Modern, fast, mobile friendly.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Brayden May',
      url: 'https://braydenmay.com',
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Brayden May',
      url: 'https://braydenmay.com',
      jobTitle: 'Web Developer',
      description:
        'Flat fee website redesigns for Ohio small businesses. Modern, fast, and mobile friendly.',
      image: 'https://braydenmay.com/og-image.png',
    },
  ];
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

