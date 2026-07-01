import { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

export type TypographyVariant =
  | "hero"
  | "section"
  | "page"
  | "subheading"
  | "body"
  | "caption"
  | "button"
  | "stat"
  | "label"
  | "nav"
  | "footer";

export interface TypographyProps {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

const variantMapping: Record<TypographyVariant, ElementType> = {
  hero: "h1",
  section: "h2",
  page: "h1",
  subheading: "h3",
  body: "p",
  caption: "span",
  button: "span",
  stat: "div",
  label: "span",
  nav: "span",
  footer: "span",
};

export default function Typography({
  variant = "body",
  as,
  children,
  className,
}: TypographyProps) {
  const Component = as || variantMapping[variant];

  return (
    <Component
      className={cn(
        // Base transition
        "transition-colors duration-300",
        
        // Variants configuration
        variant === "hero" && "font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.1] text-white",
        variant === "section" && "font-serif text-3xl sm:text-5xl tracking-wide leading-tight text-white",
        variant === "page" && "font-serif text-4xl sm:text-6xl tracking-wide leading-tight text-white",
        variant === "subheading" && "font-sans text-[10px] sm:text-xs uppercase tracking-widest text-luxury-gold font-semibold",
        variant === "body" && "font-sans text-sm sm:text-base text-gray-300 font-light leading-relaxed",
        variant === "caption" && "font-sans text-xs text-gray-500 font-light",
        variant === "button" && "font-sans text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-luxury-charcoal",
        variant === "stat" && "font-serif text-5xl sm:text-6xl lg:text-7xl text-luxury-gold tracking-tight",
        variant === "label" && "font-sans text-[10px] uppercase tracking-wider text-gray-400 font-semibold",
        variant === "nav" && "font-sans text-[10px] sm:text-xs uppercase tracking-widest font-medium text-gray-300 hover:text-luxury-gold",
        variant === "footer" && "font-sans text-xs text-gray-400 leading-relaxed",
        
        className
      )}
    >
      {children}
    </Component>
  );
}
