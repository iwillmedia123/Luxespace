"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface FavouritesContextType {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
  count: number;
  setFavouritesList: (list: string[]) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("luxespace_favourites");
    if (stored) {
      try {
        setFavourites(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
    setMounted(true);
  }, []);

  const isFavourite = (id: string) => {
    return favourites.includes(id);
  };

  const toggleFavourite = (id: string) => {
    let updated: string[];
    if (favourites.includes(id)) {
      updated = favourites.filter(favId => favId !== id);
    } else {
      updated = [...favourites, id];
    }
    setFavourites(updated);
    localStorage.setItem("luxespace_favourites", JSON.stringify(updated));
  };

  const setFavouritesList = (list: string[]) => {
    setFavourites(list);
    localStorage.setItem("luxespace_favourites", JSON.stringify(list));
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        isFavourite,
        toggleFavourite,
        count: favourites.length,
        setFavouritesList,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouritesProvider");
  }
  return context;
}
