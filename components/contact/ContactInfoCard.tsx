import React from "react";
import Typography from "@/components/ui/Typography";

interface ContactInfoCardProps {
  title: string;
  values: string[];
  icon: React.ComponentType<{ className?: string }>;
  hrefs?: string[];
}

export default function ContactInfoCard({ title, values, icon: Icon, hrefs }: ContactInfoCardProps) {
  return (
    <div className="bg-luxury-dark/50 border border-luxury-border/30 rounded-2xl p-8 space-y-6 hover:border-luxury-gold/30 hover:bg-luxury-dark/80 transition-all duration-300 h-full flex flex-col items-center sm:items-start text-center sm:text-left">
      <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="space-y-3 flex-grow flex flex-col justify-start w-full">
        <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
          {title}
        </Typography>
        
        <div className="space-y-1.5 mt-auto">
          {values.map((val, idx) => {
            const hasLink = hrefs && hrefs[idx];
            return (
              <div key={idx} className="text-xs text-gray-400 font-light leading-relaxed">
                {hasLink ? (
                  <a
                    href={hrefs[idx]}
                    target={hrefs[idx].startsWith("http") ? "_blank" : undefined}
                    rel={hrefs[idx].startsWith("http") ? "noopener noreferrer" : undefined}
                    className="hover:text-luxury-gold transition-colors duration-300"
                  >
                    {val}
                  </a>
                ) : (
                  <span>{val}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
