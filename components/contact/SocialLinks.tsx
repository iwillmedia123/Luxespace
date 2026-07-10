import React from "react";
import { MessageSquare, ExternalLink } from "lucide-react";
import Typography from "@/components/ui/Typography";

export default function SocialLinks() {
  const socials = [
    {
      name: "WhatsApp",
      handle: "+971 50 134 8020",
      icon: (props: { className?: string }) => (
        <MessageSquare {...props} />
      ),
      url: "https://wa.me/971501348020",
    },
    {
      name: "Instagram",
      handle: "@luxespace.properties",
      icon: (props: { className?: string }) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      url: "https://instagram.com/luxespace.properties",
    },
    {
      name: "Facebook",
      handle: "Luxespace Properties",
      icon: (props: { className?: string }) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      url: "https://facebook.com/luxespace.properties",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block">Social Media</span>
        <Typography variant="section" className="font-serif text-3xl text-white">
          Connect With Us
        </Typography>
      </div>

      <div className="w-12 h-[1px] bg-luxury-gold/30 mx-auto" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {socials.map((soc, idx) => {
          const Icon = soc.icon;
          return (
            <a
              key={idx}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-luxury-dark/40 border border-luxury-border/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-luxury-gold/30 hover:bg-luxury-dark/70 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">{soc.name}</span>
                <span className="text-sm text-gray-300 font-light block flex items-center justify-center gap-1">
                  <span>{soc.handle}</span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-luxury-gold transition-colors duration-300" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
