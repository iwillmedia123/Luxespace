"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "@/types";
import TestimonialCard from "@/components/cards/TestimonialCard";
import Typography from "@/components/ui/Typography";
import { db } from "@/lib/db";

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    clientName: "Sir Alistair Cunningham",
    clientTitle: "Managing Director, Sovereign Holdings",
    rating: 5,
    content: "Luxespace curated a completely off-market penthouse for us in Palm Jumeirah. Their connections in the region are unparalleled. The privacy and discretion throughout the acquisition was exemplary.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t2",
    clientName: "Elena Rostova",
    clientTitle: "Private Investor",
    rating: 5,
    content: "The level of market intelligence provided by their advisory team allowed us to secure two high-yield floors in Downtown Dubai before the public release. A true family office experience.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t3",
    clientName: "Jean-Pierre Laurent",
    clientTitle: "Founder, Laurent & Cie",
    rating: 5,
    content: "Every property viewing was arranged with absolute attention to detail—private yacht transfers, bespoke schedules, and direct access to developers. They do not sell real estate; they curate portfolios.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t4",
    clientName: "Amara Al-Jamil",
    clientTitle: "Executive Vice President, MENA Capitals",
    rating: 5,
    content: "Their end-to-end support, from luxury concierge services to developer interface, took the complexity out of our cross-border family investments. Exceptional responsiveness.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t5",
    clientName: "Marcus Thorne",
    clientTitle: "CEO, Thorne Tech Group",
    rating: 5,
    content: "Dubai Hills Estate is a competitive market, but Luxespace secured a signature mansion on the park for our family that was otherwise inaccessible. Highly professional team.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "t6",
    clientName: "Yuki Tanaka",
    clientTitle: "Managing Partner, Tanaka Capital",
    rating: 5,
    content: "Luxespace understands the subtleties of luxury. Their advisory goes beyond simple transactions—they evaluate structural designs, developer track records, and long-term liquidity profiles.",
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
];

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        setLoading(true);
        const list = await db.getTestimonials();
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTestimonials(sorted.length > 0 ? sorted : MOCK_TESTIMONIALS);
      } catch (err) {
        console.error("Error loading testimonials:", err);
        setTestimonials(MOCK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  const items = testimonials.length > 0 ? testimonials : MOCK_TESTIMONIALS;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const getVisibleTestimonials = () => {
    const list = [];
    if (items.length === 0) return [];
    for (let i = 0; i < Math.min(3, items.length); i++) {
      const idx = (currentIndex + i) % items.length;
      list.push(items[idx]);
    }
    return list;
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="w-full space-y-12">
        <div className="flex items-end justify-between border-b border-luxury-border/20 pb-6">
          <div className="space-y-3">
            <div className="h-4 w-32 bg-luxury-border/20 rounded animate-pulse" />
            <div className="h-8 w-64 bg-luxury-border/20 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-64 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse" />
          <div className="h-64 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse hidden md:block" />
          <div className="h-64 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse hidden md:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      {/* Navigation Arrow Controls */}
      <div className="flex items-end justify-between border-b border-luxury-border/20 pb-6">
        <div className="space-y-3">
          <Typography variant="subheading" className="text-luxury-gold">
            Client Advisory Opinions
          </Typography>
          <Typography variant="section" as="h2">
            Trusted By Global Investors
          </Typography>
        </div>
        
        {items.length > 1 && (
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-luxury-border/40 hover:border-luxury-gold/50 hover:bg-luxury-gold/5 flex items-center justify-center text-gray-400 hover:text-luxury-gold transition-all duration-300 cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-luxury-border/40 hover:border-luxury-gold/50 hover:bg-luxury-gold/5 flex items-center justify-center text-gray-400 hover:text-luxury-gold transition-all duration-300 cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Cards List Grid Slider Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {getVisibleTestimonials().map((testimonial, idx) => (
            <motion.div
              key={`${testimonial.id}-${currentIndex}-${idx}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={idx > 0 ? "hidden md:block" : "block"}
            >
              <TestimonialCard testimonial={testimonial} className="h-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slider indicators */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === i ? "w-6 bg-luxury-gold" : "w-1.5 bg-luxury-border/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
