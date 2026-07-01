import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

const COUNTRY_CODES = [
  { code: "+971", country: "AE" }, // UAE default
  { code: "+974", country: "QA" }, // Qatar
  { code: "+44", country: "UK" },
  { code: "+1", country: "US" },
  { code: "+33", country: "FR" },
  { code: "+7", country: "RU" },
  { code: "+91", country: "IN" },
  { code: "+966", country: "SA" },
  { code: "+49", country: "DE" },
];

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, countryCode = "+971", onCountryCodeChange, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
            {label}
          </label>
        )}
        <div className="flex rounded-lg overflow-hidden border border-luxury-border/60 bg-luxury-dark/50 focus-within:border-luxury-gold focus-within:ring-1 focus-within:ring-luxury-gold/30 transition-all duration-300">
          {/* Prefix Code Selector */}
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange?.(e.target.value)}
            className="bg-luxury-dark border-r border-luxury-border/60 text-white text-sm px-3 py-2.5 focus:outline-none cursor-pointer appearance-none text-center min-w-[70px]"
          >
            {COUNTRY_CODES.map((item) => (
              <option key={item.code} value={item.code} className="bg-luxury-dark text-white">
                {item.code} ({item.country})
              </option>
            ))}
          </select>
          
          {/* Phone Number text input */}
          <input
            type="tel"
            ref={ref}
            className={cn(
              "w-full bg-transparent text-white px-4 py-2.5 text-sm focus:outline-none placeholder-gray-600 disabled:opacity-50",
              className
            )}
            placeholder="50 123 4567"
            {...props}
          />
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
