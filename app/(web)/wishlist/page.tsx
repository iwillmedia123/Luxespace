"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Home, Inbox } from "lucide-react";
import { db } from "@/lib/db";
import { Property } from "@/types";
import { useFavourites } from "@/components/properties/FavouritesProvider";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import PropertySkeleton from "@/components/properties/PropertySkeleton";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const { favourites, count, setFavouritesList } = useFavourites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        setLoading(true);
        if (favourites.length === 0) {
          setProperties([]);
          return;
        }

        const res = await db.getPropertiesByFilters({ ids: favourites, isSummary: true });
        setProperties(res.properties);

        // Check if any stored IDs no longer exist in the database and prune them
        const returnedIds = res.properties.map((p) => p.id);
        const validFavourites = favourites.filter((id) => returnedIds.includes(id));
        if (validFavourites.length !== favourites.length) {
          setFavouritesList(validFavourites);
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [favourites, setFavouritesList]);

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">Private Wishlist</span>
        </nav>

        {/* Header Title */}
        <div className="border-b border-luxury-border/20 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
              <span>Curated Selection</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Your Favourites</h1>
            <p className="text-xs text-gray-400 mt-2 font-light">
              Review and compare your bookmarked luxury properties in Dubai.
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold border border-luxury-border/30 rounded-xl px-4 py-2.5 bg-luxury-dark/40 self-start sm:self-auto">
            Total Saved: <span className="text-luxury-gold">{count}</span>
          </div>
        </div>

        {/* Main List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <PropertySkeleton key={idx} viewMode="grid" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-16 text-center space-y-5 max-w-xl mx-auto my-12 shadow-luxury">
            <Inbox className="w-12 h-12 text-luxury-gold/50 mx-auto" />
            <div className="space-y-2">
              <h3 className="font-serif text-xl text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm mx-auto">
                Explore our curated portfolio of ultra-luxury estates, apartments, and off-plan residences to add them here.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/properties" passHref>
                <Button className="text-xs flex items-center gap-2 mx-auto">
                  <Home className="w-4 h-4" />
                  <span>Browse Portfolio</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCardLuxury key={property.id} property={property} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
