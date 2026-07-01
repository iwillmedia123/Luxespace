import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageGalleryCardProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ImageGalleryCard({
  src,
  alt,
  title,
  subtitle,
  className,
}: ImageGalleryCardProps) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-xl border border-luxury-border/30 cursor-pointer shadow-lg hover:border-luxury-gold/30 hover:shadow-2xl transition-all duration-700 ease-out",
        className
      )}
    >
      {/* Zoom Image */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />

      {/* Luxury Color overlay */}
      <div className="absolute inset-0 bg-luxury-charcoal/20 group-hover:bg-luxury-charcoal/40 transition-colors duration-500 z-10" />

      {/* Plus Trigger Icon (Aman style minimal indicator) */}
      <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-luxury-dark/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-luxury-gold group-hover:border-luxury-gold/40 transition-all duration-300">
        <Plus className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" />
      </div>

      {/* Floating Info Overlay (Revealed on hover) */}
      {(title || subtitle) && (
        <div className="absolute bottom-4 left-4 right-4 z-20 glassmorphism p-4 rounded-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          {subtitle && (
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold block mb-0.5">
              {subtitle}
            </span>
          )}
          {title && (
            <h4 className="font-serif text-sm text-white font-medium line-clamp-1">
              {title}
            </h4>
          )}
        </div>
      )}
    </div>
  );
}
