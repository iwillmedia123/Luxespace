"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Handshake, Building2, Landmark, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { PartnerItem } from "@/types";

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        setLoading(true);
        const list = await db.getPartners();
        setPartners(list);
      } catch (err) {
        console.error("Error loading partners:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPartners();
  }, []);

  const developers = partners.filter((p) => p.type === "developer");
  const banks = partners.filter((p) => p.type === "bank" || p.type === "mortgage");
  const legal = partners.filter((p) => p.type === "legal");

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">Partners</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <Handshake className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Corporate Network</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Our Strategic Affiliations</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Collaborating with leading regional developers, mortgage banks, and legal consultancies to ensure compliance, security, and capital performance.
          </p>
        </div>

        {loading ? (
          <div className="h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse" />
        ) : (
          <div className="space-y-16">
            {/* Developer Section */}
            <div className="space-y-6">
              <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                <Building2 className="w-4 h-4 text-luxury-gold" />
                <span>Platinum Developer Partners</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {developers.map((partner) => (
                  <a
                    href={partner.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={partner.id}
                    className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-luxury-gold/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="h-10 w-24 relative opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Banking & Mortgage Section */}
            <div className="space-y-6">
              <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                <Landmark className="w-4 h-4 text-luxury-gold" />
                <span>Mortgage & Banking Affiliate Partners</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {banks.map((partner) => (
                  <a
                    href={partner.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={partner.id}
                    className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-luxury-gold/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="h-10 w-24 relative opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Advisory Section */}
            <div className="space-y-6">
              <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                <span>Licensed Legal Advisory Partners</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {legal.map((partner) => (
                  <a
                    href={partner.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={partner.id}
                    className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:border-luxury-gold/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="h-10 w-24 relative opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
