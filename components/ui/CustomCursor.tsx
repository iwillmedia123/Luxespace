"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Position motion values for zero-latency tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for the outer ring (creates the luxury lagging follow-effect)
  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if the device is a mobile or touch screen
    const checkDevice = () => {
      const mobile =
        window.matchMedia("(max-width: 768px)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    // Track mouse coordinates
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    // Handle cursor expansion when hovering over links and buttons
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "IMG" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("img") ||
        target.closest(".group") ||
        target.closest("[role='button']") ||
        target.classList.contains("cursor-pointer-hover")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Follower Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          borderColor: isHovered ? "#f1d99b" : "rgba(241, 217, 155, 0.4)",
          backgroundColor: isHovered ? "rgba(241, 217, 155, 0.05)" : "rgba(241, 217, 155, 0)",
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-luxury-gold pointer-events-none z-50 mix-blend-difference hidden md:block"
      />

      {/* Center Target Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-luxury-gold rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
      />
    </>
  );
}
