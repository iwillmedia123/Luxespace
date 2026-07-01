import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "gold-outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center rounded-full font-sans text-xs uppercase tracking-widest font-semibold transition-all duration-500 ease-out focus:outline-none focus:ring-1 focus:ring-luxury-gold focus:ring-offset-1 focus:ring-offset-luxury-charcoal disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.96] group cursor-pointer",
          
          // Variants
          variant === "primary" && "bg-luxury-gold text-luxury-charcoal hover:bg-white hover:shadow-luxury-gold hover:-translate-y-0.5 shadow-lg shadow-luxury-gold/5",
          variant === "secondary" && "bg-luxury-dark text-white border border-luxury-border/60 hover:border-luxury-gold hover:text-luxury-gold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25",
          variant === "outline" && "bg-transparent text-white border border-white/20 hover:border-luxury-gold hover:text-luxury-gold hover:-translate-y-0.5",
          variant === "gold-outline" && "bg-transparent text-luxury-gold border border-luxury-gold/40 hover:bg-luxury-gold/5 hover:border-luxury-gold hover:text-luxury-gold hover:-translate-y-0.5",
          variant === "ghost" && "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-500 hover:-translate-y-0.5",
          
          // Sizes
          size === "sm" && "px-5 py-2.5 text-[10px]",
          size === "md" && "px-7 py-3.5",
          size === "lg" && "px-9 py-4.5 text-sm",
          
          className
        )}
        {...props}
      >
        {/* Shine Sweep Overlay for Primary and Danger buttons */}
        {(variant === "primary" || variant === "danger") && !disabled && !isLoading && (
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine z-0" />
        )}
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <svg
              className="animate-spin h-3.5 w-3.5 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : null}
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

