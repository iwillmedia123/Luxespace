"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Property } from "@/types";

interface RecentlyViewedContextType {
  recentlyViewed: Property[];
  addViewed: (property: Property) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("luxespace_recently_viewed");
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addViewed = useCallback((property: Property) => {
    setRecentlyViewed((prev) => {
      // Remove duplicate if it already exists
      const filtered = prev.filter((p) => p.id !== property.id);
      // Place new property at start, limit to max 12 items
      const updated = [property, ...filtered].slice(0, 12);
      localStorage.setItem("luxespace_recently_viewed", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
}
