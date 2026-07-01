import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-luxury-dark border border-luxury-border/30 rounded-xl overflow-hidden p-6",
          hoverEffect && "hover:border-luxury-gold/30 hover:shadow-xl hover:shadow-luxury-gold/[0.02] transition-all duration-500 ease-out",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
