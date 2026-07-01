import PropertyListingPage from "@/components/properties/PropertyListingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luxury Homes & Apartments for Rent in Dubai | Luxespace Properties",
  description: "Browse high-end annual rentals, fully furnished penthouses, and premium townhouses in Dubai's elite coastal districts.",
};

export default function RentPropertiesPage() {
  return (
    <PropertyListingPage
      defaultPurpose="rent"
      heroTitle="Properties for Rent"
      heroSubtitle="Lease upscale residences, beachfront villas, and fully-managed serviced apartments in Dubai's premier residential enclaves."
    />
  );
}
