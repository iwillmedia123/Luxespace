import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center space-x-2.5">
        <li>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-luxury-gold transition-colors duration-300 font-sans"
          >
            Home
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2.5">
              <ChevronRight className="w-3 h-3 text-luxury-border/60 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-semibold font-sans">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-luxury-gold transition-colors duration-300 font-sans"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
