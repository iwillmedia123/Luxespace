import { InputHTMLAttributes, forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onSearchSubmit?: (query: string) => void;
}

const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, placeholder = "Search properties, areas, developers...", onChange, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500">
          <Search className="w-4 h-4 text-luxury-gold" />
        </div>
        
        <input
          type="text"
          ref={ref}
          placeholder={placeholder}
          className={cn(
            "w-full bg-luxury-dark/60 border border-luxury-border/60 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 transition-all duration-300 placeholder-gray-600",
            className
          )}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }
);

SearchField.displayName = "SearchField";

export default SearchField;
