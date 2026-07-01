import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Community } from "@/types";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface CommunityCardProps {
  community: Community;
  propertiesCount?: number;
  className?: string;
}

export default function CommunityCard({
  community,
  propertiesCount = 0,
  className,
}: CommunityCardProps) {
  return (
    <Card className={cn("p-0 group relative aspect-[3/4] flex flex-col justify-end overflow-hidden", className)}>
      {/* Background Image */}
      {community.bannerUrl ? (
        <Image
          src={community.bannerUrl}
          alt={community.name}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-luxury-charcoal" />
      )}

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent z-10 opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

      {/* Content overlay */}
      <div className="relative z-20 p-6 space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold">
            Prime Location
          </span>
          <h3 className="font-serif text-2xl text-white">
            {community.name}
          </h3>
        </div>

        {community.description && (
          <p className="text-xs text-gray-400 font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {community.description}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between text-white border-t border-white/10 mt-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-400">
            {propertiesCount} Exclusive Listings
          </span>
          <Link
            href={`/communities/${community.slug}`}
            className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-luxury-gold font-semibold hover:text-white transition-colors duration-300"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
