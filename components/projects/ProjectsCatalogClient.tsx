"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, FileDown, ArrowRight, Sparkles, MapPin, Building2, 
  Calendar, Layers, Filter, ChevronRight 
} from "lucide-react";
import { Project } from "@/types";
import { formatAED } from "@/lib/utils";
import { db } from "@/lib/db";

interface ProjectsCatalogClientProps {
  initialProjects: Project[];
}

const STATUS_FILTERS = [
  { value: "all", label: "All Launches" },
  { value: "pre-launch", label: "Pre-Launch" },
  { value: "under-construction", label: "Under Construction" },
  { value: "handover-soon", label: "Handover Soon" },
];

export default function ProjectsCatalogClient({ initialProjects }: ProjectsCatalogClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    } else {
      db.getProjects().then((data) => {
        if (data && data.length > 0) setProjects(data);
      });
    }
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = activeStatus === "all" || project.status === activeStatus;
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        project.title.toLowerCase().includes(q) ||
        (project.headline && project.headline.toLowerCase().includes(q)) ||
        (project.developerName && project.developerName.toLowerCase().includes(q)) ||
        (project.location && project.location.toLowerCase().includes(q)) ||
        (project.propertyType && project.propertyType.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.startingPrice - b.startingPrice;
      if (sortBy === "price-desc") return b.startingPrice - a.startingPrice;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [projects, search, activeStatus, sortBy]);

  // Statistics
  const totalLaunches = projects.length;
  const preLaunchCount = projects.filter((p) => p.status === "pre-launch" || p.status === "launching-soon").length;
  const minPrice = projects.length > 0 ? Math.min(...projects.map(p => p.startingPrice)) : 0;

  return (
    <div className="min-h-screen bg-luxury-dark text-white pt-24 pb-20">
      {/* Hero Header */}
      <section className="relative border-b border-luxury-border/30 bg-gradient-to-b from-luxury-charcoal/80 to-luxury-dark py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-luxury-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-luxury-gold/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 mb-6 font-medium">
            <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-luxury-gold">Off-Plan Projects</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Dubai Developments</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight">
              Curated Off-Plan Launches &amp; Master Communities
            </h1>
            
            <p className="mt-5 text-base sm:text-lg text-gray-300 font-light leading-relaxed">
              Explore Dubai&apos;s premier off-plan estates, beachfront villas, and branded towers. 
              Review verified developer price sheets, structured milestone payment plans, and download official 20MB brochures directly.
            </p>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-luxury-border/30">
              <div>
                <p className="text-2xl sm:text-3xl font-serif text-luxury-gold font-medium">{totalLaunches}</p>
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Master Developments</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-serif text-white font-medium">{preLaunchCount}</p>
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Pre-Launch Exclusives</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-2xl sm:text-3xl font-serif text-luxury-gold font-medium">
                  {minPrice > 0 ? formatAED(minPrice).replace("AED ", "AED ") : "AED 3.8M"}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Starting Price</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Toolbar */}
        <div className="bg-luxury-charcoal/60 border border-luxury-border/40 rounded-xl p-4 sm:p-5 mb-10 shadow-lg backdrop-blur-md">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by project name, developer, or location..."
                className="w-full pl-10 pr-4 py-2.5 bg-luxury-dark border border-luxury-border/40 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveStatus(f.value)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeStatus === f.value
                      ? "bg-luxury-gold text-luxury-charcoal font-bold shadow-md shadow-luxury-gold/20"
                      : "bg-luxury-dark/80 text-gray-400 hover:text-white hover:bg-luxury-dark border border-luxury-border/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "newest")}
                aria-label="Sort projects"
                className="bg-luxury-dark border border-luxury-border/40 rounded-lg text-xs text-white px-3 py-2.5 focus:outline-none focus:border-luxury-gold cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Latest Launches</option>
              </select>
            </div>
          </div>

          {/* Active Filter Summary */}
          <div className="mt-3 pt-3 border-t border-luxury-border/20 flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing <strong className="text-white">{filteredProjects.length}</strong> of {projects.length} developments
            </span>
            {(search || activeStatus !== "all") && (
              <button
                onClick={() => { setSearch(""); setActiveStatus("all"); }}
                className="text-luxury-gold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-luxury-charcoal/30 border border-dashed border-luxury-border/40 rounded-2xl p-8">
            <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="font-serif text-xl text-white mb-2">No Matching Developments</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              No project launches matched your search criteria. Try modifying your filters or search keywords.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveStatus("all"); }}
              className="px-5 py-2.5 bg-luxury-gold text-luxury-charcoal font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-luxury-gold/90 transition-all cursor-pointer"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const statusDisplay = project.status === "pre-launch"
                ? "Pre-Launch"
                : project.status === "launching-soon"
                ? "Launching Soon"
                : project.status === "under-construction"
                ? "Under Construction"
                : project.status === "handover-soon"
                ? "Handover Soon"
                : project.status;

              return (
                <article
                  key={project.id}
                  className="group flex flex-col bg-luxury-charcoal/40 border border-luxury-border/30 rounded-2xl overflow-hidden hover:border-luxury-gold/50 transition-all duration-300 hover:shadow-2xl hover:shadow-luxury-gold/5"
                >
                  {/* Card Image Area */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-luxury-dark">
                    <Image
                      src={project.coverImage || "/assets/apartment_render.webp"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                        project.status === "pre-launch" 
                          ? "bg-luxury-gold text-luxury-charcoal" 
                          : "bg-black/60 text-white border border-white/20"
                      }`}>
                        {statusDisplay}
                      </span>

                      {project.isFeatured && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 border border-luxury-gold/50 text-luxury-gold backdrop-blur-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* PDF Brochure Overlay Tag if exists */}
                    {project.pdfBrochureUrl && (
                      <div className="absolute bottom-3 left-3 bg-luxury-charcoal/90 border border-luxury-gold/30 rounded-md px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-medium text-luxury-gold backdrop-blur-md">
                        <FileDown className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>PDF Brochure ({project.pdfBrochureSize || "Official"})</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Developer & Location Row */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        {project.developerName && (
                          <span className="inline-flex items-center gap-1 text-luxury-gold font-medium">
                            <Building2 className="w-3.5 h-3.5" />
                            {project.developerName}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          {project.location}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-normal group-hover:text-luxury-gold transition-colors duration-200 line-clamp-1">
                        <Link href={`/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h2>

                      {/* Headline / Subtitle */}
                      {project.headline && (
                        <p className="mt-1.5 text-xs text-gray-300 font-light line-clamp-2 leading-relaxed">
                          {project.headline}
                        </p>
                      )}
                    </div>

                    {/* Specs / Facts Grid */}
                    <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-luxury-border/20 text-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">Starting Price</span>
                        <span className="font-serif text-base text-luxury-gold font-medium">
                          {formatAED(project.startingPrice)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">Handover</span>
                        <span className="text-gray-200 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {project.handoverDate || "TBA"}
                        </span>
                      </div>
                      {project.paymentPlanSummary && (
                        <div className="col-span-2">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">Payment Structure</span>
                          <span className="text-xs text-gray-300 font-light flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                            {project.paymentPlanSummary}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-luxury-charcoal text-xs uppercase tracking-wider font-bold transition-all duration-300 border border-luxury-gold/30 hover:border-luxury-gold"
                      >
                        <span>View Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {project.pdfBrochureUrl && (
                        <Link
                          href={`/projects/${project.slug}#Form-advisor`}
                          title="Download Brochure"
                          className="p-2.5 rounded-lg border border-luxury-border/40 hover:border-luxury-gold text-gray-300 hover:text-luxury-gold bg-luxury-dark/60 transition-colors"
                        >
                          <FileDown className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* VIP Launch Concierge Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="relative rounded-2xl bg-gradient-to-r from-luxury-charcoal via-luxury-dark to-luxury-charcoal border border-luxury-gold/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-luxury-gold/15 to-transparent pointer-events-none" />
          <div className="relative max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold block">
              Private Off-Market Allocations
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white">
              Looking for early access to unannounced Dubai launches?
            </h2>
            <p className="text-sm text-gray-300 font-light leading-relaxed">
              Our direct relationships with top developers (Nakheel, Emaar, Sobha, Meraas) give our clients priority unit allocations before public launch events.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/971501348020?text=Hello%20Luxespace,%20I'm%20interested%20in%20exclusive%20Dubai%20off-plan%20allocations."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-luxury-gold/20"
              >
                <span>Speak with an Off-Plan Specialist</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-luxury-border/50 hover:border-luxury-gold text-white hover:text-luxury-gold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Request Private Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
