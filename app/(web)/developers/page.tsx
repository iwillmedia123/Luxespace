"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, ArrowRight, Home, Globe, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { Developer, Property } from "@/types";
import PropertySkeleton from "@/components/properties/PropertySkeleton";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [devsList, propsList] = await Promise.all([
          db.getDevelopers(),
          db.getProperties(),
        ]);
        setDevelopers(devsList);
        setProperties(propsList);
      } catch (err) {
        console.error("Error loading developers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDeveloperPropertyCount = (developerId: string) => {
    return properties.filter((p) => p.developerId === developerId).length;
  };

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background radial blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">Developers</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Master Builders of Dubai</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Luxury Developer Partners</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Collaborating with the region&apos;s most prestigious real estate developers to deliver timeless design, structural integrity, and high-yield investment properties.
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
            {developers.map((dev) => {
              const count = getDeveloperPropertyCount(dev.id);
              return (
                <div
                  key={dev.id}
                  className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500 flex flex-col group hover:-translate-y-1 shadow-luxury"
                >
                  {/* Banner Image / Cover */}
                  <div className="h-44 relative bg-luxury-charcoal/80 overflow-hidden">
                    <Image
                      src={
                        dev.logoUrl && dev.logoUrl.startsWith("http")
                          ? dev.logoUrl
                          : "/assets/apartment_render.webp"
                      }
                      alt={dev.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-35 filter blur-[2px] transition-transform duration-700 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark to-transparent" />
                    
                    {/* Floating properties counter */}
                    <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-charcoal text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      {count} {count === 1 ? "Listing" : "Listings"}
                    </span>

                    {/* Developer Logo Overlay */}
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white border border-luxury-border/40 flex items-center justify-center p-1.5 shadow-lg shrink-0">
                        {dev.logoUrl && dev.logoUrl.startsWith("http") ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={dev.logoUrl}
                              alt={`${dev.name} logo`}
                              fill
                              sizes="40px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Building2 className="w-6 h-6 text-luxury-charcoal" />
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                        {dev.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                      {dev.description || "Leading property developer delivering world-class residences, luxury master developments, and iconic commercial projects in primary freehold areas."}
                    </p>

                    <div className="border-t border-luxury-border/10 pt-4 flex flex-col gap-2.5 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                      {dev.foundedYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-luxury-gold/70" />
                          <span>Established: <span className="text-gray-300 font-sans">{dev.foundedYear}</span></span>
                        </div>
                      )}
                      {dev.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-luxury-gold/70" />
                          <a href={dev.website} target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold transition-colors duration-150 lowercase font-sans font-light">
                            {dev.website.replace("https://", "").replace("www.", "")}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Link href={`/developers/${dev.slug}`} className="w-full py-2.5 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300 text-[9px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 text-gray-300 group-hover:bg-luxury-gold/5 cursor-pointer">
                        <span>View Developer Profile</span>
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
