"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  Square,
  Car,
  MapPin,
  MessageCircle,
  Phone,
  Heart,
  Share2,
  Download,
  Printer,
  ChevronRight,
  Calendar,
  Building
} from "lucide-react";
import { Property } from "@/types";
import { formatAED, cn, getPropertyTypeLabel, getCompletionLabel, getStatusLabel } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PropertyEnquiryForm from "@/components/properties/PropertyEnquiryForm";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import { useFavourites } from "@/components/properties/FavouritesProvider";
import { useRecentlyViewed } from "@/components/properties/RecentlyViewedProvider";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting performance
const PropertyGallery = dynamic(() => import("@/components/properties/PropertyGallery"), { ssr: false });
const PropertyMap = dynamic(() => import("@/components/properties/PropertyMap"), { ssr: false });
const MortgageCalculator = dynamic(() => import("@/components/properties/MortgageCalculator"), { ssr: false });

interface PropertyDetailClientProps {
  property: Property;
  relatedProperties: Property[];
}

export default function PropertyDetailClient({ property, relatedProperties }: PropertyDetailClientProps) {
  // Gallery lightbox
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const { isFavourite, toggleFavourite } = useFavourites();
  const { addViewed, recentlyViewed } = useRecentlyViewed();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (property) {
      addViewed(property);
    }
  }, [property, addViewed]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isFav = isFavourite(property.id);
  const statusVariant =
    property.status === "buy" ? "status-buy" :
    property.status === "rent" ? "status-rent" : "status-offplan";

  return (
    <div className="bg-luxury-charcoal min-h-screen text-white pt-24 sm:pt-32 pb-24 print:pt-0">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 print:hidden">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/properties" className="hover:text-white transition-colors">Portfolio</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-luxury-gold truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      {/* Hero Gallery Grid layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[350px] sm:h-[500px]">
          {/* Main Cover (left) */}
          <div
            onClick={() => {
              setGalleryStartIndex(0);
              setGalleryOpen(true);
            }}
            className="md:col-span-2 relative h-full rounded-2xl overflow-hidden cursor-pointer group border border-luxury-border/30 shrink-0"
          >
            <Image
              src={property.images[0] || "/assets/apartment_render.png"}
              alt={property.title}
              fill
              priority
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* View Gallery Overlay */}
            <div className="absolute bottom-6 right-6 bg-black/60 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-2">
              <span>View all {property.images.length} photos</span>
            </div>

            {/* Badges */}
            <div className="absolute top-6 left-6 z-10 flex gap-2">
              <Badge variant={statusVariant}>{getStatusLabel(property.status)}</Badge>
              {property.isFeatured && <Badge variant="gold">Featured</Badge>}
            </div>
          </div>

          {/* Side Grid Thumbnails (right, desktop only) */}
          <div className="hidden md:flex flex-col gap-4 h-full">
            {property.images.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setGalleryStartIndex(idx + 1);
                  setGalleryOpen(true);
                }}
                className="relative flex-grow h-1/2 rounded-2xl overflow-hidden cursor-pointer group border border-luxury-border/30"
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            ))}
            {property.images.length > 3 ? (
              <div
                onClick={() => {
                  setGalleryStartIndex(3);
                  setGalleryOpen(true);
                }}
                className="relative flex-grow h-1/2 rounded-2xl overflow-hidden cursor-pointer group border border-luxury-border/30 bg-black"
              >
                <Image
                  src={property.images[3]}
                  alt="Thumbnail 3"
                  fill
                  className="object-cover opacity-45 transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl text-white font-bold">+{property.images.length - 3} More</span>
                </div>
              </div>
            ) : (
              <div className="relative flex-grow h-1/2 rounded-2xl overflow-hidden border border-luxury-border/30 bg-luxury-dark/40 flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Luxespace Private</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main details body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Details, map, specs) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price Header */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                    <span>{property.location}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-4xl text-white leading-tight">
                    {property.title}
                  </h1>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Dossier Valuation</span>
                  <span className="text-3xl font-serif text-luxury-gold font-bold block">
                    {formatAED(property.price)}
                  </span>
                  {property.status === "rent" && <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block">per annum</span>}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between border-t border-luxury-border/20 pt-4 gap-4 print:hidden">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavourite(property.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-xs font-semibold text-gray-400 transition-all cursor-pointer bg-transparent"
                  >
                    <Heart className={cn("w-4 h-4", isFav && "fill-luxury-gold text-luxury-gold")} />
                    <span>{isFav ? "Saved" : "Save Listing"}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-xs font-semibold text-gray-400 transition-all cursor-pointer bg-transparent"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copied ? "Copied!" : "Share Link"}</span>
                  </button>
                  {property.propertyPlanUrl && (
                    <a
                      href={property.propertyPlanUrl}
                      download={
                        property.propertyPlanUrl.startsWith("data:")
                          ? `property_plan_${property.slug}${
                              property.propertyPlanUrl.includes("application/pdf")
                                ? ".pdf"
                                : ".png"
                            }`
                          : `property_plan_${property.slug}`
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/5 text-xs font-semibold transition-all cursor-pointer bg-transparent shadow-lg"
                    >
                      <Download className="w-4 h-4 text-luxury-gold" />
                      <span>Download Property Plan</span>
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-gray-400 transition-all cursor-pointer bg-transparent"
                    title="Print Brochure"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Bedrooms", val: property.bedrooms, icon: BedDouble },
                { label: "Bathrooms", val: property.bathrooms, icon: Bath },
                { label: "Valuation Area", val: `${property.areaSqft.toLocaleString()} Sqft`, icon: Square },
                { label: "Parking Bays", val: property.parking || 0, icon: Car },
                { label: "Residence Type", val: getPropertyTypeLabel(property.type), icon: Building },
                { label: "Status Mode", val: getCompletionLabel(property.completionStatus), icon: Calendar },
              ].map((spec, idx) => {
                const Icon = spec.icon;
                return (
                  <div key={idx} className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 text-center space-y-1">
                    <Icon className="w-4 h-4 text-luxury-gold mx-auto mb-1" />
                    <span className="text-[8px] uppercase tracking-widest text-gray-500 block">{spec.label}</span>
                    <span className="text-xs text-white font-semibold block truncate">{spec.val}</span>
                  </div>
                );
              })}
            </div>

            {/* About / Description */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-lg text-white border-b border-luxury-border/20 pb-3">Editorial Overview</h3>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
              {property.handoverDate && (
                <div className="flex items-center gap-2 pt-2 text-xs">
                  <span className="text-gray-500 font-light">Target Handover Date:</span>
                  <span className="text-luxury-gold font-semibold uppercase tracking-wider">{property.handoverDate}</span>
                </div>
              )}
            </div>

            {/* Amenities Grid */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-lg text-white border-b border-luxury-border/20 pb-3">Dossier Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((am, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Neighborhood */}
            {(() => {
              const lat = property.latitude || (property.community?.coordinates as any)?.lat || 25.1124;
              const lng = property.longitude || (property.community?.coordinates as any)?.lng || 55.1390;
              const mapLocationText = (property.community?.coordinates as any)?.locationText || property.location || property.community?.name || "Dubai, UAE";
              
              return (
                <PropertyMap
                  latitude={lat}
                  longitude={lng}
                  title={property.title}
                  location={mapLocationText}
                  concentricDistances={(property.community?.coordinates as any)?.concentricDistances}
                />
              );
            })()}

            {/* Mortgage Calculator */}
            <MortgageCalculator propertyPrice={property.price} />
          </div>

          {/* Right Column (Agent contact, Community cards) */}
          <div className="space-y-8 sticky top-28 print:hidden">
            {/* Agent / Contact Panel */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                {property.agent?.avatarUrl ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-luxury-border/30 bg-luxury-charcoal">
                    <Image src={property.agent.avatarUrl} alt={property.agent.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold font-serif text-xl font-bold">
                    {property.agent?.name?.charAt(0) || "L"}
                  </div>
                )}
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold">Assigned Advisor</span>
                  <h4 className="font-serif text-base text-white mt-0.5">{property.agent?.name || "Luxespace Director"}</h4>
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">{property.agent?.title || "Advisory Partner"}</p>
                </div>
              </div>

              {/* CRM Enquiry Form Wrapper */}
              <PropertyEnquiryForm propertyId={property.id} propertyTitle={property.title} />

              {/* Direct Channels */}
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/${property.agent?.whatsapp || "9745334644"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-white hover:text-black py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Consultant</span>
                </a>
                <a
                  href={`tel:${property.agent?.phone || "9745334644"}`}
                  className="flex items-center justify-center gap-2 bg-luxury-charcoal border border-luxury-border/40 hover:border-white py-3 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Direct Advisory Call</span>
                </a>
              </div>
            </div>

            {/* Developer & Community mini cards */}
            {(property.developer || property.community) && (
              <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 space-y-6">
                {property.developer && (
                  <div className="space-y-2 border-b border-luxury-border/15 pb-4">
                    <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block">Developer</span>
                    <h5 className="font-serif text-sm text-white">{property.developer.name}</h5>
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                      Founded in {property.developer.foundedYear || 1997}, providing high-end estates in Dubai.
                    </p>
                  </div>
                )}
                {property.community && (
                  <div className="space-y-2">
                    <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block">Community District</span>
                    <h5 className="font-serif text-sm text-white">{property.community.name}</h5>
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                      {property.community.description}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-6 print:hidden">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Similar Portfolios</span>
            <h3 className="font-serif text-2xl text-white mt-0.5">Recommended Residences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.slice(0, 3).map((prop) => (
              <PropertyCardLuxury key={prop.id} property={prop} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Carousel */}
      {recentlyViewed.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-6 print:hidden">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">History</span>
            <h3 className="font-serif text-2xl text-white mt-0.5">Recently Viewed</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {recentlyViewed
              .filter((p) => p.id !== property.id)
              .slice(0, 4)
              .map((prop) => (
                <PropertyCardLuxury key={prop.id} property={prop} />
              ))}
          </div>
        </section>
      )}

      {/* Fullscreen Lightbox Gallery */}
      <PropertyGallery
        images={property.images}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
}
