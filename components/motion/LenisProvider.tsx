"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin globally
gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize Lenis smooth scroll physics
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    // Update GSAP ScrollTrigger whenever Lenis scrolls
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Standard high-performance native browser loop for Lenis scroll physics
    let rafId: number;
    const rafLoop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(rafLoop);
    };
    
    rafId = requestAnimationFrame(rafLoop);

    // Refresh ScrollTrigger calculations after initial loading transitions finish
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const handleRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Clean up connections on component unmount
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      clearTimeout(refreshTimer);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
    };
  }, []);

  return <>{children}</>;
}
