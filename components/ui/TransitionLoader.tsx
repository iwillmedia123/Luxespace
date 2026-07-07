"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

function TransitionLoaderInner() {
  const [visible, setVisible] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading Luxespace Experience...");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getLoadingText = (href: string): string => {
    if (href.includes("/communities/")) {
      return "Loading Community Map & Dossier...";
    }
    if (href.includes("/communities")) {
      return "Loading Luxury Communities...";
    }
    if (href.includes("/properties") || href.includes("/buy") || href.includes("/rent")) {
      return "Loading Exclusive Portfolio...";
    }
    if (href.includes("/blog/")) {
      return "Loading Editorial Intelligence Article...";
    }
    if (href.includes("/blog")) {
      return "Loading Editorial Intelligence...";
    }
    if (href.includes("/agents/")) {
      return "Loading Advisor Profile...";
    }
    if (href.includes("/agents")) {
      return "Loading Advisor Profiles...";
    }
    if (href.includes("/developers")) {
      return "Loading Developer Portfolios...";
    }
    return "Loading Luxespace Experience...";
  };

  const endLoader = useCallback(() => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setVisible(false);
  }, []);

  const startLoader = useCallback((href: string) => {
    const text = getLoadingText(href);
    setLoadingText(text);
    setVisible(true);

    // Safety fallback: auto-dismiss after 8 seconds
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      endLoader();
    }, 8000);
  }, [endLoader]);

  // Dismiss loader on pathname/search change
  useEffect(() => {
    endLoader();
  }, [pathname, searchParams, endLoader]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (target.tagName === "A") {
          const href = target.getAttribute("href");
          const targetAttr = target.getAttribute("target");

          if (
            href &&
            href.startsWith("/") &&
            !href.startsWith("//") &&
            !href.includes(":") &&
            !href.includes("#") &&
            targetAttr !== "_blank" &&
            !target.hasAttribute("download") &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.shiftKey &&
            !e.altKey
          ) {
            // Check if same page
            try {
              const targetUrl = new URL(href, window.location.origin);
              const isSamePage =
                targetUrl.pathname === window.location.pathname &&
                targetUrl.search === window.location.search;

              if (!isSamePage) {
                startLoader(href);
              }
            } catch (err) {
              console.error("URL parse error:", err);
            }
          }
          break;
        }
        target = target.parentElement;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        endLoader();
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [pathname, searchParams, startLoader, endLoader]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={endLoader}
          className="fixed inset-0 bg-[#1f232c] z-50 flex flex-col items-center justify-center space-y-4 pointer-events-auto cursor-pointer"
        >
          <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-light tracking-wider select-none">
            {loadingText}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function TransitionLoader() {
  return (
    <Suspense fallback={null}>
      <TransitionLoaderInner />
    </Suspense>
  );
}
