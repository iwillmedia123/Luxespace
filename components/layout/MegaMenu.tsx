"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building2 } from "lucide-react";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURED_COMMUNITIES = [
  { name: "Palm Jumeirah", desc: "Iconic waterfront living", href: "/communities/palm-jumeirah" },
  { name: "Downtown Dubai", desc: "Urban sophistication", href: "/communities/downtown-dubai" },
  { name: "Dubai Hills Estate", desc: "Green championship golf living", href: "/communities/dubai-hills-estate" },
  { name: "Emirates Hills", desc: "Exclusive mansion enclave", href: "/communities/emirates-hills" },
];

const FEATURED_DEVELOPERS = [
  { name: "Emaar Properties", desc: "Pioneering community layouts", href: "/developers/emaar" },
  { name: "Sobha Realty", desc: "German-engineered signature builds", href: "/developers/sobha" },
  { name: "Ellington Properties", desc: "Art-centric boutique details", href: "/developers/ellington" },
  { name: "DAMAC Properties", desc: "High-fashion luxury collaborations", href: "/developers/damac" },
];

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-[80px] left-0 right-0 z-40 bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-border/30 shadow-2xl py-12 px-4 sm:px-6 lg:px-8 hidden lg:block"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Left Section: Communities */}
        <div className="col-span-5 space-y-6">
          <div className="flex items-center gap-2 border-b border-luxury-border/20 pb-2">
            <MapPin className="w-4 h-4 text-luxury-gold" />
            <h4 className="font-serif text-sm uppercase tracking-wider text-white">Prime Communities</h4>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {FEATURED_COMMUNITIES.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col space-y-1 hover:bg-white/5 p-2 rounded-lg transition-colors duration-300"
              >
                <span className="text-xs font-semibold text-white group-hover:text-luxury-gold transition-colors duration-300">
                  {item.name}
                </span>
                <span className="text-[10px] text-gray-500 font-light line-clamp-1">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors duration-300"
          >
            <span>All Communities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Middle Section: Developers */}
        <div className="col-span-5 space-y-6">
          <div className="flex items-center gap-2 border-b border-luxury-border/20 pb-2">
            <Building2 className="w-4 h-4 text-luxury-gold" />
            <h4 className="font-serif text-sm uppercase tracking-wider text-white">Top Developers</h4>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {FEATURED_DEVELOPERS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col space-y-1 hover:bg-white/5 p-2 rounded-lg transition-colors duration-300"
              >
                <span className="text-xs font-semibold text-white group-hover:text-luxury-gold transition-colors duration-300">
                  {item.name}
                </span>
                <span className="text-[10px] text-gray-500 font-light line-clamp-1">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/developers"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors duration-300"
          >
            <span>All Developers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Section: Featured Campaign Banner */}
        <div className="col-span-2 bg-luxury-charcoal/50 border border-luxury-border/30 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[8px] uppercase tracking-widest bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-2 py-0.5 rounded-full inline-block font-semibold">
              Advisory
            </span>
            <h5 className="font-serif text-sm text-white font-medium leading-snug">
              Bespoke Asset Curation
            </h5>
            <p className="text-[10px] text-gray-500 font-light leading-relaxed">
              Unlock off-market luxury penthouses and investment portfolios in Dubai.
            </p>
          </div>
          
          <Link
            href="/contact"
            className="bg-luxury-gold text-luxury-charcoal hover:bg-white text-[9px] uppercase tracking-widest font-bold py-2 rounded-lg text-center transition-colors duration-300 mt-4 block"
          >
            Request Brochure
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
