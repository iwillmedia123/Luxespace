import { cn } from "@/lib/utils";
import Typography from "@/components/ui/Typography";

export interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3 max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "right" && "ml-auto text-right",
        className
      )}
    >
      {subtitle && (
        <Typography variant="subheading" className="block">
          {subtitle}
        </Typography>
      )}
      <Typography variant="section" className="block">
        {title}
      </Typography>
      {description && (
        <Typography variant="body" className="block text-gray-400 mt-2 max-w-2xl mx-auto">
          {description}
        </Typography>
      )}
    </div>
  );
}
