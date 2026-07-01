"use client";

import { MapPin, ExternalLink, Navigation, Train, School, Sparkles, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  location: string;
}

export default function PropertyMap({ latitude, longitude, title, location }: PropertyMapProps) {
  const gmapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const nearbyItems = [
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
        {/* Map Stage container */}
        <div className="md:col-span-2 relative aspect-[16/10] sm:aspect-auto sm:h-72 rounded-2xl overflow-hidden border border-luxury-border/20 bg-luxury-charcoal flex items-center justify-center">
          {/* Custom Dark Grid Pattern simulation representing map */}
          <div className="absolute inset-0 bg-[radial-gradient(#333945_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          
          <div className="text-center space-y-3 z-10 p-4">
            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mx-auto animate-bounce">
              <MapPin className="w-6 h-6 text-luxury-gold" />
            </div>
            <div>
              <span className="text-xs text-white font-medium block">{title}</span>
              <span className="text-[10px] text-gray-500 font-light block mt-0.5">{location}</span>
            </div>
            <div className="text-[9px] text-gray-500 font-mono tracking-wider">
              LAT: {latitude.toFixed(4)} • LNG: {longitude.toFixed(4)}
            </div>
          </div>

          {/* Map Compass overlay */}
          <div className="absolute bottom-4 right-4 bg-luxury-dark/80 px-2.5 py-1.5 rounded-lg border border-luxury-border/30 text-[9px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-luxury-gold rotate-45" />
            <span>Dubai Coast</span>
          </div>
        </div>

        {/* Nearby checklist */}
        <div className="space-y-4">
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">Concentric Distances</span>
          <div className="space-y-3">
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
