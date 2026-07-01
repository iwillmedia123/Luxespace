import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Configurations | System Control",
  description: "Manage XML sitemaps, robots, and page-level meta.",
};

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-luxury-border/20 pb-4">
        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Luxespace Admin</span>
        <h1 className="text-3xl font-serif text-white mt-1">Seo</h1>
        <p className="text-xs text-gray-400 mt-1">Manage XML sitemaps, robots, and page-level meta.</p>
      </div>

      <div className="h-[500px] border border-dashed border-luxury-border/30 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Seo Interface Structure (Ready to receive admin modules)
      </div>
    </div>
  );
}
