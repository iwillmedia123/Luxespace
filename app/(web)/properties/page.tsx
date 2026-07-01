import PropertyListingPage from "@/components/properties/PropertyListingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exclusive Dubai Luxury Property Portfolio | Luxespace Properties",
  description: "Browse premium villas, penthouses, mansions, and beachfront suites in Palm Jumeirah, Downtown Dubai, and Dubai Hills.",
};

export default function PropertiesPage() {
  return (
    <PropertyListingPage
      heroTitle="Exclusive Portfolio"
      heroSubtitle="Explore the finest residential developments and off-market enclaves in the city. Tailored layouts, private pools, and high-yield returns."
    />
  );
}
