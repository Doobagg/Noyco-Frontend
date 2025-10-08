'use client';

/**
 * JSON-LD Structured Data Component
 * Add this to pages to improve SEO and rich snippets in search results
 */
export default function StructuredData({ data }) {
  if (!data) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
