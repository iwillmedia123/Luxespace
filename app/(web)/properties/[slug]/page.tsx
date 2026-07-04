import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { generatePropertyMetadata, generatePropertyJsonLd } from "@/lib/seo";
import PropertyDetailClient from "./PropertyDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await db.getPropertyBySlug(slug);
  if (!property) return {};
  return generatePropertyMetadata(property);
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await db.getPropertyBySlug(slug);
  if (!property) {
    notFound();
  }
  const relatedProperties = await db.getRelatedProperties(property);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePropertyJsonLd(property)),
        }}
      />
      <PropertyDetailClient property={property} relatedProperties={relatedProperties} />
    </>
  );
}
