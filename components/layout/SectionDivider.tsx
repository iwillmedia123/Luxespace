import { cn } from "@/lib/utils";

export interface SectionDividerProps {
  className?: string;
  withDot?: boolean;
}

export default function SectionDivider({
  className,
  withDot = true,
}: SectionDividerProps) {
  return (
    <div className={cn("relative w-full py-12 flex items-center justify-center", className)}>
      {/* Left/Right Horizontal Line */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-luxury-border/30" />
      </div>
      
      {/* Decorative Center Dot */}
      {withDot && (
        <div className="relative w-1.5 h-1.5 rounded-full bg-luxury-gold ring-4 ring-luxury-charcoal" />
      )}
    </div>
  );
}
