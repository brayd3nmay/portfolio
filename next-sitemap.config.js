/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: 'https://braydenmay.com',
  generateRobotsTxt: true,
  outDir: 'public',
  // Include the detailed breakdown page in the sitemap
  transform: async (config, path) => ({
    loc: path,
    changefreq: 'monthly',
    priority: path === '/' ? 1 : 0.7,
    lastmod: new Date().toISOString(),
  }),
};

