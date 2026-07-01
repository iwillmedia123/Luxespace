"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import AnimateIn from "@/components/motion/AnimateIn";

const PURPOSE_OPTIONS = [
  { value: "buy", label: "Buy Property" },
  { value: "rent", label: "Rent Property" },
];

const COMMUNITY_OPTIONS = [
  { value: "", label: "Select Location" },
  { value: "palm-jumeirah", label: "Palm Jumeirah" },
  { value: "downtown-dubai", label: "Downtown Dubai" },
  { value: "dubai-hills", label: "Dubai Hills Estate" },
  { value: "emirates-hills", label: "Emirates Hills" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Select Property Type" },
  { value: "villa", label: "Luxury Villa" },
  { value: "penthouse", label: "Signature Penthouse" },
  { value: "apartment", label: "Premium Apartment" },
];

const PRICE_OPTIONS = [
  { value: "", label: "Select Price Range" },
  { value: "0-5m", label: "AED 0 - 5M" },
  { value: "5m-15m", label: "AED 5M - 15M" },
  { value: "15m-30m", label: "AED 15M - 30M" },
  { value: "30m+", label: "AED 30M+ (Ultra Luxury)" },
];

export default function PropertySearch() {
  const [purpose, setPurpose] = useState("buy");
  const [community, setCommunity] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching properties:", { purpose, community, type, price });
  };

  return (
    <section
      id="property-search-section"
      className="relative min-h-[50vh] bg-luxury-charcoal py-36 px-4 sm:px-6 lg:px-8 border-t border-luxury-border/20 z-30"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title */}
        <AnimateIn preset="fade-up" duration={0.85} className="text-center space-y-4">
          <Typography variant="subheading" className="text-luxury-gold">
            Real Estate Finder
          </Typography>
          <Typography variant="section" as="h2">
            Curate Your Signature Residence
          </Typography>
        </AnimateIn>

        {/* Search Panel Card */}
        <AnimateIn preset="scale-in" delay={0.15} duration={0.9} className="w-full">
          <form
            onSubmit={handleSearch}
            className="w-full bg-luxury-dark/90 backdrop-blur-2xl border border-luxury-gold/15 rounded-3xl p-8 sm:p-10 shadow-luxury-gold space-y-8 transition-all duration-500 hover:border-luxury-gold/35 hover:shadow-[0_25px_60px_-15px_rgba(241,217,155,0.08)]"
          >
            {/* Search inputs row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Purpose selector */}
              <div className="space-y-1">
                <Select
                  label="I Want To"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  options={PURPOSE_OPTIONS}
                />
              </div>

              {/* Location Selector */}
              <div className="space-y-1">
                <Select
                  label="Community"
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  options={COMMUNITY_OPTIONS}
                />
              </div>

              {/* Property Type Selector */}
              <div className="space-y-1">
                <Select
                  label="Property Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  options={TYPE_OPTIONS}
                />
              </div>

              {/* Price Selector */}
              <div className="space-y-1">
                <Select
                  label="Budget"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  options={PRICE_OPTIONS}
                />
              </div>
            </div>

            {/* Submit buttons and details */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-luxury-border/20">
              <Typography variant="caption" className="text-gray-500 text-center sm:text-left leading-normal font-sans">
                Looking for off-market listings? Connect with a consultant for private portfolios.
              </Typography>
              
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </Button>
            </div>
          </form>
        </AnimateIn>
      </div>
    </section>
  );
}
