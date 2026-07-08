"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Grid, List, SlidersHorizontal, Inbox, ChevronDown } from "lucide-react";
import { Property, Community, Developer } from "@/types";
import { db } from "@/lib/db";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import PropertySkeleton from "@/components/properties/PropertySkeleton";
import PropertyFilters from "@/components/properties/PropertyFilters";

interface PropertyListingPageProps {
  defaultPurpose?: string;
  heroTitle: string;
  heroSubtitle: string;
}

function PropertyListingPageContent({
  defaultPurpose,
  heroTitle,
  heroSubtitle,
}: PropertyListingPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<Record<string, string | number | boolean | undefined>>({
    purpose: defaultPurpose || undefined,
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const purposeParam = searchParams.get("purpose");
    const communityParam = searchParams.get("community");
    const typeParam = searchParams.get("type");
    const priceParam = searchParams.get("price");

    const newFilters: Record<string, string | number | boolean | undefined> = {
      purpose: defaultPurpose || purposeParam || undefined,
      community: communityParam || undefined,
      type: typeParam || undefined,
    };

    if (priceParam) {
      if (priceParam === "0-5m") {
        newFilters.minPrice = 0;
        newFilters.maxPrice = 5000000;
      } else if (priceParam === "5m-15m") {
        newFilters.minPrice = 5000000;
        newFilters.maxPrice = 15000000;
      } else if (priceParam === "15m-30m") {
        newFilters.minPrice = 15000000;
        newFilters.maxPrice = 30000000;
      } else if (priceParam === "30m+") {
        newFilters.minPrice = 30000000;
      }
    }

    setActiveFilters(newFilters);
  }, [searchParams, defaultPurpose]);

  // Mobile Filters Overlay
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    async function loadStaticData() {
      try {
        const [comms, devs] = await Promise.all([
          db.getCommunities(),
          db.getDevelopers(),
        ]);
        setCommunities(comms);
        setDevelopers(devs);
      } catch (err) {
        console.error("Error loading filter options:", err);
      }
    }
    loadStaticData();
  }, []);

  const [prevFiltersKey, setPrevFiltersKey] = useState("");

  useEffect(() => {
    const currentFiltersKey = JSON.stringify({ activeFilters, searchQuery, sortOption });
    if (prevFiltersKey !== currentFiltersKey) {
      setPrevFiltersKey(currentFiltersKey);
      setCurrentPage(1);
    }
  }, [activeFilters, searchQuery, sortOption, prevFiltersKey]);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const filters = {
          ...activeFilters,
          search: searchQuery || undefined,
          sort: sortOption,
          page: currentPage,
          limit: itemsPerPage,
          isSummary: true,
        };
        const res = await db.getPropertiesByFilters(filters);
        if (currentPage === 1) {
          setProperties(res.properties);
        } else {
          setProperties((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNew = res.properties.filter((p) => !existingIds.has(p.id));
            return [...prev, ...uniqueNew];
          });
        }
        setTotalItems(res.totalCount);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [prevFiltersKey, currentPage]);

  const handleFilterApply = (filters: Record<string, string | number | boolean | undefined>) => {
    setActiveFilters({
      ...filters,
      purpose: defaultPurpose || filters.purpose, // Force default if locked
    });
  };

  const handleFilterReset = () => {
    setActiveFilters({
      purpose: defaultPurpose || undefined,
    });
    setSearchQuery("");
  };



  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: defaultPurpose ? (defaultPurpose === "buy" ? "Properties for Sale" : "Properties for Rent") : "Exclusive Portfolio", active: true },
  ];

  return (
    <div className="bg-luxury-charcoal min-h-screen text-white pt-24 sm:pt-32 pb-24">
      {/* Hero Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden py-16 px-8 sm:px-16 bg-gradient-to-r from-luxury-dark via-[#1e222b] to-luxury-dark border border-luxury-border/30">
          {/* Light flare accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-4 relative z-10 max-w-2xl">
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
            <Typography variant="hero" className="text-4xl sm:text-6xl tracking-tight leading-tight">
              {heroTitle}
            </Typography>
            <p className="text-sm text-gray-400 font-light max-w-lg leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Deck */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block shrink-0 sticky top-28">
            <PropertyFilters
              communities={communities}
              developers={developers}
              onApply={handleFilterApply}
              onReset={handleFilterReset}
              initialFilters={activeFilters}
            />
          </aside>

          {/* Right Listings Arena */}
          <div className="flex-grow w-full space-y-6">
            {/* Top Toolbar Control deck */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Field */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by community, tower name, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              {/* View switches + Sorting */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-luxury-charcoal border border-luxury-border/40 rounded-xl text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-3">
                  {/* Sorting dropdown */}
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="newest">Newest Listed</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="area-desc">Area: Large to Small</option>
                  </select>

                  {/* Grid/List togglers */}
                  <div className="bg-[#1f232c] p-1 border border-luxury-border/40 rounded-xl hidden sm:flex gap-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "grid" ? "bg-luxury-gold text-luxury-charcoal" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "list" ? "bg-luxury-gold text-luxury-charcoal" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Counters */}
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                Showing 1–{properties.length} of {totalItems} Elite Properties
              </span>
            </div>

            {/* Cards Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {loading && currentPage === 1 ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <PropertySkeleton key={idx} viewMode={viewMode} />
                ))
              ) : properties.length === 0 ? (
                <div className="col-span-full bg-luxury-dark border border-luxury-border/30 rounded-3xl p-16 text-center space-y-4">
                  <Inbox className="w-12 h-12 text-luxury-gold/50 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-white">No Matching Properties</h3>
                    <p className="text-xs text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
                      We couldn&apos;t find any listings matching your current filter choices. Try widening your criteria.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleFilterReset} className="text-xs border-luxury-border/65">
                    Clear Active Filters
                  </Button>
                </div>
              ) : (
                properties.map((property) => (
                  <PropertyCardLuxury key={property.id} property={property} viewMode={viewMode} />
                ))
              )}
              {loading && currentPage > 1 && Array.from({ length: 3 }).map((_, idx) => (
                <PropertySkeleton key={`skeleton-${idx}`} viewMode={viewMode} />
              ))}
            </div>

            {/* Load More Button */}
            {!loading && properties.length < totalItems && (
              <div className="pt-12 flex justify-center">
                <Button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  variant="primary"
                  className="px-8 py-3.5 text-xs tracking-widest font-semibold flex items-center gap-2 group cursor-pointer"
                >
                  <span>Load More Listings</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-300" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Side Overlay Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-sm bg-luxury-dark h-full p-4 overflow-y-auto animate-slide-in flex flex-col">
            <PropertyFilters
              communities={communities}
              developers={developers}
              onApply={handleFilterApply}
              onReset={handleFilterReset}
              initialFilters={activeFilters}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertyListingPage(props: PropertyListingPageProps) {
  return (
    <Suspense fallback={
      <div className="bg-luxury-charcoal min-h-screen text-white pt-24 sm:pt-32 pb-24 flex items-center justify-center">
        <div className="text-luxury-gold animate-pulse text-sm uppercase tracking-widest font-semibold">Loading Portfolio...</div>
      </div>
    }>
      <PropertyListingPageContent {...props} />
    </Suspense>
  );
}
