import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "outline" | "glass" | "status-buy" | "status-rent" | "status-offplan";
}

export default function Badge({
  className,
  variant = "gold",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-sans uppercase tracking-widest font-semibold transition-all duration-300",
        
        // Variants
        variant === "gold" && "bg-luxury-gold text-luxury-charcoal",
        variant === "outline" && "border border-luxury-border/80 text-gray-300 bg-transparent",
        variant === "glass" && "glassmorphism-light text-white border border-white/5",
        
        // Real Estate Status specific styles
        variant === "status-buy" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        variant === "status-rent" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        variant === "status-offplan" && "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20",
        
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
