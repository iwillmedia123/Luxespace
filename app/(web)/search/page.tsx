"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Building2, MapPin, Users, Home, BookOpen, ChevronRight, HelpCircle } from "lucide-react";
import { db } from "@/lib/db";
import { Property, Developer, Community, Agent, BlogPost } from "@/types";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";

const matchQuery = (text: string, queryStr: string): boolean => {
  const normalText = text.toLowerCase();
  const normalQuery = queryStr.toLowerCase().trim();
  if (normalText.includes(normalQuery)) return true;

  // Split query into individual words and stem them
  const words = normalQuery.split(/\s+/);
  return words.some((word) => {
    if (word.length > 2) {
      if (normalText.includes(word)) return true;
      
      // Plural to singular (e.g. palms -> palm, villas -> villa, properties -> property)
      if (word.endsWith("s")) {
        let stem = word.slice(0, -1);
        if (word.endsWith("ies") && word.length > 4) {
          stem = word.slice(0, -3) + "y";
        }
        if (normalText.includes(stem)) return true;
      }
      
      // Singular to plural (e.g. searching "palm" matches "palms", searching "villa" matches "villas")
      if (normalText.includes(word + "s")) return true;
      if (word.endsWith("y") && normalText.includes(word.slice(0, -1) + "ies")) return true;
    }
    return false;
  });
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  
  const [activeTab, setActiveTab] = useState<"all" | "properties" | "developers" | "communities" | "agents" | "blogs">("all");

  useEffect(() => {
    async function executeGlobalSearch() {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const q = query.toLowerCase();

        const [propsList, devsList, commsList, agsList, blogsList] = await Promise.all([
          db.getProperties(),
          db.getDevelopers(),
          db.getCommunities(),
          db.getAgents(),
          db.getBlogs(),
        ]);

        // Filter Properties
        const filteredProps = propsList.filter(
          (p) =>
            matchQuery(p.title, q) ||
            matchQuery(p.location, q) ||
            matchQuery(p.description, q)
        );
        setProperties(filteredProps);

        // Filter Developers
        const filteredDevs = devsList.filter(
          (d) =>
            matchQuery(d.name, q) ||
            (d.description && matchQuery(d.description, q))
        );
        setDevelopers(filteredDevs);

        // Filter Communities
        const filteredComms = commsList.filter(
          (c) =>
            matchQuery(c.name, q) ||
            (c.description && matchQuery(c.description, q))
        );
        setCommunities(filteredComms);

        // Filter Agents
        const filteredAgs = agsList.filter(
          (a) =>
            matchQuery(a.name, q) ||
            matchQuery(a.title, q) ||
            (a.bio && matchQuery(a.bio, q)) ||
            a.specialization.some((s) => matchQuery(s, q))
        );
        setAgents(filteredAgs);

        // Filter Blogs
        const filteredBlogs = blogsList.filter(
          (b) =>
            matchQuery(b.title, q) ||
            matchQuery(b.summary, q) ||
            matchQuery(b.content, q)
        );
        setBlogs(filteredBlogs);

      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setLoading(false);
      }
    }

    executeGlobalSearch();
  }, [query]);

  const totalResults =
    properties.length +
    developers.length +
    communities.length +
    agents.length +
    blogs.length;

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header summary */}
        <div className="border-b border-luxury-border/20 pb-6 mb-10">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Luxespace Intelligence Search</span>
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">
            Search Results for &ldquo;<span className="text-luxury-gold">{query}</span>&rdquo;
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-light">
            {loading ? "Searching databases..." : `Found ${totalResults} matching results across all luxury catalog indexes.`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-20 bg-luxury-dark/40 border border-luxury-border/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20 bg-luxury-dark border border-luxury-border/30 rounded-3xl space-y-4">
            <HelpCircle className="w-12 h-12 text-luxury-gold/50 mx-auto animate-pulse" />
            <h2 className="font-serif text-xl text-white">No Matching Dossiers Found</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
              We couldn&apos;t find any properties, developers, communities, agents, or articles matching your keyword. Please try a different query.
            </p>
            <div className="pt-2">
              <Link href="/properties" className="inline-flex items-center gap-1.5 text-xs text-luxury-gold hover:underline uppercase tracking-widest font-bold">
                <span>View Entire Portfolio</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tabs selector */}
            <div className="flex gap-3 border-b border-luxury-border/10 pb-3 select-none overflow-x-auto">
              {[
                { id: "all", label: "All Results", count: totalResults },
                { id: "properties", label: "Properties", count: properties.length },
                { id: "communities", label: "Communities", count: communities.length },
                { id: "developers", label: "Developers", count: developers.length },
                { id: "agents", label: "Advisors", count: agents.length },
                { id: "blogs", label: "Journal & Blogs", count: blogs.length },
              ].map((tab) => {
                if (tab.count === 0 && tab.id !== "all") return null;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "all" | "properties" | "developers" | "communities" | "agents" | "blogs")}
                    className={`text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-luxury-gold/5 border-luxury-gold text-luxury-gold"
                        : "border-luxury-border/30 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="bg-luxury-charcoal text-white rounded px-1.5 py-0.5 text-[8px] font-sans font-semibold">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Results views */}
            <div className="space-y-12">
              {/* Properties Results */}
              {(activeTab === "all" || activeTab === "properties") && properties.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                    <Home className="w-4 h-4 text-luxury-gold" />
                    <span>Matching Properties ({properties.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((p) => (
                      <PropertyCardLuxury key={p.id} property={p} viewMode="grid" />
                    ))}
                  </div>
                </div>
              )}

              {/* Communities Results */}
              {(activeTab === "all" || activeTab === "communities") && communities.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                    <MapPin className="w-4 h-4 text-luxury-gold" />
                    <span>Matching Communities ({communities.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {communities.map((comm) => (
                      <Link href={`/communities/${comm.slug}`} key={comm.id}>
                        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-luxury-charcoal relative overflow-hidden shrink-0">
                            <Image
                              src={comm.bannerUrl || "/assets/apartment_render.png"}
                              alt={comm.name}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                              {comm.name}
                            </h4>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                              <span>Explore Location Dossier</span>
                              <ChevronRight className="w-3 h-3" />
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Developers Results */}
              {(activeTab === "all" || activeTab === "developers") && developers.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                    <Building2 className="w-4 h-4 text-luxury-gold" />
                    <span>Matching Developers ({developers.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {developers.map((dev) => (
                      <Link href={`/developers/${dev.slug}`} key={dev.id}>
                        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-white border border-luxury-border/30 flex items-center justify-center p-2 shrink-0">
                            {dev.logoUrl && dev.logoUrl.startsWith("http") ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={dev.logoUrl}
                                  alt={dev.name}
                                  fill
                                  sizes="48px"
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <Building2 className="w-8 h-8 text-luxury-charcoal" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                              {dev.name}
                            </h4>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                              <span>Explore Developer Profile</span>
                              <ChevronRight className="w-3 h-3" />
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Advisors Results */}
              {(activeTab === "all" || activeTab === "agents") && agents.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                    <Users className="w-4 h-4 text-luxury-gold" />
                    <span>Matching Advisors ({agents.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {agents.map((ag) => (
                      <Link href={`/agents/${ag.slug}`} key={ag.id}>
                        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-luxury-charcoal relative overflow-hidden border border-luxury-border/30 shrink-0">
                            <Image
                              src={ag.avatarUrl || "/assets/agent_1.png"}
                              alt={ag.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                              {ag.name}
                            </h4>
                            <p className="text-[8px] text-luxury-gold uppercase tracking-widest font-semibold">{ag.title}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-wider font-bold flex items-center gap-0.5 mt-1">
                              <span>Explore Profile Dossier</span>
                              <ChevronRight className="w-2.5 h-2.5" />
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Journal Results */}
              {(activeTab === "all" || activeTab === "blogs") && blogs.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/10 pb-3">
                    <BookOpen className="w-4 h-4 text-luxury-gold" />
                    <span>Matching Journal Articles ({blogs.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {blogs.map((b) => (
                      <Link href={`/blog/${b.slug}`} key={b.id}>
                        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-luxury-charcoal relative overflow-hidden shrink-0">
                            <Image
                              src={b.coverImage || "/assets/apartment_render.png"}
                              alt={b.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1 leading-tight">
                              {b.title}
                            </h4>
                            <p className="text-xs text-gray-400 font-light line-clamp-1">{b.summary}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-0.5">
                              <span>Read Journal</span>
                              <ChevronRight className="w-3 h-3" />
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1f232c] pt-32 pb-20 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-light tracking-wider">Opening Search Registers...</p>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
