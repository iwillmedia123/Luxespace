import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export default function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <Card className={cn("relative flex flex-col justify-between h-full bg-luxury-dark border-luxury-border/30 p-8", className)}>
      {/* Decorative Quote Icon */}
      <div className="absolute top-6 right-8 text-luxury-gold/10">
        <Quote className="w-12 h-12 rotate-180" />
      </div>

      <div className="space-y-6 relative z-10">
        {/* Rating Stars */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < testimonial.rating
                  ? "fill-luxury-gold text-luxury-gold"
                  : "text-luxury-border/50"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <blockquote className="font-serif text-base text-gray-200 italic leading-relaxed font-light">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>
      </div>

      {/* Client Profile Footer */}
      <div className="flex items-center gap-4 mt-8 pt-6 border-t border-luxury-border/20 relative z-10">
        {testimonial.avatarUrl ? (
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-luxury-gold/20 shrink-0">
            <Image
              src={testimonial.avatarUrl}
              alt={testimonial.clientName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-luxury-charcoal border border-luxury-border/30 flex items-center justify-center shrink-0 text-luxury-gold font-bold text-xs uppercase">
            {testimonial.clientName.charAt(0)}
          </div>
        )}

        <div className="flex flex-col">
          <cite className="not-italic text-xs font-semibold text-white">
            {testimonial.clientName}
          </cite>
          {testimonial.clientTitle && (
            <span className="text-[10px] text-luxury-gold font-medium uppercase tracking-wider mt-0.5">
              {testimonial.clientTitle}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
