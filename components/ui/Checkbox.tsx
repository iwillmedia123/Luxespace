import { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className={cn("space-y-1", className)}>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only peer"
              {...props}
            />
            {/* Styled Checkbox box */}
            <div className={cn(
              "w-4 h-4 rounded border border-luxury-border/80 bg-luxury-dark/50 flex items-center justify-center transition-all duration-300 peer-checked:bg-luxury-gold peer-checked:border-luxury-gold peer-focus-visible:ring-1 peer-focus-visible:ring-luxury-gold",
              error && "border-red-500"
            )}>
              <Check className="w-2.5 h-2.5 text-luxury-charcoal opacity-0 transition-opacity duration-200 peer-checked:opacity-100 font-bold" />
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
