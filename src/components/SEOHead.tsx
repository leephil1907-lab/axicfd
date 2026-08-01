import { useEffect } from "react";
import { siteConfig, generateMetaTags, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/seo";

interface SEOHeadProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  breadcrumbs?: { name: string; url: string }[];
}

export default function SEOHead({ title, description, path, image, type, noIndex, breadcrumbs }: SEOHeadProps) {
  useEffect(() => {
    const meta = generateMetaTags({ title, description, path, image, type, noIndex });

    // Update title
    document.title = meta.title;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', meta.description);
    updateMeta('keywords', meta.keywords);
    if (meta.robots) updateMeta('robots', meta.robots);

    // Open Graph
    updateMeta('og:title', meta.openGraph.title);
    updateMeta('og:description', meta.openGraph.description);
    updateMeta('og:url', meta.openGraph.url);
    updateMeta('og:site_name', meta.openGraph.siteName);
    updateMeta('og:image', meta.openGraph.images[0].url);
    updateMeta('og:locale', meta.openGraph.locale);
    updateMeta('og:type', meta.openGraph.type);

    // Twitter
    updateMeta('twitter:card', meta.twitter.card);
    updateMeta('twitter:title', meta.twitter.title);
    updateMeta('twitter:description', meta.twitter.description);
    updateMeta('twitter:image', meta.twitter.images[0]);
    updateMeta('twitter:creator', meta.twitter.creator);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = meta.alternates.canonical;

    // Structured data
    const schemas = [generateOrganizationSchema()];
    if (breadcrumbs) schemas.push(generateBreadcrumbSchema(breadcrumbs));

    let script = document.getElementById('structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);

  }, [title, description, path, image, type, noIndex, breadcrumbs]);

  return null;
}
