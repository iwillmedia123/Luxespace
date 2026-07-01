import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Square, MapPin } from "lucide-react";
import { Property } from "@/types";
import { formatAED, cn } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const statusVariant = 
    property.status === "buy" ? "status-buy" :
    property.status === "rent" ? "status-rent" : "status-offplan";

  return (
    <Card className={cn("p-0 flex flex-col group h-full", className)}>
      {/* Image Container with Zoom */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-luxury-charcoal flex items-center justify-center text-gray-600 text-xs">
            No Image Available
          </div>
        )}

        {/* Status Tag Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant={statusVariant}>{property.status}</Badge>
        </div>

        {/* Price Tag Overlay (Glassmorphism) */}
        <div className="absolute bottom-4 left-4 right-4 z-10 glassmorphism px-4 py-2 rounded-lg flex justify-between items-center">
          <span className="text-[10px] uppercase text-gray-300 tracking-wider font-sans font-semibold">Investment</span>
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
            <span>{property.location}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
            {property.title}
          </h3>
        </div>

        {/* Property Specs (Glassmorphism style separators) */}
        <div className="grid grid-cols-3 border-t border-luxury-border/30 pt-4 text-gray-400">
          <div className="flex flex-col items-center border-r border-luxury-border/20 py-1">
            <BedDouble className="w-4 h-4 text-luxury-gold shrink-0 mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Beds</span>
            <span className="text-xs text-white font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center border-r border-luxury-border/20 py-1">
            <Bath className="w-4 h-4 text-luxury-gold shrink-0 mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Baths</span>
            <span className="text-xs text-white font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center py-1">
            <Square className="w-4 h-4 text-luxury-gold shrink-0 mb-1" />
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Sq Ft</span>
            <span className="text-xs text-white font-medium">{property.areaSqft}</span>
          </div>
        </div>

        {/* View Details Link */}
        <div className="pt-2 text-center">
          <Link
            href={`/properties/${property.slug}`}
            className="inline-block text-[9px] uppercase tracking-widest text-gray-400 group-hover:text-luxury-gold font-bold transition-colors duration-300 w-full py-2.5 rounded-lg border border-luxury-border/40 group-hover:border-luxury-gold/50"
          >
            Request Private Viewing
          </Link>
        </div>
      </div>
    </Card>
  );
}
