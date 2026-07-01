import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Luxespace Properties",
  description: "Read the privacy policy and data protection terms of Luxespace Properties.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16">
      <div className="border-b border-luxury-border/20 pb-4 mb-8">
        <span className="text-xs uppercase tracking-widest text-luxury-gold">Luxespace Properties</span>
        <h1 className="text-4xl font-serif text-white mt-1">Privacy Policy</h1>
      </div>
      <div className="h-96 border border-dashed border-luxury-border/30 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        Privacy Policy Content Architecture (Ready to receive content)
      </div>
    </div>
  );
}
