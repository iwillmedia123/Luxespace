"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, Calendar, Clock, Share2, Link2, 
  ChevronLeft, Building2, MapPin, ArrowRight, Mail, ArrowUpRight 
} from "lucide-react";
import { BlogPost, Agent, Property, Community, Developer } from "@/types";
import { parseMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import NewsletterSection from "@/components/layout/NewsletterSection";

interface BlogDetailClientProps {
  post: BlogPost;
  author: Agent | null;
  allBlogs: BlogPost[];
  relatedPropertiesData: Property[];
  relatedCommunitiesData: Community[];
  relatedDevelopersData: Developer[];
}

export default function BlogDetailClient({
  post,
  author,
  allBlogs,
  relatedPropertiesData,
  relatedCommunitiesData,
  relatedDevelopersData
}: BlogDetailClientProps) {
  const [copied, setCopied] = useState(false);

  // Next / Prev article navigation
  const currentIndex = allBlogs.findIndex((b) => b.id === post.id);
  const nextPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const prevPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Build Table of Contents
  const getTableOfContents = () => {
    const headings: { id: string; text: string; level: number }[] = [];
    const lines = post.content.split("\n");
    lines.forEach((line) => {
      if (line.startsWith("## ") || line.startsWith("### ")) {
        const isH3 = line.startsWith("### ");
        const text = line.replace(/^#{2,3}\s+/, "").trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        headings.push({ id, text, level: isH3 ? 3 : 2 });
      }
    });
    return headings;
  };

  const toc = getTableOfContents();

  // Social Share Helpers
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(post.title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.015] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.015] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 font-bold select-none border-b border-luxury-border/10 pb-4">
          <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-luxury-gold transition-colors">Journal</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-400">{post.category || "Dubai Real Estate News"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-luxury-gold truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-4 max-w-4xl">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
              {post.category || "Dubai Real Estate News"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white font-medium leading-tight">
              {post.title}
            </h1>
            <p className="text-xs sm:text-base text-gray-400 font-light leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Author Card Row */}
          <div className="flex flex-wrap items-center justify-between border-t border-b border-luxury-border/20 py-4 gap-6 select-none">
            <div className="flex items-center gap-3">
              {author ? (
                <Link href={`/agents/${author.slug}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-luxury-border/40 relative">
                    <img
                      src={author.avatarUrl || "/assets/agent_1.png"}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white group-hover:text-luxury-gold transition-colors duration-300 block leading-tight">
                      {author.name}
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">
                      {author.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold font-serif text-sm">
                    L
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block leading-tight">
                      Luxespace Advisory
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">
                      Executive Desk
                    </span>
                  </div>
                </div>
              )}

              <div className="w-[1px] h-8 bg-luxury-border/30 hidden sm:block" />

              <div className="flex gap-4 text-xs text-gray-400 font-light">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })
                      : new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>{post.readingTime || 5} Min Read</span>
                </div>
              </div>
            </div>

            {/* Social Share Controls */}
            <div className="flex items-center gap-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-luxury-border/30 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300"
                title="Share on LinkedIn"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-luxury-border/30 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300"
                title="Tweet this article"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <button
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-full border border-luxury-border/30 flex items-center justify-center text-gray-400 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300 cursor-pointer bg-transparent"
                title="Copy link to clipboard"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>

              {copied && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg animate-fade-in font-medium select-none">
                  Link Copied!
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImage && (
          <section className="w-full aspect-[21/9] rounded-3xl overflow-hidden border border-luxury-border/20 relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </section>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Table of Contents / Sidebar (desktop only) */}
          <aside className="lg:col-span-1 space-y-8 sticky top-28 hidden lg:block select-none">
            {toc.length > 0 && (
              <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 space-y-4">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block border-b border-luxury-border/10 pb-2">
                  Dossier Index
                </span>
                <nav className="flex flex-col gap-3">
                  {toc.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className={cn(
                        "text-[11px] font-light leading-tight transition-colors duration-300 block hover:text-luxury-gold",
                        heading.level === 3 ? "pl-3 text-gray-500 border-l border-luxury-border/30" : "text-gray-300"
                      )}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Author Sidebar Details */}
            {author && (
              <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 space-y-4">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block border-b border-luxury-border/10 pb-2">
                  Advisory Author
                </span>
                <div className="space-y-3">
                  <h4 className="font-serif text-sm text-white">{author.name}</h4>
                  <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                    {author.bio || `${author.name} is a luxury advisory consultant at Luxespace Properties.`}
                  </p>
                  <Link href={`/agents/${author.slug}`}>
                    <Button variant="outline" className="w-full text-[9px] py-2 mt-2 uppercase tracking-widest">
                      Consultant Dossier
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </aside>

          {/* Compiled Markdown Body */}
          <article className="lg:col-span-3 prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:font-serif prose-headings:font-medium prose-a:text-luxury-gold hover:prose-a:text-white prose-a:transition-colors pb-16">
            {parseMarkdown(post.content)}
          </article>
        </div>

        {/* Dynamic Cross-Linking Section */}
        {(relatedPropertiesData.length > 0 || relatedCommunitiesData.length > 0 || relatedDevelopersData.length > 0) && (
          <section className="border-t border-luxury-border/20 pt-16 space-y-12 print:hidden">
            {/* Related Properties */}
            {relatedPropertiesData.length > 0 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Linked Portfolios</span>
                  <h3 className="font-serif text-2xl text-white mt-0.5">References in this Dossier</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPropertiesData.slice(0, 3).map((prop) => (
                    <PropertyCardLuxury key={prop.id} property={prop} />
                  ))}
                </div>
              </div>
            )}

            {/* Related Communities / Developers grid */}
            {(relatedCommunitiesData.length > 0 || relatedDevelopersData.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedCommunitiesData.length > 0 && (
                  <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-4">
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold block">Featured Districts</span>
                    <h4 className="font-serif text-lg text-white">Related Communities</h4>
                    <div className="divide-y divide-luxury-border/10">
                      {relatedCommunitiesData.map((c) => (
                        <Link
                          key={c.id}
                          href={`/communities/${c.slug}`}
                          className="flex items-center justify-between py-3 group hover:text-luxury-gold transition-colors text-xs text-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-gray-500 group-hover:text-luxury-gold transition-colors" />
                            <span>{c.name}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {relatedDevelopersData.length > 0 && (
                  <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-4">
                    <span className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold block">Elite Builders</span>
                    <h4 className="font-serif text-lg text-white">Related Developers</h4>
                    <div className="divide-y divide-luxury-border/10">
                      {relatedDevelopersData.map((d) => (
                        <Link
                          key={d.id}
                          href={`/developers/${d.slug}`}
                          className="flex items-center justify-between py-3 group hover:text-luxury-gold transition-colors text-xs text-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-luxury-gold transition-colors" />
                            <span>{d.name}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Article Navigation (Next / Prev) */}
        <section className="border-t border-b border-luxury-border/20 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 select-none print:hidden">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="flex items-center gap-3 group text-left">
              <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-luxury-gold transition-colors" />
              <div>
                <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block">Previous Article</span>
                <span className="text-xs text-white group-hover:text-luxury-gold transition-colors font-serif block mt-0.5 truncate max-w-[240px]">
                  {prevPost.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="opacity-0 hidden sm:block" />
          )}

          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="flex items-center gap-3 group text-right sm:text-right sm:flex-row-reverse">
              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-luxury-gold transition-colors" />
              <div>
                <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block">Next Article</span>
                <span className="text-xs text-white group-hover:text-luxury-gold transition-colors font-serif block mt-0.5 truncate max-w-[240px]">
                  {nextPost.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="opacity-0 hidden sm:block" />
          )}
        </section>

        {/* Newsletter Section */}
        <section className="pt-8 print:hidden">
          <NewsletterSection />
        </section>
      </div>
    </main>
  );
}
