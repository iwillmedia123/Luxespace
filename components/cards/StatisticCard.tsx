import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface StatisticCardProps {
  number: string;
  label: string;
  description?: string;
  className?: string;
}

export default function StatisticCard({
  number,
  label,
  description,
  className,
}: StatisticCardProps) {
  return (
    <Card
      hoverEffect={false}
      className={cn(
        "bg-luxury-dark/40 border border-luxury-border/20 p-8 flex flex-col justify-center text-center relative overflow-hidden group hover:border-luxury-gold/20 transition-colors duration-500",
        className
      )}
    >
      {/* Background radial gold glow on hover */}
      <div className="absolute inset-0 bg-radial from-luxury-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="space-y-2 relative z-10">
        {/* Metric Number */}
        <span className="font-serif text-5xl sm:text-6xl text-luxury-gold tracking-tight block transition-transform duration-500 group-hover:scale-105">
          {number}
        </span>
        
        {/* Label */}
        <span className="text-[10px] uppercase tracking-widest text-white font-semibold block">
          {label}
        </span>

        {/* Optional Description */}
        {description && (
          <p className="text-xs text-gray-500 font-light mt-2 max-w-xs mx-auto">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
