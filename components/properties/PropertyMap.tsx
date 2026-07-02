"use client";

import { MapPin, ExternalLink, Navigation, Train, School, Sparkles, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
  concentricDistances?: Array<{ name: string; distance: string }>;
}

export default function PropertyMap({ latitude, longitude, title, location, concentricDistances }: PropertyMapProps) {
  const gmapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const nearbyItems = concentricDistances && concentricDistances.length > 0
    ? concentricDistances.map((item) => {
        const nameLower = item.name.toLowerCase();
        let icon = Sparkles;
        if (nameLower.includes("metro") || nameLower.includes("station") || nameLower.includes("train")) {
          icon = Train;
        } else if (nameLower.includes("school") || nameLower.includes("academy") || nameLower.includes("university")) {
          icon = School;
        } else if (nameLower.includes("hospital") || nameLower.includes("clinic") || nameLower.includes("medical")) {
          icon = ShieldCheck;
        }
        return { name: item.name, distance: item.distance, icon };
      })
    : [
        { name: "Nearest Dubai Metro Station", distance: "4 mins drive", icon: Train },
        { name: "Downtown Dubai Mall", distance: "12 mins drive", icon: Sparkles },
        { name: "Emirates International School", distance: "8 mins drive", icon: School },
        { name: "King's College Hospital Dubai", distance: "6 mins drive", icon: ShieldCheck },
      ];

  return (
    <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 shadow-luxury space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Coordinates</span>
          <h3 className="font-serif text-xl text-white mt-0.5">Location & Neighborhood</h3>
        </div>

        <a href={gmapsUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="text-[9px] border-luxury-border/50 hover:border-luxury-gold flex items-center gap-1.5 py-2.5 px-5">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Stage container - Embed actual Google Map */}
        <div className="md:col-span-2 relative aspect-[16/10] sm:aspect-auto sm:h-72 rounded-2xl overflow-hidden border border-luxury-border/20 bg-luxury-charcoal">
          <iframe
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
            className="absolute inset-0 w-full h-full border-0 filter invert-[0.9] hue-rotate-[180deg] contrast-[1.1] opacity-75"
            allowFullScreen
            loading="lazy"
          />
          
          {/* Coordinate Overlay */}
          <div className="absolute bottom-4 left-4 bg-luxury-dark/95 border border-luxury-border/30 px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-wider text-gray-300 pointer-events-none">
            LAT: {latitude.toFixed(4)} • LNG: {longitude.toFixed(4)}
          </div>

          {/* Map Compass overlay */}
          <div className="absolute bottom-4 right-4 bg-luxury-dark/95 px-2.5 py-1.5 rounded-lg border border-luxury-border/30 text-[9px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1.5 pointer-events-none">
            <Navigation className="w-3 h-3 text-luxury-gold rotate-45" />
            <span>Dubai Coast</span>
          </div>
        </div>

        {/* Nearby checklist */}
        <div className="space-y-4">
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">Concentric Distances</span>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {nearbyItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-3 bg-[#1f232c]/50 rounded-xl p-3 border border-luxury-border/10 items-center">
                  <div className="p-2 rounded-lg bg-luxury-charcoal border border-luxury-border/20 text-luxury-gold shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-white block truncate">{item.name}</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block mt-0.5">{item.distance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
