"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function PropertyGallery({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setZoom(false);
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setZoom(false);
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between select-none">
      {/* Top Bar Controls */}
      <div className="h-16 px-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          {activeIndex + 1} / {images.length}
        </span>
        <div className="flex gap-4">
          <button
            onClick={() => setZoom(!zoom)}
            className="text-gray-400 hover:text-white p-2 transition-colors cursor-pointer"
            title={zoom ? "Zoom Out" : "Zoom In"}
          >
            {zoom ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image stage */}
      <div
        className="flex-grow flex items-center justify-center relative px-12"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 border border-white/10 hover:border-luxury-gold text-white hover:text-luxury-gold transition-colors z-20 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image Frame */}
        <div className="relative w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-xl">
          <Image
            src={images[activeIndex]}
            alt={`Property View ${activeIndex + 1}`}
            fill
            sizes="100vw"
            priority
            className={cn(
              "object-contain transition-transform duration-300",
              zoom ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            )}
            onClick={() => setZoom(!zoom)}
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 border border-white/10 hover:border-luxury-gold text-white hover:text-luxury-gold transition-colors z-20 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails list bottom bar */}
      <div className="bg-black/60 border-t border-white/5 py-4 px-6 shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3 overflow-x-auto justify-center py-1">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => {
                setZoom(false);
                setActiveIndex(idx);
              }}
              className={cn(
                "relative w-20 aspect-[16/10] rounded-lg overflow-hidden cursor-pointer border-2 transition-all shrink-0",
                activeIndex === idx
                  ? "border-luxury-gold scale-105"
                  : "border-transparent opacity-50 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
