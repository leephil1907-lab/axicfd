import { generateSitemap } from "@/lib/seo";

const pages = [
  { path: '/', lastmod: '2026-07-12', priority: 1.0, changefreq: 'daily' },
  { path: '/markets', lastmod: '2026-07-12', priority: 0.9, changefreq: 'daily' },
  { path: '/markets/forex', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/markets/crypto', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/markets/commodities', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/markets/indices', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/markets/shares', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/platforms', lastmod: '2026-07-12', priority: 0.9, changefreq: 'weekly' },
  { path: '/platforms/mt4', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/platforms/mt5', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/trading-tools', lastmod: '2026-07-12', priority: 0.7, changefreq: 'weekly' },
  { path: '/learn', lastmod: '2026-07-12', priority: 0.7, changefreq: 'weekly' },
  { path: '/partnerships', lastmod: '2026-07-12', priority: 0.6, changefreq: 'monthly' },
  { path: '/company', lastmod: '2026-07-12', priority: 0.6, changefreq: 'monthly' },
  { path: '/help', lastmod: '2026-07-12', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', lastmod: '2026-07-12', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', lastmod: '2026-07-12', priority: 0.8, changefreq: 'daily' },
  { path: '/login', lastmod: '2026-07-12', priority: 0.5, changefreq: 'monthly' },
  { path: '/register', lastmod: '2026-07-12', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy-policy', lastmod: '2026-07-12', priority: 0.4, changefreq: 'monthly' },
  { path: '/terms-of-service', lastmod: '2026-07-12', priority: 0.4, changefreq: 'monthly' },
  { path: '/risk-disclosure', lastmod: '2026-07-12', priority: 0.4, changefreq: 'monthly' },
  { path: '/cookie-policy', lastmod: '2026-07-12', priority: 0.3, changefreq: 'monthly' },
  { path: '/aml-policy', lastmod: '2026-07-12', priority: 0.3, changefreq: 'monthly' },
  { path: '/gdpr-compliance', lastmod: '2026-07-12', priority: 0.3, changefreq: 'monthly' },
];

export const sitemapXML = generateSitemap(pages);
