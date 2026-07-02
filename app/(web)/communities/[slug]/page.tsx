"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft, Percent, Landmark, CheckCircle2, ChevronRight, Compass, Home } from "lucide-react";
import { db } from "@/lib/db";
import { Community, Property, Agent } from "@/types";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import PropertyMap from "@/components/properties/PropertyMap";
import { formatAED } from "@/lib/utils";

interface CommunityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const resolvedParams = use(params);
  const [community, setCommunity] = useState<Community | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "amenities" | "listings">("overview");

  useEffect(() => {
    async function loadCommunityData() {
      try {
        setLoading(true);
        const [comms, props, ags] = await Promise.all([
          db.getCommunities(),
          db.getProperties(),
          db.getAgents(),
        ]);

        const currentComm = comms.find((c) => c.slug === resolvedParams.slug);
        if (currentComm) {
          setCommunity(currentComm);
          
          // Filter properties
          const commProps = props.filter((p) => p.communityId === currentComm.id);
          setProperties(commProps);

          // Find agents who specialize in this community
          const commAgs = ags.filter((a) =>
            a.specialization.some((s) => s.toLowerCase().includes(currentComm.name.toLowerCase()))
          );
          setAgents(commAgs.length > 0 ? commAgs : ags.slice(0, 2)); // Fallback
        }
      } catch (err) {
        console.error("Error loading community detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCommunityData();
  }, [resolvedParams.slug]);

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

  const getAveragePrice = () => {
    if (properties.length === 0) return 4500000;
    const total = properties.reduce((sum, p) => sum + p.price, 0);
    return Math.round(total / properties.length);
  };

  // Mock nearby places
  const getNearbyAmenities = (name: string) => {
    return [
      { name: "Nearest Metro", value: name === "Downtown Dubai" || name === "Business Bay" ? "Burj Khalifa/Dubai Mall Metro (3 mins)" : "Dubai Internet City Metro (10 mins)", type: "metro" },
      { name: "Premium Academy", value: "GEMS Wellington International School", type: "school" },
      { name: "Healthcare Center", value: "King's College Hospital London clinics", type: "hospital" },
      { name: "Luxury Shopping", value: name === "Downtown Dubai" ? "The Dubai Mall (Walkable)" : "Mall of the Emirates (10 mins)", type: "shopping" },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f232c] pt-32 pb-20 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-light tracking-wider">Loading Community Map & Dossier...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <main className="min-h-screen bg-[#1f232c] pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <MapPin className="w-12 h-12 text-luxury-gold/50 mb-4 animate-pulse" />
        <h1 className="font-serif text-2xl text-white">Community Dossier Not Found</h1>
        <p className="text-xs text-gray-400 mt-2 font-light max-w-sm">
          The requested luxury community dossier could not be retrieved from our archives.
        </p>
        <Link href="/communities" className="mt-6 text-xs text-luxury-gold hover:underline uppercase tracking-widest font-bold flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Communities</span>
        </Link>
      </main>
    );
  }

  const roi = getCommunityROI(community.name);
  const avgPrice = getAveragePrice();
  const locationText = (community.coordinates as any)?.locationText || "Freehold Zone, Dubai, UAE";
  const amenitiesList = (community.coordinates as any)?.neighborhoodAmenities && (community.coordinates as any).neighborhoodAmenities.length > 0
    ? (community.coordinates as any).neighborhoodAmenities
    : getNearbyAmenities(community.name);

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link href="/communities" className="text-gray-400 hover:text-luxury-gold transition-colors duration-300 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 mb-6 select-none">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Communities</span>
        </Link>

        {/* Hero Card Banner */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl overflow-hidden shadow-2xl mb-10">
          <div className="h-64 sm:h-80 relative bg-luxury-charcoal/80 overflow-hidden">
            <Image
              src={community.bannerUrl || "/assets/palm_jumeirah_render.png"}
              alt={community.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-luxury-dark/40 to-transparent" />
            
            {/* Header titles */}
            <div className="absolute bottom-6 left-6 sm:left-8 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold bg-luxury-gold/10 border border-luxury-gold/30 px-2.5 py-1 rounded-full backdrop-blur-md">
                  Freehold Residency Area
                </span>
                {community.isFeatured && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-1 rounded-full backdrop-blur-md">
                    Top Investment Hub
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-white">{community.name}</h1>
            </div>
          </div>

          {/* Quick stats grid bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 text-[10px] text-gray-500 uppercase tracking-widest font-semibold border-t border-luxury-border/10 bg-luxury-dark/60">
            <div>
              <span className="block text-[8px] text-gray-500 mb-1">Catalog Listings</span>
              <span className="text-white font-sans text-xs">{properties.length} Listings</span>
            </div>
            <div>
              <span className="block text-[8px] text-gray-500 mb-1">Average Price</span>
              <span className="text-white font-sans text-xs">{formatAED(avgPrice)}</span>
            </div>
            <div>
              <span className="block text-[8px] text-gray-500 mb-1">Average Yield ROI</span>
              <span className="text-luxury-gold font-sans text-xs flex items-center gap-0.5">
                <Percent className="w-3.5 h-3.5" />
                <span>{roi}</span>
              </span>
            </div>
            <div>
              <span className="block text-[8px] text-gray-500 mb-1">DLD Coordinates</span>
              <span className="text-white font-sans text-xs">
                {community.coordinates?.lat ? `${community.coordinates.lat.toFixed(4)}° N, ${community.coordinates.lng.toFixed(4)}° E` : "25.1124° N, 55.1390° E"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-4 border-b border-luxury-border/20 mb-8 select-none overflow-x-auto pb-1">
          {[
            { id: "overview", label: "Area & Lifestyle" },
            { id: "amenities", label: "Neighborhood Amenities" },
            { id: "listings", label: `Listed Properties (${properties.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "amenities" | "listings")}
              className={`text-[10px] uppercase tracking-widest font-bold pb-3 border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-luxury-gold text-luxury-gold"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic tabs content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area: Col span 2 */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                    <Compass className="w-4 h-4 text-luxury-gold" />
                    <span>Area Overview</span>
                  </h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {community.description || "Master-planned luxury residential enclave providing world-class infrastructure, schools, private park clubs, and outstanding lifestyle convenience."}
                  </p>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    Widely regarded as one of Dubai&apos;s most prominent developments, {community.name} offers a curated luxury environment. Residents enjoy double-height glass villa structures, waterfront boardwalks, private parks, yacht clubs, and immediately adjacent luxury dining options.
                  </p>
                </div>

                {/* Map integration */}
                <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                    <MapPin className="w-4 h-4 text-luxury-gold" />
                    <span>Compass Location Map</span>
                  </h3>
                  <PropertyMap
                    latitude={community.coordinates?.lat || 25.1124}
                    longitude={community.coordinates?.lng || 55.1390}
                    title={community.name}
                    location={locationText}
                    concentricDistances={(community.coordinates as any)?.concentricDistances}
                  />
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                  <Landmark className="w-4 h-4 text-luxury-gold" />
                  <span>Infrastructure & Nearby Points</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {amenitiesList.map((item: any, idx: number) => (
                    <div key={idx} className="bg-luxury-charcoal/50 border border-luxury-border/20 rounded-xl p-4 flex gap-3.5 items-center">
                      <div className="w-9 h-9 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center p-1">
                        <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[8px] uppercase tracking-widest text-gray-500 font-semibold">{item.name}</span>
                        <span className="text-xs text-white font-light">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-luxury-border/10 space-y-3">
                  <h4 className="text-[10px] text-luxury-gold font-bold uppercase tracking-wider">Lifestyle Experience</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">
                    This prime enclave is anchored by luxury private clubs, pedestrian promenades, running tracks, international nursery groups, and premium health centers. It delivers absolute security and is highly sought after by expat families and multinational executives.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <div className="space-y-6">
                <h3 className="text-sm font-serif text-white uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                  <Home className="w-4 h-4 text-luxury-gold" />
                  <span>Active Listings in {community.name}</span>
                </h3>

                {properties.length === 0 ? (
                  <div className="text-center py-10 bg-luxury-dark border border-luxury-border/30 rounded-2xl space-y-2">
                    <p className="text-xs text-gray-400 font-light">No properties are currently listed for this community in our catalog.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {properties.map((property) => (
                      <PropertyCardLuxury key={property.id} property={property} viewMode="grid" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Col span 1 */}
          <div className="space-y-6">
            {/* Advisory Agents */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest border-b border-luxury-border/20 pb-3">
                Assigned Advisors
              </h3>
              
              <div className="space-y-4">
                {agents.map((ag) => (
                  <div key={ag.id} className="flex items-center gap-3.5 border-b border-luxury-border/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="w-12 h-12 rounded-full bg-luxury-charcoal relative overflow-hidden border border-luxury-border/30 shrink-0">
                      <Image
                        src={ag.avatarUrl || "/assets/agent_1.png"}
                        alt={ag.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-xs text-white leading-tight">{ag.name}</h4>
                      <p className="text-[8px] text-luxury-gold uppercase tracking-widest font-semibold">{ag.title}</p>
                      <Link href={`/agents/${ag.slug}`} className="text-[8px] text-gray-400 hover:text-white uppercase tracking-wider font-bold flex items-center gap-0.5 mt-1">
                        <span>View Profile</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
