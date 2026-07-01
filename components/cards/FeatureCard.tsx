import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
}: FeatureCardProps) {
  return (
    <Card className={cn("group flex flex-col items-start text-left bg-luxury-dark border-luxury-border/30 p-8 hover:-translate-y-1 duration-500", className)}>
      {/* Icon Frame */}
      <div className="w-12 h-12 rounded-lg bg-luxury-charcoal border border-luxury-gold/20 flex items-center justify-center text-luxury-gold mb-6 transition-colors duration-500 group-hover:bg-luxury-gold group-hover:text-luxury-charcoal">
        <Icon className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
      </div>

      {/* Texts */}
      <div className="space-y-2">
        <h3 className="font-serif text-xl text-white group-hover:text-luxury-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}
