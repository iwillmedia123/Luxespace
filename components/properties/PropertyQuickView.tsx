"use client";

import Image from "next/image";
import Link from "next/link";
import { X, BedDouble, Bath, Square, Car, MapPin, Star, MessageCircle, Phone, Mail } from "lucide-react";
import { Property } from "@/types";
import { formatAED } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface PropertyQuickViewProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyQuickView({ property, onClose }: PropertyQuickViewProps) {
  const statusLabel =
    property.status === "buy" ? "For Sale" : property.status === "rent" ? "For Rent" : "Off Plan";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl overflow-hidden max-w-3xl w-full relative shadow-2xl animate-scale-in flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[600px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white rounded-full p-2 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Cover Image Slider */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-black shrink-0">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-luxury-charcoal flex items-center justify-center text-gray-500 text-xs">
              No Image Available
            </div>
          )}

          {/* Featured tag */}
          {property.isFeatured && (
            <div className="absolute top-4 left-4 z-10 bg-luxury-gold text-luxury-charcoal text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded">
              Featured
            </div>
          )}
        </div>

        {/* Right Side: Key Details Panel */}
        <div className="p-6 md:p-8 flex-grow flex flex-col justify-between overflow-y-auto w-full md:w-1/2 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold">
                {statusLabel} • {property.type}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-white leading-tight">
                {property.title}
              </h2>
              <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="border-t border-b border-luxury-border/20 py-3">
              <span className="text-[8px] uppercase text-gray-500 tracking-wider font-bold block mb-1">Investment Value</span>
              <span className="text-xl font-serif text-luxury-gold font-bold">
                {formatAED(property.price)}
              </span>
            </div>

            <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-4">
              {property.description}
            </p>

            {/* Spec Icons Row */}
            <div className="grid grid-cols-4 gap-2 text-center text-gray-400">
              <div className="bg-[#1f232c]/50 rounded-xl p-2 border border-luxury-border/10">
                <BedDouble className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
                <span className="text-[7px] uppercase tracking-wider text-gray-500 block mb-0.5">Beds</span>
                <span className="text-xs text-white font-semibold">{property.bedrooms}</span>
              </div>
              <div className="bg-[#1f232c]/50 rounded-xl p-2 border border-luxury-border/10">
                <Bath className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
                <span className="text-[7px] uppercase tracking-wider text-gray-500 block mb-0.5">Baths</span>
                <span className="text-xs text-white font-semibold">{property.bathrooms}</span>
              </div>
              <div className="bg-[#1f232c]/50 rounded-xl p-2 border border-luxury-border/10">
                <Square className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
                <span className="text-[7px] uppercase tracking-wider text-gray-500 block mb-0.5">Sq Ft</span>
                <span className="text-[10px] text-white font-semibold truncate block">{property.areaSqft.toLocaleString()}</span>
              </div>
              <div className="bg-[#1f232c]/50 rounded-xl p-2 border border-luxury-border/10">
                <Car className="w-3.5 h-3.5 text-luxury-gold mx-auto mb-1" />
                <span className="text-[7px] uppercase tracking-wider text-gray-500 block mb-0.5">Parking</span>
                <span className="text-xs text-white font-semibold">{property.parking || 0}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2">
            <Link href={`/properties/${property.slug}`} className="w-full" onClick={onClose}>
              <Button variant="primary" className="w-full text-xs">
                Explore Full Details
              </Button>
            </Link>

            <div className="flex gap-2">
              <a
                href="https://wa.me/9745334644"
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2 flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-white hover:text-black py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:luxespace@gmail.com"
                className="w-1/2 flex items-center justify-center gap-2 bg-luxury-charcoal hover:bg-white hover:text-black border border-luxury-border/40 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>Enquire</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
