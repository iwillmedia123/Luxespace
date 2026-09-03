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
    const handleScroll = () => {
      try {
        ScrollTrigger.update();
      } catch {
        // Safe catch if ScrollTrigger instances are refreshing during route transition
      }
    };
    lenis.on("scroll", handleScroll);

    // Standard high-performance native browser loop for Lenis scroll physics
    let rafId: number;
    const rafLoop = (time: number) => {
      try {
        lenis.raf(time);
      } catch {
        // Safe catch for transition updates
      }
      rafId = requestAnimationFrame(rafLoop);
    };
    
    rafId = requestAnimationFrame(rafLoop);

    // Refresh ScrollTrigger calculations after initial loading transitions finish
    const refreshTimer = setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        // Ignore during route change
      }
    }, 500);

    const handleRefresh = () => {
      try {
        lenis.resize();
      } catch {
        // Ignore during route change
      }
    };
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Clean up connections on component unmount
    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      clearTimeout(refreshTimer);
      try {
        ScrollTrigger.removeEventListener("refresh", handleRefresh);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, []);

  return <>{children}</>;
}
