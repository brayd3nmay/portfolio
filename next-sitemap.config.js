/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://braydenmay.com',
  generateRobotsTxt: true,
  outDir: 'public',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'monthly',
      priority: path === '/' ? 1 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};

