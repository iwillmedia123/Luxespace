import { Property } from "@/types";
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
