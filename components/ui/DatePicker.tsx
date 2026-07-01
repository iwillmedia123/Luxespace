import { InputHTMLAttributes, forwardRef } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 relative">
        {label && (
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type="date"
            ref={ref}
            className={cn(
              "w-full bg-luxury-dark/50 border border-luxury-border/60 text-white rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer scheme-dark",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/30",
              className
            )}
            {...props}
          />
          {/* Custom Calendar Icon */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <Calendar className="w-4 h-4 text-luxury-gold" />
          </div>
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
