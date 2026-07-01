"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, FileText, Star } from "lucide-react";
import { db } from "@/lib/db";
import { DownloadItem } from "@/types";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<"all" | "report" | "guide" | "brochure" | "floorplan">("all");

  useEffect(() => {
    async function loadDownloads() {
      try {
        setLoading(true);
        const list = await db.getDownloads();
        setDownloads(list);
      } catch (err) {
        console.error("Error loading downloads:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDownloads();
  }, []);

  const typesList = [
    { id: "all", label: "All Documents" },
    { id: "report", label: "Market Reports" },
    { id: "guide", label: "Investment Guides" },
    { id: "brochure", label: "Developer Brochures" },
    { id: "floorplan", label: "Floor Plans" }
  ];

  const filteredDownloads = downloads.filter((dl) => {
    if (activeType === "all") return true;
    return dl.type === activeType;
  });

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">Downloads</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Document Archives</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Resource & Document Downloads</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Access verified floor plan sets, golden visa checklists, tax structuring guidelines, and luxury market analysis reports compiled by our research team.
          </p>
        </div>

        {/* Type tabs */}
        <div className="flex gap-3 border-b border-luxury-border/10 mb-8 pb-3 select-none overflow-x-auto scrollbar-thin">
          {typesList.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as "all" | "report" | "guide" | "brochure" | "floorplan")}
              className={`text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg border transition-all shrink-0 cursor-pointer ${
                activeType === type.id
                  ? "bg-luxury-gold/5 border-luxury-gold text-luxury-gold"
                  : "border-luxury-border/30 text-gray-400 hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-28 bg-luxury-dark/40 border border-luxury-border/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredDownloads.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No downloadable publications registered for this section.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDownloads.map((dl) => (
              <div
                key={dl.id}
                className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 flex items-center justify-between gap-6 group shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center p-1.5 shrink-0">
                    <FileText className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                        {dl.title}
                      </h4>
                      {dl.isFeatured && (
                        <span className="text-[7px] bg-luxury-gold/15 text-luxury-gold px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase font-bold tracking-widest border border-luxury-gold/30 shrink-0">
                          <Star className="w-2 h-2 fill-luxury-gold" />
                          <span>Key File</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[8px] text-gray-500 uppercase tracking-widest font-semibold">
                      <span>{dl.type}</span>
                      <span>•</span>
                      <span>Size: {dl.fileSize || "1.5 MB"}</span>
                    </div>
                  </div>
                </div>

                {/* Download trigger */}
                <a
                  href={dl.fileUrl}
                  download
                  className="w-10 h-10 rounded-xl bg-[#1f232c] border border-luxury-border/40 hover:border-luxury-gold text-gray-400 hover:text-luxury-gold flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-lg group-hover:scale-105"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
