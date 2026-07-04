"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, X, MessageSquare, Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import MegaMenu from "@/components/layout/MegaMenu";
import SearchField from "@/components/ui/SearchField";
import Button from "@/components/ui/Button";
import { useFavourites } from "@/components/properties/FavouritesProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/investment", label: "Investment" },
  { href: "/communities", label: "Communities", hasMegaMenu: true },
  { href: "/developers", label: "Developers", hasMegaMenu: true },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollState, setScrollState] = useState<"transparent" | "glass" | "solid">("transparent");
  const [showSearch, setShowSearch] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { count } = useFavourites();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 50) {
        setScrollState("transparent");
      } else if (y < 600) {
        setScrollState("glass");
      } else {
        setScrollState("solid");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on path transition
  useEffect(() => {
    setIsOpen(false);
    setShowSearch(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrollState === "transparent" && "bg-transparent py-6 border-b border-white/5",
        scrollState === "glass" && "glassmorphism py-4 shadow-luxury",
        scrollState === "solid" && "bg-luxury-dark border-b border-luxury-border/30 py-4 shadow-luxury"
      )}
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 xl:px-8">
        <div className="flex items-center justify-between">
          
           {/* Brand Identity / Logo */}
          <Link href="/" className="flex items-center gap-1.5 xl:gap-2.5 group mr-2 xl:mr-6 2xl:mr-8 shrink-0">
            <div className="relative w-8 h-8 xl:w-9 xl:h-9 overflow-hidden rounded bg-luxury-dark border border-luxury-gold/20 flex items-center justify-center p-1">
              <Image
                src="/assets/logo.png"
                alt="Luxespace Properties"
                width={30}
                height={30}
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="font-serif text-xs sm:text-sm xl:text-base tracking-widest text-white transition-colors duration-300 group-hover:text-luxury-gold uppercase">
              Luxespace
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center lg:gap-1.5 xl:gap-3 2xl:gap-5 shrink-0">
            {NAV_LINKS.filter(link => link.href !== "/wishlist").map((link) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.href}
                  className="relative py-2"
                  onMouseEnter={() => {
                    if (link.hasMegaMenu) {
                      setActiveMegaMenu(link.label);
                    } else {
                      setActiveMegaMenu(null);
                    }
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[8px] xl:text-[9px] 2xl:text-[10px] uppercase tracking-wide xl:tracking-widest font-semibold transition-colors duration-300 pb-1.5 block relative group",
                      isActive
                        ? "text-luxury-gold"
                        : "text-gray-300 hover:text-luxury-gold"
                    )}
                  >
                    {link.label}
                    {/* Gold Underline Sweep Animation */}
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 h-[1.5px] bg-luxury-gold transition-all duration-300 ease-out",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Utility Tools & Calls To Action */}
          <div className="hidden sm:flex items-center gap-1.5 xl:gap-3 2xl:gap-5 shrink-0 ml-2 xl:ml-6 2xl:ml-8">
            {/* Search Trigger */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              type="button"
              className="text-gray-400 hover:text-luxury-gold transition-colors duration-300 p-1 xl:p-2 cursor-pointer"
              aria-label="Search Catalog"
            >
              {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Wishlist Trigger */}
            <Link
              href="/wishlist"
              className="text-gray-400 hover:text-luxury-gold transition-colors duration-300 p-1 xl:p-2 cursor-pointer relative"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-luxury-gold text-luxury-charcoal text-[7px] font-bold flex items-center justify-center scale-90 translate-x-1 translate-y--1">
                  {count}
                </span>
              )}
            </Link>

            {/* WhatsApp Link */}
            <a
              href="https://wa.me/9745334644"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 xl:gap-1.5 text-[8px] xl:text-[9px] 2xl:text-[10px] uppercase tracking-wider xl:tracking-widest text-gray-300 hover:text-luxury-gold transition-colors duration-300 border border-luxury-border/60 hover:border-luxury-gold/50 px-2 py-1.5 xl:px-3.5 xl:py-2.5 rounded-full"
            >
              <MessageSquare className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="hidden 2xl:inline">WhatsApp</span>
            </a>

            {/* Consultation CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => (window.location.href = "/contact")}
              className="flex items-center gap-1 xl:gap-1.5 text-[8px] xl:text-[9px] 2xl:text-[10px]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline">Book Consultation</span>
              <span className="inline 2xl:hidden">Book</span>
            </Button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              type="button"
              className="text-gray-400 hover:text-luxury-gold p-2 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-400 hover:text-white p-2 flex flex-col justify-center gap-1.5 w-6 h-6 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {/* Animated Hamburger Lines */}
              <span
                className={cn(
                  "w-5 h-[1.5px] bg-current transition-all duration-300",
                  isOpen ? "rotate-45 translate-y-[3px]" : ""
                )}
              />
              <span
                className={cn(
                  "w-5 h-[1.5px] bg-current transition-all duration-300",
                  isOpen ? "-rotate-45 -translate-y-[4px]" : ""
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Panels */}
      <MegaMenu isOpen={activeMegaMenu !== null} onClose={() => setActiveMegaMenu(null)} />

      {/* Slide-Down Search Overlay */}
      {showSearch && (
        <div className="absolute top-[72px] lg:top-[80px] left-0 right-0 z-40 bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-border/30 shadow-2xl py-6 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchVal.trim()) {
                setShowSearch(false);
                window.location.href = `/search?q=${encodeURIComponent(searchVal.trim())}`;
              }
            }}
            className="max-w-3xl mx-auto flex items-center gap-3 w-full"
          >
            <SearchField
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className="hidden" />
            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="text-gray-500 hover:text-white text-xs uppercase tracking-widest font-semibold px-2 cursor-pointer shrink-0"
            >
              Close
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Drawer overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 bottom-0 top-[72px] z-40 bg-luxury-charcoal/95 backdrop-blur-lg border-t border-luxury-border/30 transition-all duration-500 ease-out transform",
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full px-6 py-8 overflow-y-auto justify-between">
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-base uppercase tracking-widest font-serif transition-colors duration-300",
                    isActive ? "text-luxury-gold" : "text-gray-300 hover:text-luxury-gold"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex flex-col gap-4 mt-8 pb-12">
            <a
              href="https://wa.me/9745334644"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white border border-luxury-gold/50 py-3 rounded-full hover:bg-luxury-gold/10 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4 text-luxury-gold" />
              <span>WhatsApp Chat</span>
            </a>
            <Link
              href="/contact"
              className="bg-luxury-gold text-luxury-charcoal text-center text-xs uppercase tracking-widest font-semibold py-3.5 rounded-full hover:bg-white transition-all duration-300 block"
            >
              Book Private Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
