'use client';

interface StructuredDataProps {
  type: 'website' | 'article' | 'product' | 'organization';
  data: {
    name?: string;
    description?: string;
    url?: string;
    image?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    publisher?: {
      name: string;
      logo: string;
    };
    organization?: {
      name: string;
      url: string;
      logo: string;
      sameAs?: string[];
    };
  };
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          name: data.name,
          description: data.description,
          url: data.url,
          publisher: data.publisher,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${data.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

      case 'article':
        return {
          ...baseData,
          '@type': 'Article',
          headline: data.name,
          description: data.description,
          url: data.url,
          image: data.image,
          author: {
            '@type': 'Organization',
            name: data.author || 'Holistic AI',
          },
          publisher: data.publisher,
          datePublished: data.datePublished,
          dateModified: data.dateModified,
        };

      case 'product':
        return {
          ...baseData,
          '@type': 'SoftwareApplication',
          name: data.name,
          description: data.description,
          url: data.url,
          image: data.image,
          applicationCategory: 'AI Language Model',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
          },
        };

      case 'organization':
        return {
          ...baseData,
          '@type': 'Organization',
          name: data.organization?.name,
          url: data.organization?.url,
          logo: data.organization?.logo,
          sameAs: data.organization?.sameAs,
        };

      default:
        return baseData;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 