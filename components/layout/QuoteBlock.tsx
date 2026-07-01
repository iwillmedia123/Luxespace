import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuoteBlockProps {
  quote: string;
  author?: string;
  title?: string; // e.g. "Founder, Luxury Group"
  className?: string;
}

export default function QuoteBlock({
  quote,
  author,
  title,
  className,
}: QuoteBlockProps) {
  return (
    <div
      className={cn(
        "relative w-full py-20 px-6 sm:px-12 lg:px-24 bg-luxury-dark/30 border border-luxury-border/20 rounded-2xl flex flex-col items-center text-center overflow-hidden",
        className
      )}
    >
      {/* Decortive quote watermark */}
      <div className="absolute top-10 left-10 text-luxury-gold/[0.03] pointer-events-none select-none">
        <Quote className="w-32 h-32 rotate-180" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Quote body text */}
        <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-gray-200 leading-relaxed font-light italic">
          &ldquo;{quote}&rdquo;
        </p>

        {/* Quote author citation metadata */}
        {(author || title) && (
          <div className="flex flex-col items-center">
            {/* Fine divider */}
            <div className="w-8 border-t border-luxury-gold/50 mb-4" />
            
            {author && (
              <cite className="not-italic font-serif text-sm text-white font-medium block">
                {author}
              </cite>
            )}
            {title && (
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold block mt-1">
                {title}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
