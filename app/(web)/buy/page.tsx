import PropertyListingPage from "@/components/properties/PropertyListingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Dubai Properties for Sale | Luxespace Properties",
  description: "Explore freehold luxury villas, signature mansions, and high-floor apartments for sale in Dubai's premier communities.",
};

export default function BuyPropertiesPage() {
  return (
    <PropertyListingPage
      defaultPurpose="buy"
      heroTitle="Properties for Sale"
      heroSubtitle="Acquire high-yield real estate and private estates. Freehold titles, off-market penthouses, and bespoke residential developments."
    />
  );
}
