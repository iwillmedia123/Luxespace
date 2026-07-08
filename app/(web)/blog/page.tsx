"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, Calendar, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { BlogPost, Agent } from "@/types";
import Typography from "@/components/ui/Typography";
import BlogCard from "@/components/cards/BlogCard";
import NewsletterSection from "@/components/layout/NewsletterSection";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = [
    "All",
    "Dubai Real Estate News",
    "Investment Guides",
    "Market Insights",
    "Luxury Lifestyle",
    "Buying Guide",
    "Selling Guide",
    "Renting Guide",
    "Community Guides",
    "Developer News",
    "Interior Design",
    "Property Tips",
    "Visa & Residency"
  ];

  const [totalItems, setTotalItems] = useState(0);
  const [prevFiltersKey, setPrevFiltersKey] = useState("");

  useEffect(() => {
    const currentFiltersKey = JSON.stringify({ selectedCategory, selectedTag, search });
    if (prevFiltersKey !== currentFiltersKey) {
      setPrevFiltersKey(currentFiltersKey);
      setCurrentPage(1);
    }
  }, [selectedCategory, selectedTag, search, prevFiltersKey]);

  useEffect(() => {
    async function loadBlogs() {
      setLoading(true);
      try {
        const filters = {
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          tag: selectedTag || undefined,
          search: search || undefined,
          status: "published",
          page: currentPage,
          limit: postsPerPage,
          isSummary: true,
        };
        const [res, ags, cats] = await Promise.all([
          db.getBlogsByFilters(filters),
          db.getAgents(),
          db.getBlogCategories(),
        ]);
        setBlogs(res.blogs);
        setTotalItems(res.totalCount);
        setAgents(ags);
        if (cats && cats.length > 0) {
          setDbCategories(["All", ...cats.map(c => c.name)]);
        }
      } catch (err) {
        console.error("Error loading blog catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, [prevFiltersKey, currentPage]);

  // Filter logic (already filtered on server, but fallback is defined)
  const filtered = blogs;

  // Extract all unique tags
  const allTags = Array.from(
    new Set(blogs.flatMap((post) => post.tags || []))
  ).slice(0, 15);

  // Pagination logic
  const totalPages = Math.ceil(totalItems / postsPerPage);
  const currentPosts = blogs;

  const featuredArticle = blogs.find((b) => b.isFeaturedArticle) || blogs[0];
  const latestArticles = blogs.filter((p) => p.id !== featuredArticle?.id);

  const getAuthorName = (authorId: string) => {
    const agent = agents.find((a) => a.id === authorId);
    return agent ? agent.name : "Luxespace Advisory";
  };

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-luxury-border/20 pb-8">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 font-bold select-none">
            <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-luxury-gold">Journal & Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-white mt-3">Luxespace Publications</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2.5 font-light max-w-2xl leading-relaxed">
            Market Intelligence, architectural masterpieces, legal frameworks, and HNWI real estate briefings in Dubai.
          </p>
        </div>

        {loading ? (
          <div className="space-y-12 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="lg:col-span-2 aspect-[16/9] bg-luxury-dark border border-luxury-border/20 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-6 w-24 bg-luxury-border/40 rounded" />
                <div className="h-10 w-full bg-luxury-border/40 rounded" />
                <div className="h-20 w-full bg-luxury-border/40 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-96 bg-luxury-dark border border-luxury-border/20 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article Highlight */}
            {featuredArticle && selectedCategory === "All" && !selectedTag && !search && (
              <section className="bg-luxury-dark border border-luxury-border/30 rounded-3xl overflow-hidden group hover:border-luxury-gold/25 transition-all duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Banner */}
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden">
                    <Image
                      src={featuredArticle.coverImage || "/assets/apartment_render.png"}
                      alt={featuredArticle.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                    <div className="absolute top-6 left-6 bg-luxury-gold text-luxury-charcoal text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded">
                      Featured Bulletin
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-500 text-[10px] uppercase tracking-wider font-semibold">
                        <span className="text-luxury-gold">{featuredArticle.category || "Dubai Real Estate News"}</span>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-luxury-gold" />
                          <span>
                            {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-luxury-gold" />
                          <span>{featuredArticle.readingTime || 5} Min</span>
                        </div>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors duration-300 group-hover:translate-x-1"
                    >
                      <span>Read Full Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Layout filter system */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar filter controls */}
              <aside className="lg:col-span-3 space-y-8 select-none">
                
                {/* Search Bar */}
                <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold">Search Journal</span>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Keyword search..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 space-y-3">
                  <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold block border-b border-luxury-border/10 pb-1.5">
                    Categories
                  </span>
                  <div className="flex flex-col gap-2">
                    {(dbCategories.length > 0 ? dbCategories : categories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`text-[10px] uppercase tracking-wider font-semibold py-1.5 px-3 rounded text-left transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-luxury-gold text-luxury-charcoal font-bold"
                            : "text-gray-400 hover:text-white hover:bg-luxury-charcoal/30"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Cloud */}
                {allTags.length > 0 && (
                  <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 space-y-3">
                    <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold block border-b border-luxury-border/10 pb-1.5">
                      Filter by Tag
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(selectedTag === tag ? "" : tag);
                            setCurrentPage(1);
                          }}
                          className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-all cursor-pointer flex items-center gap-1 ${
                            selectedTag === tag
                              ? "bg-luxury-gold text-luxury-charcoal font-bold"
                              : "bg-[#1f232c] border border-luxury-border/40 text-gray-400 hover:text-white"
                          }`}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          <span>{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              {/* Main Grid View */}
              <div className="lg:col-span-9 space-y-8">
                {filtered.length === 0 ? (
                  <div className="text-center py-20 bg-luxury-dark border border-luxury-border/30 rounded-3xl space-y-4">
                    <BookOpen className="w-12 h-12 text-luxury-gold/50 mx-auto animate-pulse" />
                    <h2 className="font-serif text-xl text-white">No Publications Found</h2>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
                      We couldn&apos;t find any articles matching your selected criteria. Try resetting the filters or modifying your search query.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {currentPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 pt-6 select-none">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              currentPage === idx + 1
                                ? "bg-luxury-gold border-luxury-gold text-luxury-charcoal font-bold"
                                : "border-luxury-border/30 text-gray-400 hover:text-white"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <NewsletterSection className="my-16" />
          </>
        )}
      </div>
    </main>
  );
}
