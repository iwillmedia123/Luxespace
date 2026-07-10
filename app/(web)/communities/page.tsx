"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Home, Percent, Landmark } from "lucide-react";
import { db } from "@/lib/db";
import { Community, Property } from "@/types";
import { formatAED } from "@/lib/utils";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [commsList, propsList] = await Promise.all([
          db.getCommunities(),
          db.getProperties(),
        ]);
        setCommunities(commsList);
        setProperties(propsList);
      } catch (err) {
        console.error("Error loading communities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCommunityProperties = (communityId: string) => {
    return properties.filter((p) => p.communityId === communityId);
  };

  const getAveragePrice = (commProperties: Property[]) => {
    if (commProperties.length === 0) return 0;
    const total = commProperties.reduce((sum, p) => sum + p.price, 0);
    return Math.round(total / commProperties.length);
  };

  // Mock ROI calculator based on community name
  const getCommunityROI = (name: string) => {
    const rois: Record<string, string> = {
      "Palm Jumeirah": "6.8%",
      "Dubai Marina": "7.4%",
      "Downtown Dubai": "7.1%",
      "Business Bay": "7.8%",
      "Dubai Hills Estate": "6.5%",
      "Dubai Creek Harbour": "7.2%",
      "Bluewaters Island": "6.9%",
      "Arabian Ranches": "5.8%",
      "Jumeirah Village Circle": "8.2%",
    };
    return rois[name] || "6.7%";
  };

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
          <span className="text-luxury-gold">Communities</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Prime Dubai Enclaves</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Exclusive Master Communities</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Explore Dubai&apos;s most coveted residential neighborhoods, offering beachfront villas, high-rise marina towers, championship golf estates, and high-yielding urban sanctuaries.
          </p>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communities.map((comm) => {
              const commProps = getCommunityProperties(comm.id);
              const count = commProps.length;
              const avgPrice = getAveragePrice(commProps);
              const roi = getCommunityROI(comm.name);

              return (
                <div
                  key={comm.id}
                  className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500 flex flex-col group hover:-translate-y-1 shadow-luxury"
                >
                  {/* Banner Image / Cover */}
                  <div className="h-52 relative bg-luxury-charcoal/80 overflow-hidden">
                    <Image
                      src={comm.bannerUrl || "/assets/apartment_render.webp"}
                      alt={comm.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark to-transparent" />
                    
                    {/* Floating property count */}
                    <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-charcoal text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      {count} {count === 1 ? "Property" : "Properties"}
                    </span>

                    {comm.isFeatured && (
                      <span className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                        Featured
                      </span>
                    )}

                    {/* Community Title Overlay */}
                    <div className="absolute bottom-4 left-6">
                      <h3 className="font-serif text-xl text-white group-hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1.5 leading-tight">
                        <span>{comm.name}</span>
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                      {comm.description || "Master-planned luxury residential enclave providing world-class infrastructure, schools, private park clubs, and outstanding lifestyle convenience."}
                    </p>

                    {/* Community Stats Bar */}
                    <div className="grid grid-cols-2 gap-4 border-t border-luxury-border/10 pt-4 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                      <div>
                        <span className="block text-[8px] text-gray-500 mb-0.5">Average Price</span>
                        <span className="text-white font-sans text-xs">
                          {avgPrice > 0 ? formatAED(avgPrice) : "AED 4.5M"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-gray-500 mb-0.5">Estimated ROI</span>
                        <span className="text-luxury-gold font-sans text-xs flex items-center gap-0.5">
                          <Percent className="w-3.5 h-3.5" />
                          <span>{roi}</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/communities/${comm.slug}`} className="w-full py-2.5 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300 text-[9px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 text-gray-300 group-hover:bg-luxury-gold/5 cursor-pointer">
                        <span>Explore Community</span>
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
