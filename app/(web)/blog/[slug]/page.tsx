"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronRight, Calendar, Clock, Share2, Link2, 
  ChevronLeft, Building2, MapPin, ArrowRight, ShieldCheck, 
  Mail, ArrowUpRight 
} from "lucide-react";
import { db } from "@/lib/db";
import { BlogPost, Agent, Property, Community, Developer } from "@/types";
import { parseMarkdown } from "@/lib/markdown";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import NewsletterSection from "@/components/layout/NewsletterSection";

export default function BlogDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<Agent | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [relatedPropertiesData, setRelatedPropertiesData] = useState<Property[]>([]);
  const [relatedCommunitiesData, setRelatedCommunitiesData] = useState<Community[]>([]);
  const [relatedDevelopersData, setRelatedDevelopersData] = useState<Developer[]>([]);

  useEffect(() => {
    async function loadDetail() {
      try {
        const [blogsList, agentsList, propsList, commsList, devsList] = await Promise.all([
          db.getBlogs(),
          db.getAgents(),
          db.getProperties(),
          db.getCommunities(),
          db.getDevelopers(),
        ]);

        const currentPost = blogsList.find((b) => b.slug === slug);
        if (!currentPost) {
          setLoading(false);
          return;
        }

        setPost(currentPost);
        setAllBlogs(blogsList.filter(b => b.status === "published" || b.isPublished));

        // Author
        const currentAuthor = agentsList.find((a) => a.id === currentPost.authorId);
        if (currentAuthor) setAuthor(currentAuthor);

        // Related properties
        if (currentPost.relatedProperties && currentPost.relatedProperties.length > 0) {
          const matchedProps = propsList.filter((p) => currentPost.relatedProperties!.includes(p.id));
          setRelatedPropertiesData(matchedProps);
        }

        // Related communities
        if (currentPost.relatedCommunities && currentPost.relatedCommunities.length > 0) {
          const matchedComms = commsList.filter((c) => currentPost.relatedCommunities!.includes(c.id));
          setRelatedCommunitiesData(matchedComms);
        }

        // Related developers
        if (currentPost.relatedDevelopers && currentPost.relatedDevelopers.length > 0) {
          const matchedDevs = devsList.filter((d) => currentPost.relatedDevelopers!.includes(d.id));
          setRelatedDevelopersData(matchedDevs);
        }
      } catch (err) {
        console.error("Error loading blog details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f232c] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-light tracking-wider uppercase">Loading Dossier...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#1f232c] flex flex-col items-center justify-center space-y-6 px-4">
        <h1 className="text-2xl font-serif text-white">Publication Dossier Not Found</h1>
        <p className="text-xs text-gray-400 font-light max-w-sm text-center">
          The requested luxury journal article could not be resolved in our databases.
        </p>
        <Link href="/blog">
          <Button variant="primary" className="text-xs">
            Return to Journal
          </Button>
        </Link>
      </div>
    );
  }

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
    alert("Article dossier link copied to clipboard!");
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": author?.name || "Luxespace Advisory",
      "jobTitle": author?.title || "Luxury Property Consultant",
      "url": author ? `https://luxespace.ae/agents/${author.slug}` : undefined,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Luxespace Properties",
      "logo": {
        "@type": "ImageObject",
        "url": "https://luxespace.ae/assets/logo.png"
      }
    },
    "description": post.summary
  };

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 relative overflow-hidden">
      {/* Dynamic JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                  <div className="w-10 h-10 rounded-full bg-luxury-charcoal flex items-center justify-center border border-luxury-border/30">
                    <Building2 className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block leading-tight">Luxespace Private Office</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Editorial Advisory</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-luxury-gold" />
                <span>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-luxury-gold" />
                <span>{post.readingTime || 5} Min Read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImage && (
          <section className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-luxury-border/30 shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </section>
        )}

        {/* Article content with Table of Contents sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
          
          {/* Table of Contents / Sidebar (desktop only) */}
          <aside className="lg:col-span-3 space-y-8 select-none hidden lg:block sticky top-28 bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5">
            {toc.length > 0 && (
              <div className="space-y-4">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block border-b border-luxury-border/10 pb-2">
                  Table of Contents
                </span>
                <nav className="flex flex-col gap-2.5">
                  {toc.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        const el = document.getElementById(t.id);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                      className={`text-left text-[10px] font-light leading-relaxed uppercase tracking-wider hover:text-luxury-gold transition-colors ${
                        t.level === 3 ? "pl-3 text-gray-500" : "text-gray-300 font-semibold"
                      }`}
                    >
                      {t.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Social Share */}
            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block border-b border-luxury-border/10 pb-2">
                Share Dossier
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank")}
                  className="w-8 h-8 rounded-lg bg-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal text-gray-400 flex items-center justify-center transition-all cursor-pointer"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, "_blank")}
                  className="w-8 h-8 rounded-lg bg-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal text-gray-400 flex items-center justify-center transition-all cursor-pointer"
                  title="X (Twitter)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank")}
                  className="w-8 h-8 rounded-lg bg-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal text-gray-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-8 h-8 rounded-lg bg-luxury-charcoal hover:bg-luxury-gold hover:text-luxury-charcoal text-gray-400 flex items-center justify-center transition-all cursor-pointer"
                  title="Copy Link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Article Body */}
          <article className="lg:col-span-9 space-y-12">
            <div className="prose prose-invert max-w-none text-gray-300 font-light leading-relaxed">
              {parseMarkdown(post.content)}
            </div>

            {/* Related tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-luxury-border/20 pt-6 select-none">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-widest bg-luxury-charcoal text-gray-400 px-3 py-1.5 rounded-lg border border-luxury-border/20 font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author details box */}
            {author && (
              <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start select-none">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-luxury-border/30 shrink-0 relative">
                  <img
                    src={author.avatarUrl || "/assets/agent_1.png"}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 text-center sm:text-left flex-grow">
                  <div>
                    <h3 className="font-serif text-lg text-white font-medium">{author.name}</h3>
                    <p className="text-[10px] text-luxury-gold uppercase tracking-wider font-semibold">{author.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xl">
                    {author.bio || `Specialized advisor in high-yield luxury listings across prime locations in Dubai.`}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                    <Link href={`/agents/${author.slug}`}>
                      <Button variant="outline" className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider py-1.5 px-4">
                        <span>Consult Advisor Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-luxury-gold" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Next / Prev article navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-luxury-border/20 pt-8 select-none">
              {prevPost ? (
                <Link href={`/blog/${prevPost.slug}`} className="group p-5 bg-luxury-dark border border-luxury-border/30 rounded-2xl hover:border-luxury-gold/20 transition-all flex flex-col justify-between">
                  <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Previous Dossier</span>
                  <span className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link href={`/blog/${nextPost.slug}`} className="group p-5 bg-luxury-dark border border-luxury-border/30 rounded-2xl hover:border-luxury-gold/20 transition-all flex flex-col justify-between text-right items-end">
                  <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Next Dossier</span>
                  <span className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
                    {nextPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </article>
        </section>

        {/* Related properties */}
        {relatedPropertiesData.length > 0 && (
          <section className="space-y-6 border-t border-luxury-border/20 pt-12">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Luxury Real Estate</span>
              <h2 className="text-2xl font-serif text-white">Related Portfolio Listings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPropertiesData.slice(0, 3).map((property) => (
                <PropertyCardLuxury key={property.id} property={property} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        {/* Related communities */}
        {relatedCommunitiesData.length > 0 && (
          <section className="space-y-6 border-t border-luxury-border/20 pt-12">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Location dossiers</span>
              <h2 className="text-2xl font-serif text-white">Featured Communities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
              {relatedCommunitiesData.slice(0, 3).map((comm) => (
                <Link href={`/communities/${comm.slug}`} key={comm.id}>
                  <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-luxury-charcoal relative overflow-hidden shrink-0">
                      <Image
                        src={comm.bannerUrl || "/assets/apartment_render.png"}
                        alt={comm.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                        {comm.name}
                      </h4>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                        <span>Explore Community</span>
                        <ChevronRight className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related developers */}
        {relatedDevelopersData.length > 0 && (
          <section className="space-y-6 border-t border-luxury-border/20 pt-12">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Architectural Partners</span>
              <h2 className="text-2xl font-serif text-white">Featured Developers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
              {relatedDevelopersData.slice(0, 3).map((dev) => (
                <Link href={`/developers/${dev.slug}`} key={dev.id}>
                  <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white border border-luxury-border/30 flex items-center justify-center p-2 shrink-0">
                      {dev.logoUrl && dev.logoUrl.startsWith("http") ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={dev.logoUrl}
                            alt={dev.name}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <Building2 className="w-8 h-8 text-luxury-charcoal" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                        {dev.name}
                      </h4>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                        <span>Explore Developer</span>
                        <ChevronRight className="w-3 h-3" />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Comments Disabled Notice */}
        <section className="bg-luxury-dark/40 border border-luxury-border/10 rounded-2xl p-4 text-center select-none">
          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-medium">
            Comments are disabled for publication confidentiality.
          </p>
        </section>

        {/* Newsletter subscription box */}
        <NewsletterSection className="mt-16" />
      </div>
    </main>
  );
}
