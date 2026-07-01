import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, name, ...props }, ref) => {
    return (
      <div className={cn("space-y-1", className)}>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="radio"
              ref={ref}
              name={name}
              className="sr-only peer"
              {...props}
            />
            {/* Outer ring */}
            <div className={cn(
              "w-4 h-4 rounded-full border border-luxury-border/80 bg-luxury-dark/50 flex items-center justify-center transition-all duration-300 peer-checked:border-luxury-gold peer-focus-visible:ring-1 peer-focus-visible:ring-luxury-gold",
              error && "border-red-500"
            )}>
              {/* Inner dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold scale-0 transition-transform duration-200 peer-checked:scale-100" />
            </div>
          </div>
          {label && (
            <span className="text-xs text-gray-300 font-light leading-none">
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="text-[10px] text-red-500 font-medium pl-7">{error}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
