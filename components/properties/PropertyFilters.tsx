"use client";

import { useState } from "react";
import { X, Search, ChevronDown, Check, RefreshCw } from "lucide-react";
import { Community, Developer } from "@/types";
import Button from "@/components/ui/Button";

interface PropertyFiltersProps {
  communities: Community[];
  developers: Developer[];
  onApply: (filters: Record<string, string | number | boolean | undefined>) => void;
  onReset: () => void;
  initialFilters?: Record<string, string | number | boolean | undefined>;
  onClose?: () => void; // Mobile overlay close
}

export default function PropertyFilters({
  communities,
  developers,
  onApply,
  onReset,
  initialFilters = {},
  onClose,
}: PropertyFiltersProps) {
  const [purpose, setPurpose] = useState<string>(initialFilters.purpose ? String(initialFilters.purpose) : "");
  const [type, setType] = useState<string>(initialFilters.type ? String(initialFilters.type) : "");
  const [community, setCommunity] = useState<string>(initialFilters.community ? String(initialFilters.community) : "");
  const [developer, setDeveloper] = useState<string>(initialFilters.developer ? String(initialFilters.developer) : "");
  const [minPrice, setMinPrice] = useState<string | number>(initialFilters.minPrice !== undefined ? Number(initialFilters.minPrice) : "");
  const [maxPrice, setMaxPrice] = useState<string | number>(initialFilters.maxPrice !== undefined ? Number(initialFilters.maxPrice) : "");
  const [minArea, setMinArea] = useState<string | number>(initialFilters.minArea !== undefined ? Number(initialFilters.minArea) : "");
  const [maxArea, setMaxArea] = useState<string | number>(initialFilters.maxArea !== undefined ? Number(initialFilters.maxArea) : "");
  const [bedrooms, setBedrooms] = useState<string | number>(initialFilters.bedrooms !== undefined ? Number(initialFilters.bedrooms) : "");
  const [bathrooms, setBathrooms] = useState<string | number>(initialFilters.bathrooms !== undefined ? Number(initialFilters.bathrooms) : "");
  const [parking, setParking] = useState<string | number>(initialFilters.parking !== undefined ? Number(initialFilters.parking) : "");
  const [completionStatus, setCompletionStatus] = useState<string>(initialFilters.completionStatus ? String(initialFilters.completionStatus) : "");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialFilters.isFeatured ? Boolean(initialFilters.isFeatured) : false);

  const handleApply = () => {
    onApply({
      purpose: purpose || undefined,
      type: type || undefined,
      community: community || undefined,
      developer: developer || undefined,
      minPrice: minPrice !== "" ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
      minArea: minArea !== "" ? Number(minArea) : undefined,
      maxArea: maxArea !== "" ? Number(maxArea) : undefined,
      bedrooms: bedrooms !== "" ? Number(bedrooms) : undefined,
      bathrooms: bathrooms !== "" ? Number(bathrooms) : undefined,
      parking: parking !== "" ? Number(parking) : undefined,
      completionStatus: completionStatus || undefined,
      isFeatured: isFeatured ? true : undefined,
    });
    if (onClose) onClose();
  };

  const handleReset = () => {
    setPurpose("");
    setType("");
    setCommunity("");
    setDeveloper("");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setBedrooms("");
    setBathrooms("");
    setParking("");
    setCompletionStatus("");
    setIsFeatured(false);
    onReset();
    if (onClose) onClose();
  };

  const propertyTypes = [
    { label: "Villa", value: "villa" },
    { label: "Apartment", value: "apartment" },
    { label: "Penthouse", value: "penthouse" },
    { label: "Townhouse", value: "townhouse" },
    { label: "Mansion", value: "mansion" },
    { label: "Duplex", value: "duplex" },
    { label: "Commercial", value: "commercial" },
    { label: "Office", value: "office" },
    { label: "Retail", value: "retail" },
  ];

  return (
    <div className="flex flex-col h-full bg-luxury-dark/95 border border-luxury-border/30 rounded-3xl p-6 overflow-y-auto space-y-6 w-full max-w-sm">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-luxury-border/20">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Filters</span>
          <h2 className="text-base font-serif text-white mt-0.5">Refine Portfolio</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Inputs Form */}
      <div className="flex-grow space-y-5">
        {/* Purpose */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Purpose</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Buy", value: "buy" },
              { label: "Rent", value: "rent" },
              { label: "Off-Plan", value: "off-plan" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPurpose(purpose === item.value ? "" : item.value)}
                className={`py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  purpose === item.value
                    ? "bg-luxury-gold border-luxury-gold text-luxury-charcoal"
                    : "bg-[#1f232c] border-luxury-border/30 text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Property Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Community */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Community</label>
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Developer */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Developer</label>
          <select
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="">All Developers</option>
            {developers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Price Range (AED)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4 Beds</option>
              <option value="5">5 Beds</option>
              <option value="6">6+ Beds</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Bathrooms</label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="">Any</option>
              <option value="1">1 Bath</option>
              <option value="2">2 Baths</option>
              <option value="3">3 Baths</option>
              <option value="4">4 Baths</option>
              <option value="5">5+ Baths</option>
            </select>
          </div>
        </div>

        {/* Area Range */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Area Range (Sq Ft)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Sqft"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max Sqft"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Completion status */}
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Completion Status</label>
          <select
            value={completionStatus}
            onChange={(e) => setCompletionStatus(e.target.value)}
            className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="">All Completion Status</option>
            <option value="ready">Ready to Move</option>
            <option value="off-plan">Off-Plan</option>
            <option value="under-construction">Under Construction</option>
          </select>
        </div>

        {/* Featured Only */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Featured Listings Only</span>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#1f232c] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-luxury-gold peer-checked:after:bg-luxury-charcoal" />
          </label>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-4 border-t border-luxury-border/20 flex gap-3">
        <button
          onClick={handleReset}
          className="flex-grow flex items-center justify-center gap-1.5 py-3 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-xs font-semibold text-gray-400 transition-all cursor-pointer bg-transparent"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
        <button
          onClick={handleApply}
          className="flex-grow py-3 rounded-xl bg-luxury-gold text-luxury-charcoal hover:bg-white text-xs font-bold transition-all cursor-pointer border border-luxury-gold"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
