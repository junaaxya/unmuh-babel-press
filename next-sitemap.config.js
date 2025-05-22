/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://unmuhbabelpress.com',
  generateRobotsTxt: true, // Generate robots.txt
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin', '/private'], // Halaman yang tidak ingin dimasukkan
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === '/' ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};