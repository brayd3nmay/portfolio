// Keep a basic sitemap for Next metadata. next-sitemap will also emit a sitemap.xml at build.
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://braydenmay.com';
  const now = new Date();
  const routes = ['', '/work', '/process', '/pricing', '/about', '/contact'];
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: now }));
}

