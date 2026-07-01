"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Trophy, Medal, Crown, Globe, Heart, ShieldCheck, ArrowRight, Download } from "lucide-react";
import { db } from "@/lib/db";
import { AwardItem } from "@/types";

export default function AwardsPage() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAwards() {
      try {
        setLoading(true);
        const list = await db.getAwards();
        setAwards(list.sort((a, b) => b.year - a.year));
      } catch (err) {
        console.error("Error loading awards:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAwards();
  }, []);

  const getAwardIcon = (iconName?: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="w-6 h-6 text-luxury-gold" />;
      case "Trophy":
        return <Trophy className="w-6 h-6 text-luxury-gold" />;
      case "Medal":
        return <Medal className="w-6 h-6 text-luxury-gold" />;
      case "Crown":
        return <Crown className="w-6 h-6 text-luxury-gold" />;
      case "Globe":
        return <Globe className="w-6 h-6 text-luxury-gold" />;
      default:
        return <Award className="w-6 h-6 text-luxury-gold" />;
    }
  };

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
          <span className="text-luxury-gold">Awards</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Honors & Recognition</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Industry Awards & Achievements</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            A testament to our structural advisory, client discretion, and platinum partnerships with master developers.
          </p>
        </div>

        {/* Timeline Layout */}
        {loading ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-32 bg-luxury-dark/40 border border-luxury-border/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : awards.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No awards registered in database.</p>
        ) : (
          <div className="relative max-w-3xl mx-auto border-l border-luxury-border/30 pl-6 sm:pl-10 space-y-12">
            {awards.map((aw) => (
              <div key={aw.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-luxury-dark border-2 border-luxury-gold flex items-center justify-center p-1 shadow-lg shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                </div>

                <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 hover:border-luxury-gold/30 transition-all duration-300 shadow-xl space-y-4">
                  {/* Title & Icon Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                      {getAwardIcon(aw.icon)}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-luxury-gold font-sans font-bold uppercase tracking-wider">
                        Year {aw.year}
                      </span>
                      <h3 className="font-serif text-sm sm:text-base text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                        {aw.title}
                      </h3>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">{aw.issuer}</p>
                    </div>
                  </div>

                  {/* Description */}
                  {aw.description && (
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      {aw.description}
                    </p>
                  )}

                  {/* PDF download link */}
                  {aw.certificateUrl && (
                    <div className="pt-2">
                      <a
                        href={aw.certificateUrl}
                        download
                        className="inline-flex items-center gap-1.5 text-[9px] text-luxury-gold hover:underline uppercase tracking-widest font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>Download Certificate Verification</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
