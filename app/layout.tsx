import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const berkeleyMono = localFont({
  src: '../public/fonts/BerkeleyMono-Regular.otf',
  variable: '--font-berkeley-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brayden May',
  description: 'Brayden May — building at the intersection of technology, design, and business.',
  openGraph: {
    title: 'Brayden May',
    description: 'Building at the intersection of technology, design, and business.',
    type: 'website',
  },
}

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('portfolio_theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={berkeleyMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
