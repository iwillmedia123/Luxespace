"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MessageSquare, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Testimonial } from "@/types";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        setLoading(true);
        const list = await db.getTestimonials();
        setTestimonials(list);
      } catch (err) {
        console.error("Error loading testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">Testimonials</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Investor Testimonials</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Client Experiences</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Read from prominent global executives, foreign investors, and local property buyers who have trusted Luxespace for their luxury portfolio acquisitions.
          </p>
        </div>

        {loading ? (
          <div className="h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse" />
        ) : testimonials.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No testimonials registered yet.</p>
        ) : (
          <div className="space-y-16">
            {/* Spotlight Interactive Slider Carousel */}
            <div className="bg-gradient-to-br from-luxury-dark to-luxury-charcoal/80 border border-luxury-border/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-6 right-8 text-luxury-gold/5 pointer-events-none">
                <Quote className="w-40 h-40 transform rotate-180" />
              </div>

              <div className="max-w-3xl mx-auto space-y-6 text-center py-6">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold bg-luxury-gold/5 border border-luxury-gold/25 px-2.5 py-1 rounded-full">
                  Investor Spotlight
                </span>

                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>

                <p className="font-serif text-lg sm:text-xl text-white italic leading-relaxed">
                  &ldquo;{testimonials[activeIndex].content}&rdquo;
                </p>

                <div className="space-y-1">
                  <h4 className="font-serif text-sm text-white">{testimonials[activeIndex].clientName}</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                    {testimonials[activeIndex].clientTitle || "Private Client"}
                  </p>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center justify-center gap-4 pt-6 select-none">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-luxury-border/40 hover:border-luxury-gold text-gray-400 hover:text-luxury-gold flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-luxury-border/40 hover:border-luxury-gold text-gray-400 hover:text-luxury-gold flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Glass Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="bg-luxury-dark/40 backdrop-blur-md border border-luxury-border/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-luxury-gold/25 transition-all duration-300 relative group"
                >
                  <div className="absolute top-4 right-6 text-luxury-gold/5 pointer-events-none">
                    <Quote className="w-12 h-12 transform rotate-180" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
                      ))}
                    </div>

                    <p className="text-xs text-gray-300 font-light leading-relaxed italic">
                      &ldquo;{test.content}&rdquo;
                    </p>
                  </div>

                  <div className="border-t border-luxury-border/10 pt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-luxury-charcoal flex items-center justify-center text-luxury-gold font-bold text-xs border border-luxury-border/30">
                      {test.clientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-xs text-white leading-tight">{test.clientName}</h4>
                      <p className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold">
                        {test.clientTitle || "Property Buyer"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
