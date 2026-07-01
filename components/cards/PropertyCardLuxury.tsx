"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BedDouble, Bath, Square, Car, MapPin, Heart, Share2, Eye, Star } from "lucide-react";
import { Property } from "@/types";
import { formatAED, cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useFavourites } from "@/components/properties/FavouritesProvider";
import Button from "@/components/ui/Button";
import PropertyQuickView from "@/components/properties/PropertyQuickView";

export interface PropertyCardLuxuryProps {
  property: Property;
  viewMode?: "grid" | "list";
}

export default function PropertyCardLuxury({ property, viewMode = "grid" }: PropertyCardLuxuryProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const statusVariant =
    property.status === "buy" ? "status-buy" :
    property.status === "rent" ? "status-rent" : "status-offplan";

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${property.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFav = isFavourite(property.id);

  if (viewMode === "list") {
    return (
      <>
        <Card className="p-0 flex flex-col md:flex-row group overflow-hidden border-luxury-border/30 hover:border-luxury-gold/30 hover:shadow-luxury-gold/[0.02] transition-all duration-500">
          {/* Image Panel */}
          <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto min-h-[220px] overflow-hidden shrink-0">
            {property.images && property.images.length > 0 ? (
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-luxury-charcoal flex items-center justify-center text-gray-600 text-xs">
                No Image Available
              </div>
            )}

            {/* Overlays */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Badge variant={statusVariant}>{property.status === "buy" ? "For Sale" : property.status === "rent" ? "For Rent" : "Off Plan"}</Badge>
              {property.isFeatured && (
                <Badge variant="gold" className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>Featured</span>
                </Badge>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavourite(property.id);
              }}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full glassmorphism text-white hover:text-luxury-gold hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              <Heart className={cn("w-4 h-4", isFav && "fill-luxury-gold text-luxury-gold")} />
            </button>
          </div>

          {/* Details Panel */}
          <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[9px] uppercase tracking-wider font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                    <span>{property.location}</span>
                  </div>
                  <h3 className="font-serif text-xl text-white group-hover:text-luxury-gold transition-colors duration-300">
                    {property.title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-serif text-luxury-gold font-bold block">
                    {formatAED(property.price)}
                  </span>
                  {property.status === "rent" && <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Annual rent</span>}
                </div>
              </div>

              <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">
                {property.description}
              </p>

              {/* Developer details */}
              {property.developer && (
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">
                  Developer: <span className="text-gray-300">{property.developer.name}</span>
                </span>
              )}
            </div>

            {/* Specifications Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-b border-luxury-border/20 py-3.5 text-gray-400">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs text-white font-medium">{property.bedrooms} <span className="text-gray-500 font-light">Beds</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs text-white font-medium">{property.bathrooms} <span className="text-gray-500 font-light">Baths</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-luxury-gold" />
                <span className="text-xs text-white font-medium">{property.areaSqft.toLocaleString()} <span className="text-gray-500 font-light">Sq Ft</span></span>
              </div>
              {property.parking !== undefined && (
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-luxury-gold" />
                  <span className="text-xs text-white font-medium">{property.parking} <span className="text-gray-500 font-light">Parking</span></span>
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 transition-all duration-300 cursor-pointer"
                  title="Copy Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setQuickViewOpen(true)}
                  className="p-2.5 rounded-full border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 transition-all duration-300 cursor-pointer"
                  title="Quick View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              <Link href={`/properties/${property.slug}`}>
                <Button variant="outline" className="text-[9px] py-2.5 px-6 border-luxury-border/50 hover:border-luxury-gold">
                  Explore Details
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {quickViewOpen && (
          <PropertyQuickView property={property} onClose={() => setQuickViewOpen(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <Card className="p-0 flex flex-col group h-full border-luxury-border/30 hover:border-luxury-gold/30 hover:-translate-y-1 hover:shadow-luxury-gold/[0.02] transition-all duration-500">
        {/* Image Container with Zoom */}
        <div className="relative aspect-[4/3] overflow-hidden shrink-0">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-luxury-charcoal flex items-center justify-center text-gray-600 text-xs">
              No Image Available
            </div>
          )}

          {/* Tag Overlays */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Badge variant={statusVariant}>{property.status === "buy" ? "For Sale" : property.status === "rent" ? "For Rent" : "Off Plan"}</Badge>
            {property.isFeatured && (
              <Badge variant="gold" className="flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>Featured</span>
              </Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavourite(property.id);
            }}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full glassmorphism text-white hover:text-luxury-gold hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <Heart className={cn("w-4 h-4", isFav && "fill-luxury-gold text-luxury-gold")} />
          </button>

          {/* Price Tag Overlay (Glassmorphism) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 glassmorphism px-4 py-2.5 rounded-lg flex justify-between items-center">
            <span className="text-[9px] uppercase text-gray-300 tracking-wider font-sans font-semibold">Price</span>
            <span className="text-sm font-serif text-luxury-gold font-bold">
              {formatAED(property.price)}
            </span>
          </div>
        </div>

        {/* Details Container */}
        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Location link */}
            <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
              <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-base text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
              {property.title}
            </h3>

            {/* Description */}
            <p className="text-[11px] text-gray-400 font-light line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Property Specs (Glassmorphism style separators) */}
          <div className="grid grid-cols-3 border-t border-luxury-border/20 pt-4 text-gray-400 text-center gap-1">
            <div className="flex flex-col items-center border-r border-luxury-border/15 py-1">
              <BedDouble className="w-4 h-4 text-luxury-gold shrink-0 mb-1" />
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Beds</span>
              <span className="text-xs text-white font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center border-r border-luxury-border/15 py-1">
              <Bath className="w-4 h-4 text-luxury-gold shrink-0 mb-1" />
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Baths</span>
              <span className="text-xs text-white font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center py-1">
              <Square className="w-4 h-4 text-luxury-gold shrink-0 mb-1" />
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Sq Ft</span>
              <span className="text-xs text-white font-medium">{property.areaSqft.toLocaleString()}</span>
            </div>
          </div>

          {/* View Details Link */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-lg border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 transition-all duration-300 cursor-pointer"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setQuickViewOpen(true)}
              className="p-2.5 rounded-lg border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 transition-all duration-300 cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <Link href={`/properties/${property.slug}`} className="flex-grow">
              <Button variant="outline" className="text-[9px] py-2.5 w-full border-luxury-border/50 hover:border-luxury-gold">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {quickViewOpen && (
        <PropertyQuickView property={property} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
