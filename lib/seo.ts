import { Property, BlogPost } from "@/types";
import { formatAED, getPropertyTypeLabel } from "@/lib/utils";
import type { Metadata } from "next";

/**
 * Generates dynamic SEO metadata for property details pages
 */
export function generatePropertyMetadata(property: Property): Metadata {
  const title = `${property.title} | Luxespace Properties`;
  const description = `${getPropertyTypeLabel(property.type)} in ${property.location}. ${property.bedrooms} Bedrooms, ${property.bathrooms} Bathrooms, ${property.areaSqft.toLocaleString()} sqft. Price: ${formatAED(property.price)}. ${property.description.substring(0, 120)}...`;

  return {
    title,
    description,
    keywords: [
      property.type,
      property.location,
      "Dubai luxury real estate",
      "Luxespace Properties",
      property.title,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: property.images?.[0]
        ? [{ url: property.images[0], width: 1200, height: 630, alt: property.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: property.images?.[0] ? [property.images[0]] : [],
    },
  };
}

/**
 * Generates JSON-LD Structured Data for property listings
 */
export function generatePropertyJsonLd(property: Property) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `https://luxespace.ae/properties/${property.slug}`,
    image: property.images,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "AE",
    },
    geo:
      property.latitude && property.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          }
        : undefined,
    numberOfRooms: property.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.areaSqft,
      unitCode: "FTK",
    },
  };
}

/**
 * Generates JSON-LD Breadcrumb Structured Data
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates dynamic SEO metadata for blogs/bulletins
 */
export function generateBlogMetadata(post: BlogPost): Metadata {
  const title = `${post.seo?.metaTitle || post.title} | Luxespace Insights`;
  const description = post.seo?.metaDescription || post.summary || `Read our latest editorial bulletin regarding ${post.title}.`;
  const canonical = post.seo?.canonicalUrl || `https://luxespace.ae/blog/${post.slug}`;
  const keywords = post.seo?.keywords || post.tags || [];

  return {
    title,
    description,
    keywords: ["Luxespace Properties", "Dubai Luxury Real Estate", ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

/**
 * Generates JSON-LD Structured Data for blogs/articles
 */
export function generateBlogJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "Luxespace Advisory",
      url: "https://luxespace.ae/agents"
    },
    publisher: {
      "@type": "Organization",
      name: "Luxespace Properties",
      logo: {
        "@type": "ImageObject",
        url: "https://luxespace.ae/assets/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxespace.ae/blog/${post.slug}`
    }
  };
}

/**
 * Generates JSON-LD Structured Data for FAQs
 */
export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

/**
 * Generates JSON-LD Structured Data for the organization
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Luxespace Properties",
    image: "https://luxespace.ae/assets/logo.png",
    "@id": "https://luxespace.ae/#organization",
    url: "https://luxespace.ae",
    telephone: "+971 4 123 4567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Marina Plaza, Office 2501",
      addressLocality: "Dubai Marina",
      addressRegion: "Dubai",
      postalCode: "00000",
      addressCountry: "AE"
    },
    logo: "https://luxespace.ae/assets/logo.png",
    sameAs: [
      "https://www.facebook.com/luxespace",
      "https://www.instagram.com/luxespace",
      "https://www.linkedin.com/company/luxespace"
    ]
  };
}
