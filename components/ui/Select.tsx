import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 relative">
        {label && (
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full bg-luxury-dark/50 border border-luxury-border/60 text-white rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-luxury-dark text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron Indicator */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
