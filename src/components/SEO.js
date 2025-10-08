'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { seoConfig } from '@/lib/seo';

/**
 * SEO Component for Client-Side Pages
 * Use this in client components where you can't use generateMetadata
 */
export default function SEO({
  title,
  description,
  keywords = [],
  ogImage,
  noindex = false,
  structuredData,
}) {
  const pathname = usePathname();
  const fullUrl = `${seoConfig.siteUrl}${pathname}`;
  
  const fullTitle = title 
    ? `${title} | ${seoConfig.siteName}` 
    : seoConfig.defaultTitle;
  
  const fullDescription = description || seoConfig.defaultDescription;
  
  const allKeywords = [
    ...seoConfig.keywords,
    ...keywords,
  ].join(', ');
  
  const imageUrl = ogImage || seoConfig.ogImage;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content={seoConfig.social.twitter} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}
