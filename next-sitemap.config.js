/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: 'https://argots.cn',
  generateRobotsTxt: false, // 使用动态 robots.txt
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*', '/admin/*', '/robots.txt'],
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // 为英文页面设置更高优先级
    const priority = path.startsWith('/en-US') ? 0.8 : 0.7

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}