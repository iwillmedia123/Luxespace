"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the loading screen after the introductory animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-luxury-charcoal flex flex-col items-center justify-center z-50 pointer-events-auto select-none"
        >
          <div className="flex flex-col items-center space-y-6">
            {/* Elegant logo scaling reveal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
              }}
              className="relative w-20 h-20 overflow-hidden rounded bg-luxury-dark border border-luxury-gold/15 flex items-center justify-center p-2.5 shadow-2xl shadow-black/45"
            >
              <Image
                src="/assets/logo.png"
                alt="Luxespace Properties"
                width={64}
                height={64}
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Split text reveal for brand name */}
            <div className="text-center overflow-hidden">
              <motion.h1
                initial={{ y: 25, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }
                }}
                className="font-serif text-2xl uppercase tracking-widest text-white"
              >
                Luxespace
              </motion.h1>
              <motion.span
                initial={{ y: 15, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }}
                className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold block mt-1"
              >
                Properties
              </motion.span>
            </div>
          </div>

          {/* Luxury thin progress slide indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-luxury-border/30 overflow-hidden rounded-full">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ 
                left: "100%",
                transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
              }}
              className="absolute top-0 bottom-0 w-1/2 bg-luxury-gold"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
