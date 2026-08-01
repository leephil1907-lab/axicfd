// SEO Utilities for AXI Trading Platform

export const siteConfig = {
  name: 'AXI Trading',
  url: 'https://axi-trading.com',
  ogImage: 'https://axi-trading.com/og-image.jpg',
  description: 'Trade Forex, Crypto, Commodities & Indices with tight spreads, fast execution, and award-winning platforms.',
  keywords: 'forex trading, crypto trading, CFD trading, MT4, MT5, online trading, financial markets',
  twitter: '@axi_trading',
  facebook: 'axi.trading.official',
  linkedin: 'company/axi-trading',
};

export function generateMetaTags({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
}) {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: fullTitle,
    description: description || siteConfig.description,
    keywords: siteConfig.keywords,
    ...(noIndex ? { robots: 'noindex, nofollow' } : {}),
    openGraph: {
      title: fullTitle,
      description: description || siteConfig.description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || siteConfig.description,
      images: [ogImage],
      creator: siteConfig.twitter,
    },
    alternates: {
      canonical: url,
    },
  };
}

// Schema.org structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AXI Trading',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      `https://twitter.com/${siteConfig.twitter}`,
      `https://facebook.com/${siteConfig.facebook}`,
      `https://linkedin.com/${siteConfig.linkedin}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-888-888',
      contactType: 'customer service',
      availableLanguage: ['English', 'Spanish', 'French', 'German', 'Arabic'],
    },
  };
}

export function generateFinancialProductSchema({
  name,
  description,
  instrument,
}: {
  name: string;
  description: string;
  instrument: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name,
    description,
    category: instrument,
    provider: {
      '@type': 'Organization',
      name: 'AXI Trading',
      url: siteConfig.url,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateArticleSchema({
  title,
  description,
  image,
  publishedAt,
  author,
}: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished: publishedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AXI Trading',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };
}

// Sitemap generation
export function generateSitemap(pages: { path: string; lastmod: string; priority: number; changefreq: string }[]) {
  const urls = pages.map(page => `
    <url>
      <loc>${siteConfig.url}${page.path}</loc>
      <lastmod>${page.lastmod}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority.toFixed(1)}</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Analytics initialization
export function initGoogleAnalytics(gaId: string) {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      custom_map: {
        'dimension1': 'user_type',
        'dimension2': 'account_type',
        'dimension3': 'trading_platform',
      }
    });
  `;
}

export function initMicrosoftClarity(clarityId: string) {
  return `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${clarityId}");
  `;
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
  if (typeof window !== 'undefined' && (window as any).clarity) {
    (window as any).clarity('event', eventName, params);
  }
}

// Canonical URL helper
export function getCanonicalUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

// Internal linking helper
export function getRelatedPages(currentPath: string) {
  const links: Record<string, { name: string; url: string }[]> = {
    '/markets/forex': [
      { name: 'EUR/USD Analysis', url: '/blog/eur-usd-analysis' },
      { name: 'Forex Trading Guide', url: '/learn/forex-basics' },
      { name: 'MT4 Platform', url: '/platforms/mt4' },
    ],
    '/markets/crypto': [
      { name: 'Bitcoin Trading', url: '/blog/bitcoin-trading-strategies' },
      { name: 'Crypto Guide', url: '/learn/crypto-basics' },
      { name: 'MT5 Platform', url: '/platforms/mt5' },
    ],
  };
  return links[currentPath] || [];
}
