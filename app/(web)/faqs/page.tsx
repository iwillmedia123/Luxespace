"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/lib/db";
import { FAQItem } from "@/types";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [activeCategory, setActiveCategory] = useState("Buying Property");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFAQs() {
      try {
        setLoading(true);
        const list = await db.getFAQs();
        setFaqs(list);
      } catch (err) {
        console.error("Error loading FAQs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFAQs();
  }, []);

  const categories = [
    "Buying Property",
    "Renting",
    "Off Plan",
    "Mortgage",
    "Golden Visa",
    "Foreign Investment",
    "Property Registration",
    "Developer Questions",
    "Property Management",
    "Tax & Payments"
  ];

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Filter FAQs based on active category OR search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchVal.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchVal.toLowerCase());

    if (searchVal.trim().length > 0) {
      return matchesSearch;
    }
    return faq.category === activeCategory;
  });

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">FAQs</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Property Investment Resources</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Frequently Asked Questions</h1>
            <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
              Find detailed explanations regarding UAE property legislation, residency visa processes, foreign tax structures, and catalog transactions.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-600">
              <Search className="w-4 h-4 text-luxury-gold" />
            </div>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search all 40+ questions..."
              className="w-full bg-luxury-dark/60 border border-luxury-border/60 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/30 transition-all placeholder-gray-600"
            />
          </div>
        </div>

        {/* Categories Tab Selector (Hidden if searching) */}
        {searchVal.trim().length === 0 && (
          <div className="flex gap-3 border-b border-luxury-border/10 mb-8 pb-3 select-none overflow-x-auto scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedId(null);
                }}
                className={`text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg border transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-luxury-gold/5 border-luxury-gold text-luxury-gold"
                    : "border-luxury-border/30 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Filtered List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-luxury-dark/40 border border-luxury-border/20 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-luxury-dark border border-luxury-border/30 rounded-2xl">
            <p className="text-xs text-gray-400 font-light">No FAQs match your search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden hover:border-luxury-gold/20 transition-all duration-300"
                >
                  <button
                    onClick={() => handleToggle(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors">
                      {faq.question}
                    </span>
                    <span className="text-luxury-gold shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 border-t border-luxury-border/10 text-xs text-gray-300 font-light leading-relaxed">
                      {faq.answer}
                      <span className="block text-[8px] text-gray-500 uppercase tracking-widest font-semibold mt-4">
                        Category: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
