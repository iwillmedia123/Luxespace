"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { LifestyleArticle } from "@/types";

export default function LifestylePage() {
  const [articles, setArticles] = useState<LifestyleArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const list = await db.getLifestyle();
        setArticles(list.filter((a) => a.isPublished));
      } catch (err) {
        console.error("Error loading articles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

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
          <span className="text-luxury-gold">Lifestyle Journal</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Luxury Editorial Journal</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Luxe Living Editorial</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Curated articles exploring top-tier Dubai architecture, ocean terraces, Michelin star gastronomy, and real estate market trends.
          </p>
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No articles found in our editorial archive.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500 flex flex-col group hover:-translate-y-1 shadow-luxury"
              >
                {/* Cover Photo */}
                <div className="h-56 relative bg-luxury-charcoal/80 overflow-hidden">
                  <Image
                    src={art.coverImage || "/assets/apartment_render.webp"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-transparent" />
                  
                  {/* Category label */}
                  <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-charcoal text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                    {art.category}
                  </span>
                </div>

                {/* Content body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-gray-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-luxury-gold/75" />
                      <span>{new Date(art.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                    </div>

                    <h3 className="font-serif text-base text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    
                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => alert(`Full article content: \n\n${art.content}`)}
                      className="w-full py-2.5 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300 text-[9px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 text-gray-300 group-hover:bg-luxury-gold/5 cursor-pointer"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
