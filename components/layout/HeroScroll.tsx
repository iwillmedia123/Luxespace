"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Animation constants
  const totalFrames = 241; // 0 to 240
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderFrameRef = useRef<(index: number) => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Detect mobile viewport to optimize asset loading
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const step = isMobile ? 2 : 1; // Load every 2nd frame on mobile (reduces workload by 50%)
    const activeFramesCount = Math.ceil(totalFrames / step);

    // Canvas Cover Sizing algorithm (similar to object-fit: cover)
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      // Redraw active frame on resize
      if (imagesRef.current[activeFrameIndex.current]) {
        drawFrame(activeFrameIndex.current);
      }
    };

    const drawFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !ctx) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas viewport
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        // Image is taller than canvas viewport
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Store draw function in ref to invoke inside GSAP scroll ticker
    const activeFrameIndex = { current: 0 };
    renderFrameRef.current = (index: number) => {
      const mappedIndex = Math.min(activeFramesCount - 1, Math.max(0, Math.floor(index / step)));
      activeFrameIndex.current = mappedIndex;
      requestAnimationFrame(() => drawFrame(mappedIndex));
    };

    // Sizing setups
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Image URL constructor
    const getFrameUrl = (frameIndex: number) => {
      const paddedIndex = frameIndex.toString().padStart(5, "0");
      return `/assets/scroll-animation/Temp-frame_${paddedIndex}.webp`;
    };

    // Preloading Logic
    let loadedCount = 0;
    const preloadFirstCount = 15; // Preload first few frames immediately for instant rendering

    const handleFrameLoad = (index: number, img: HTMLImageElement) => {
      imagesRef.current[index] = img;
      loadedCount++;
      
      // Update progress loading state
      const progress = Math.round((loadedCount / activeFramesCount) * 100);
      setLoadProgress(progress);

      // Render 1st frame immediately once it is ready
      if (index === 0) {
        drawFrame(0);
        setIsLoading(false);
      }
    };

    // Load first frames instantly
    for (let i = 0; i < preloadFirstCount; i++) {
      const frameIndex = i * step;
      if (frameIndex >= totalFrames) break;

      const img = new window.Image();
      img.src = getFrameUrl(frameIndex);
      img.onload = () => handleFrameLoad(i, img);
    }

    // Lazy load the remaining frames in the background
    const loadRemaining = setTimeout(() => {
      for (let i = preloadFirstCount; i < activeFramesCount; i++) {
        const frameIndex = i * step;
        if (frameIndex >= totalFrames) break;

        const img = new window.Image();
        img.src = getFrameUrl(frameIndex);
        img.onload = () => handleFrameLoad(i, img);
      }
    }, 150);

    // Timeline Scrub Bindings
    const scrollObj = { frame: 0 };
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // Scrubbing distance in px
        scrub: 1, // Smooth scrub easing
        pin: true,
        anticipatePin: 1,
      },
    });

    // Scrub image sequence frames across the entire duration (0 to 100)
    timeline.to(scrollObj, {
      frame: totalFrames - 1,
      duration: 100,
      ease: "none",
      onUpdate: () => {
        renderFrameRef.current(scrollObj.frame);
      },
    }, 0);

    // Gradual Text fade-ups (Completely faded by 70% scroll progression)
    timeline.to(textRef.current, {
      opacity: 0,
      y: -80,
      duration: 70,
      ease: "power1.inOut",
    }, 0);

    // Fade dark overlay slightly at the end for transition brightness
    timeline.to(overlayRef.current, {
      opacity: 0.8,
      duration: 80,
      ease: "none",
    }, 0);

    // Cinematic exit: fade out canvas and overlay from 90% to 100% scroll progress (90 to 100)
    timeline.to([canvasRef.current, overlayRef.current], {
      opacity: 0,
      duration: 10,
      ease: "power2.inOut",
    }, 90);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(loadRemaining);
      // Kill scroll trigger instance to avoid memory leak
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-luxury-charcoal">
      {/* HTML5 High-Performance Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Luxury Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-luxury-charcoal/65 z-10 transition-opacity duration-300"
      />

      {/* Centered Typography Content */}
      <div
        ref={textRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 select-none pointer-events-none"
      >
        <div className="max-w-5xl space-y-8 pointer-events-auto">
          {/* Tagline */}
          <div className="flex flex-col items-center gap-3">
            <Typography
              variant="subheading"
              className="block text-luxury-gold tracking-widest uppercase font-semibold"
            >
              Dubai Luxury Real Estate
            </Typography>
            <div className="w-12 h-[1px] bg-luxury-gold/50" />
          </div>

          {/* Headline */}
          <Typography
            variant="hero"
            as="h1"
            className="block text-5xl sm:text-7xl lg:text-8xl font-serif text-white uppercase leading-[1.15] tracking-[0.08em]"
          >
            Discover Exceptional<br />Living Spaces
          </Typography>

          {/* Subtitle description */}
          <Typography
            variant="body"
            className="block text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-light leading-relaxed tracking-wide opacity-90"
          >
            Explore Dubai&apos;s finest private villas, premium penthouses, and high-yield real estate investment opportunities.
          </Typography>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const searchSec = document.getElementById("property-search-section");
                if (searchSec) searchSec.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(241,217,155,0.25)] transition-all duration-300"
            >
              Explore Properties
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = "/contact")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-white/20 hover:border-luxury-gold hover:text-luxury-gold hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consultation</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle loader display before first frames show */}
      {isLoading && (
        <div className="absolute inset-0 bg-luxury-charcoal flex flex-col items-center justify-center z-30 select-none">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-t-2 border-r-2 border-luxury-gold rounded-full animate-spin mx-auto" />
            <Typography variant="label" className="text-[10px] tracking-widest block">
              Initializing Cinematic Experience {loadProgress}%
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}
