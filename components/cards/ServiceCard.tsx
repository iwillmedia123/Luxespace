import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface ServiceCardProps {
  index: string; // e.g. "01", "02"
  title: string;
  description: string;
  href?: string;
  className?: string;
}

export default function ServiceCard({
  index,
  title,
  description,
  href = "/services",
  className,
}: ServiceCardProps) {
  return (
    <Card className={cn("group flex flex-col justify-between h-full bg-luxury-dark border-luxury-border/30 p-8 hover:border-luxury-gold/30 hover:-translate-y-1 duration-500", className)}>
      <div className="space-y-6">
        {/* Step Index Number */}
        <span className="font-serif text-3xl text-luxury-gold/30 group-hover:text-luxury-gold transition-colors duration-500 block">
          {index}
        </span>

        {/* Texts */}
        <div className="space-y-2">
          <h3 className="font-serif text-2xl text-white group-hover:text-luxury-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Action link */}
      <div className="pt-6 border-t border-luxury-border/20 mt-8">
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors duration-300"
        >
          <span>Learn More</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
