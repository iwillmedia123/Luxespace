import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Developer } from "@/types";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface DeveloperCardProps {
  developer: Developer;
  projectsCount?: number;
  className?: string;
}

export default function DeveloperCard({
  developer,
  projectsCount = 0,
  className,
}: DeveloperCardProps) {
  return (
    <Card className={cn("flex flex-col justify-between h-full bg-luxury-dark border-luxury-border/30 p-8", className)}>
      <div className="space-y-6">
        {/* Developer Logo Container */}
        <div className="relative h-12 w-32 overflow-hidden bg-luxury-charcoal/50 border border-luxury-border/30 rounded flex items-center justify-center p-2">
          {developer.logoUrl ? (
            <Image
              src={developer.logoUrl}
              alt={developer.name}
              fill
              className="object-contain p-1"
            />
          ) : (
            <span className="font-serif text-xs text-luxury-gold tracking-widest uppercase">
              {developer.name}
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-white group-hover:text-luxury-gold transition-colors duration-300">
            {developer.name}
          </h3>
          {developer.description && (
            <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
              {developer.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-luxury-border/20 pt-6 mt-8 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
          {projectsCount} Registered Projects
        </span>
        <Link
          href={`/developers/${developer.slug}`}
          className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors duration-300 group"
        >
          <span>View Catalog</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
