"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility (only trigger state update if changed)
      const shouldBeVisible = window.scrollY > 300;
      setIsVisible((prev) => {
        if (prev !== shouldBeVisible) {
          return shouldBeVisible;
        }
        return prev;
      });

      // Calculate progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress((prev) => {
          // Avoid tiny fractional updates to prevent excessive renders
          if (Math.abs(prev - progress) > 0.5 || progress === 100 || progress === 0) {
            return progress;
          }
          return prev;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG parameters
  const radius = 18;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      type="button"
      className={cn(
        "fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-luxury-dark/90 border border-luxury-border/30 flex items-center justify-center text-gray-400 hover:text-luxury-gold shadow-2xl transition-all duration-500 ease-out translate-y-12 opacity-0 focus:outline-none cursor-pointer hover:border-luxury-gold/50",
        isVisible && "translate-y-0 opacity-100"
      )}
      aria-label="Back to top"
    >
      {/* Progress Circle overlay */}
      <svg className="absolute -rotate-90 w-11 h-11 pointer-events-none">
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="rgba(241, 217, 155, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="#f1d99b"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-100"
        />
      </svg>
      
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
