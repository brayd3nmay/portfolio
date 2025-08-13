import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

function buildCsp() {
  const directives: string[] = [
    "default-src 'self'",
    // Allow 'unsafe-inline' for Next.js inline runtime and JSON data scripts; allow 'unsafe-eval' only in dev
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    // Allow inline styles used in a few React style attributes and Tailwind injection
    "style-src 'self' 'unsafe-inline'",
    // Limit images to same-origin plus data/blob for Next placeholders
    "img-src 'self' data: blob:",
    "font-src 'self'",
    // Allow websocket connections in dev for HMR
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    // Lock down powerful directives
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Enforce HTTPS for any http links that might slip in
    'upgrade-insecure-requests',
  ];
  return directives.join('; ');
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {},
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value:
              [
                'accelerometer=()','autoplay=()','camera=()','display-capture=()','fullscreen=()',
                'geolocation=()','gyroscope=()','magnetometer=()','microphone=()','payment=()',
                'usb=()','xr-spatial-tracking=()','interest-cohort=()','browsing-topics=()'
              ].join(', '),
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Content-Security-Policy', value: buildCsp() },
        ],
      },
    ];
  },
};

export default nextConfig;


