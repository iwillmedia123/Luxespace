// Revert decrypted text animation
import { Metadata } from "next";
import Link from "next/link";
import { db, isSupabaseConfigured } from "@/lib/db";
import { Shield, Key, Landmark, BadgeCheck, Compass, HelpCircle } from "lucide-react";
import { Property, Community, BlogPost } from "@/types";
import HeroScroll from "@/components/layout/HeroScroll";
import PropertySearch from "@/components/layout/PropertySearch";
import PropertyCard from "@/components/cards/PropertyCard";
import CommunityCard from "@/components/cards/CommunityCard";
import BlogCard from "@/components/cards/BlogCard";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import StatsSection from "@/components/sections/StatsSection";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/layout/SectionHeading";
import SectionDivider from "@/components/layout/SectionDivider";
import AnimateIn from "@/components/motion/AnimateIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luxespace Properties | Ultra-Luxury Real Estate Dubai",
  description: "Exquisite luxury villas, penthouses, and signature apartments in prime Dubai locations. Buy, rent, or invest in prime locations.",
};

// Mock 8 Premium Properties using generated renders
const MOCK_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "The Royal Atlantis Penthouse",
    slug: "royal-atlantis-penthouse",
    description: "Ultra-luxury penthouse offering panoramic ocean views and private sky pool.",
    price: 48000000,
    type: "penthouse",
    status: "buy",
    completionStatus: "ready",
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 11500,
    location: "Palm Jumeirah, Dubai",
    communityId: "palm-jumeirah",
    agentId: "agent1",
    images: ["/assets/penthouse_render.webp"],
    amenities: ["Sky Pool", "Private Elevators", "Chef's Kitchen"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Signature Frond M Mansion",
    slug: "signature-frond-m-mansion",
    description: "Architectural masterpiece on Palm Jumeirah beach featuring floor-to-ceiling glass facades.",
    price: 65000000,
    type: "mansion",
    status: "buy",
    completionStatus: "ready",
    bedrooms: 6,
    bathrooms: 7,
    areaSqft: 14200,
    location: "Palm Jumeirah, Dubai",
    communityId: "palm-jumeirah",
    agentId: "agent2",
    images: ["/assets/villa_render.webp"],
    amenities: ["Beach Access", "Infinity Pool", "Home Cinema"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p3",
    title: "Dubai Hills Parkway Villa",
    slug: "dubai-hills-parkway-villa",
    description: "Bespoke contemporary estate looking directly onto the championship golf course greens.",
    price: 32000000,
    type: "villa",
    status: "buy",
    completionStatus: "ready",
    bedrooms: 5,
    bathrooms: 5,
    areaSqft: 9800,
    location: "Dubai Hills Estate, Dubai",
    communityId: "dubai-hills",
    agentId: "agent3",
    images: ["/assets/villa_render.webp"],
    amenities: ["Golf Views", "Wine Cellar", "Smart Home Systems"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p4",
    title: "Downtown Boulevard Residence",
    slug: "downtown-boulevard-residence",
    description: "High-floor signature apartment showcasing unobstructed views of the Burj Khalifa.",
    price: 12500000,
    type: "apartment",
    status: "buy",
    completionStatus: "ready",
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 3400,
    location: "Downtown Dubai, Dubai",
    communityId: "downtown-dubai",
    agentId: "agent1",
    images: ["/assets/apartment_render.webp"],
    amenities: ["Burj Views", "Concierge Service", "Private Lounge"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p5",
    title: "One Canal Sky Villa",
    slug: "one-canal-sky-villa",
    description: "Bespoke canal-side sky mansion featuring a private elevator and dynamic architectural curves.",
    price: 38000000,
    type: "penthouse",
    status: "off-plan",
    completionStatus: "under-construction",
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 8500,
    location: "Dubai Canal, Dubai",
    communityId: "business-bay",
    agentId: "agent2",
    images: ["/assets/penthouse_render.webp"],
    amenities: ["Canal Views", "Sky Garden", "Wellness Gym"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p6",
    title: "Jumeirah Bay Island Estate",
    slug: "jumeirah-bay-island-estate",
    description: "An ultra-exclusive beachfront residence on the Bulgari Resort island.",
    price: 85000000,
    type: "mansion",
    status: "buy",
    completionStatus: "ready",
    bedrooms: 6,
    bathrooms: 8,
    areaSqft: 15600,
    location: "Jumeirah Bay Island, Dubai",
    communityId: "jumeirah-bay",
    agentId: "agent3",
    images: ["/assets/villa_render.webp"],
    amenities: ["Private Beach", "Mooring Berth", "Bulgari Club Access"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p7",
    title: "Dubai Creek Heights Penthouse",
    slug: "dubai-creek-heights-penthouse",
    description: "Stunning penthouse in Creek Harbour boasting 360-degree city views and yacht marina outlooks.",
    price: 18000000,
    type: "penthouse",
    status: "buy",
    completionStatus: "ready",
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 6700,
    location: "Dubai Creek Harbour, Dubai",
    communityId: "dubai-creek-harbour",
    agentId: "agent1",
    images: ["/assets/penthouse_render.webp"],
    amenities: ["Marina Views", "Infinity Plunge Pool", "Outdoor Terrace"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p8",
    title: "Downtown Boulevard Studio Penthouse",
    slug: "downtown-boulevard-studio-penthouse",
    description: "Sophisticated luxury loft, fully furnished with Italian marbles and state-of-the-art automation.",
    price: 9800000,
    type: "apartment",
    status: "rent",
    completionStatus: "ready",
    bedrooms: 2,
    bathrooms: 3,
    areaSqft: 2800,
    location: "Downtown Dubai, Dubai",
    communityId: "downtown-dubai",
    agentId: "agent2",
    images: ["/assets/apartment_render.webp"],
    amenities: ["Gym & Spa", "Valet Parking", "24/7 Security"],
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock 8 Premium Communities
const MOCK_COMMUNITIES: Community[] = [
  {
    id: "c1",
    name: "Palm Jumeirah",
    slug: "palm-jumeirah",
    description: "World-renowned man-made archipelago offering signature beachfront mansions and ultra-luxury penthouses.",
    bannerUrl: "/assets/palm_jumeirah_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    name: "Downtown Dubai",
    slug: "downtown-dubai",
    description: "The heart of luxury city living, centered around the iconic Burj Khalifa, Dubai Mall, and Dubai Opera.",
    bannerUrl: "/assets/penthouse_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c3",
    name: "Dubai Hills Estate",
    slug: "dubai-hills-estate",
    description: "An elegant master-planned green oasis featuring championship golf courses, family parks, and bespoke modern villas.",
    bannerUrl: "/assets/villa_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c4",
    name: "Dubai Marina",
    slug: "dubai-marina",
    description: "Exquisite high-rise living with luxury yachts below, dining strips, and breathtaking coastal skyline silhouettes.",
    bannerUrl: "/assets/apartment_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c5",
    name: "Business Bay",
    slug: "business-bay",
    description: "Sophisticated canal-side penthouses and high-yield investment properties neighboring Downtown.",
    bannerUrl: "/assets/apartment_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c6",
    name: "Dubai Creek Harbour",
    slug: "dubai-creek-harbour",
    description: "A futuristic smart city fronting the historic creek, combining retail hubs, bird sanctuaries, and marina skylines.",
    bannerUrl: "/assets/apartment_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c7",
    name: "Arabian Ranches",
    slug: "arabian-ranches",
    description: "Premium desert-themed family neighborhoods offering spacious villas and beautiful equestrian facilities.",
    bannerUrl: "/assets/villa_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c8",
    name: "JVC (Jumeirah Village Circle)",
    slug: "jvc",
    description: "A fast-growing residential community offering exceptional rental yield profiles for savvy investors.",
    bannerUrl: "/assets/apartment_render.webp",
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock 4 Premium Blog Posts
const MOCK_BLOGS: BlogPost[] = [
  {
    id: "b1",
    title: "Dubai Q3 Luxury Real Estate Market Insights",
    slug: "dubai-q3-market-insights",
    summary: "An in-depth analysis of capital flows, buyer demographic shifts, and rental yield profiles across prime communities.",
    content: "Details...",
    coverImage: "/assets/apartment_render.webp",
    authorId: "author1",
    publishedAt: new Date().toISOString(),
    isPublished: true,
    status: "published",
    tags: ["Market Advisory", "Investment"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "b2",
    title: "The Rise of Signature Branded Residences in Dubai",
    slug: "branded-residences-rise",
    summary: "How ultra-luxury collaborations with fashion icons and hotel brands are redefining residential premiums.",
    content: "Details...",
    coverImage: "/assets/penthouse_render.webp",
    authorId: "author2",
    publishedAt: new Date().toISOString(),
    isPublished: true,
    status: "published",
    tags: ["Architecture", "Editorial"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "b3",
    title: "Tax Optimizations for HNWIs Investing in UAE Property",
    slug: "tax-optimizations-hnwi",
    summary: "Exploring corporate tax frameworks, double-taxation treaties, and the residency golden visa pipelines.",
    content: "Details...",
    coverImage: "/assets/villa_render.webp",
    authorId: "author1",
    publishedAt: new Date().toISOString(),
    isPublished: true,
    status: "published",
    tags: ["Legal", "Tax Advisory"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "b4",
    title: "Bespoke Landscaping Trends for Signature Palm Villas",
    slug: "palm-villa-landscaping-trends",
    summary: "Architectural landscaping, outdoor infinity-edge pool integrations, and private deck structures in beachfront fronds.",
    content: "Details...",
    coverImage: "/assets/palm_jumeirah_render.webp",
    authorId: "author3",
    publishedAt: new Date().toISOString(),
    isPublished: true,
    status: "published",
    tags: ["Design System", "Architecture"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function HomePage() {
  let propertiesToShow = MOCK_PROPERTIES;
  let latestPropertiesToShow = MOCK_PROPERTIES.slice(0, 4);
  let communitiesToShow = MOCK_COMMUNITIES;
  let blogsToShow = MOCK_BLOGS;

  try {
    const [featuredRes, newestRes, dbCommunities, dbBlogsRes] = await Promise.all([
      db.getPropertiesByFilters({ isFeatured: true, limit: 4, isSummary: true }),
      db.getPropertiesByFilters({ sort: "newest", limit: 4, isSummary: true }),
      db.getCommunities({ isFeatured: true, isSummary: true, limit: 4 }),
      db.getBlogsByFilters({ status: "published", isSummary: true, limit: 4 }),
    ]);

    const dbProperties = featuredRes.properties;
    const dbLatestProperties = newestRes.properties;
    const featuredComms = dbCommunities || [];
    const dbBlogs = dbBlogsRes.blogs;

    const isDb = isSupabaseConfigured();

    if (isDb) {
      propertiesToShow = dbProperties || [];
      latestPropertiesToShow = dbLatestProperties || [];
      communitiesToShow = featuredComms.slice(0, 4);
      blogsToShow = (dbBlogs || []).slice(0, 4);
    } else {
      if (dbProperties && dbProperties.length > 0) {
        propertiesToShow = dbProperties;
      }
      if (dbLatestProperties && dbLatestProperties.length > 0) {
        latestPropertiesToShow = dbLatestProperties;
      }
      if (featuredComms.length > 0) {
        communitiesToShow = featuredComms.slice(0, 4);
      }
      if (dbBlogs && dbBlogs.length > 0) {
        blogsToShow = dbBlogs.slice(0, 4);
      }
    }
  } catch (err) {
    console.error("Error loading homepage dynamic data:", err);
  }

  return (
    <div className="w-full bg-luxury-charcoal">
      {/* Cinematic Apple-style Scroll Hero Section */}
      <HeroScroll />

      {/* Property Search Finder Section */}
      <PropertySearch />

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-luxury-border/20 pb-8 mb-12">
          <SectionHeading
            subtitle="Exclusive Collection"
            title="Featured Residences"
            description="Explore our hand-picked portfolio of signature penthouses, beachfront estates, and high-yield luxury residences in Dubai."
          />
          <Link href="/properties" className="mt-6 md:mt-0">
            <Button
              variant="outline"
              className="border-white/20 hover:border-luxury-gold hover:text-luxury-gold"
            >
              View All Portfolios
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {propertiesToShow.map((property) => (
            <AnimateIn key={property.id} preset="fade-up" duration={0.85}>
              <PropertyCard property={property} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* Latest Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-luxury-border/20 pb-8 mb-12">
          <SectionHeading
            subtitle="Newly Added"
            title="Latest Projects"
            description="Explore our most recently listed ultra-luxury residences and off-plan assets in premium Dubai addresses."
          />
          <Link href="/properties" className="mt-6 md:mt-0">
            <Button
              variant="outline"
              className="border-white/20 hover:border-luxury-gold hover:text-luxury-gold"
            >
              View Latest Additions
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestPropertiesToShow.map((property) => (
            <AnimateIn key={property.id} preset="fade-up" duration={0.85}>
              <PropertyCard property={property} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* Prime Communities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-luxury-border/20 pb-8 mb-12">
          <SectionHeading
            subtitle="Location Portfolios"
            title="Prime Communities"
            description="Discover Dubai's most exclusive coordinates, offering upscale residential pockets, private marinas, and golf enclaves."
          />
          <Link href="/communities" className="mt-6 md:mt-0">
            <Button
              variant="outline"
              className="border-white/20 hover:border-luxury-gold hover:text-luxury-gold"
            >
              Explore All Locations
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {communitiesToShow.map((community, i) => (
            <AnimateIn key={community.id} preset="zoom-reveal" delay={i * 0.05} duration={0.9}>
              <CommunityCard community={community} propertiesCount={10 + i * 4} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36 space-y-16">
        <div className="text-center">
          <SectionHeading
            align="center"
            subtitle="Private Office Client Care"
            title="The Luxespace Standard"
            description="We bridge capital with premier luxury developers, delivering bespoke brokerage capabilities built on precision, discretion, and analytics."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <AnimateIn preset="fade-up" delay={0.05} className="bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
              <Shield className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Transparency
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              We believe informed clients make confident decisions, so we share the full picture — trade-offs included.
            </Typography>
          </AnimateIn>

          {/* Card 2 */}
          <AnimateIn preset="fade-up" delay={0.1} className="bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
              <Key className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Expertise
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Every recommendation is supported by research, not intuition or inventory pressure.
            </Typography>
          </AnimateIn>

          {/* Card 3 */}
          <AnimateIn preset="fade-up" delay={0.15} className="bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
              <Landmark className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Relationships
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Our success is measured by lifelong clients, not one-time transactions.
            </Typography>
          </AnimateIn>

          {/* Card 4 */}
          <AnimateIn preset="fade-up" delay={0.2} className="bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Accountability
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              We stand behind every recommendation we make, before and after the sale.
            </Typography>
          </AnimateIn>

          {/* Card 5 */}
          <AnimateIn preset="fade-up" delay={0.25} className="bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
              <Compass className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Excellence
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Every interaction reflects professionalism, precision, and attention to detail.
            </Typography>
          </AnimateIn>

          {/* Card 6 */}
          <AnimateIn preset="fade-up" delay={0.3} className="bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/40 transition-colors duration-300">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold">
              <HelpCircle className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Integrity
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              We recommend what benefits our clients — not what benefits us.
            </Typography>
          </AnimateIn>
        </div>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* Animated Brand Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36">
        <AnimateIn preset="scale-in" duration={1.0}>
          <StatsSection />
        </AnimateIn>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* Client Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36">
        <AnimateIn preset="fade-up" duration={0.95}>
          <TestimonialsCarousel />
        </AnimateIn>
      </section>

      {/* Section Divider */}
      <SectionDivider />

      {/* Editorial Blog / News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-36">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-luxury-border/20 pb-8 mb-12">
          <SectionHeading
            subtitle="Advisory & Insights"
            title="Editorial Intelligence"
            description="Explore our curated market insights, legal structuring advice, and design spotlights in Dubai's real estate domain."
          />
          <Link href="/blog" className="mt-6 md:mt-0">
            <Button
              variant="outline"
              className="border-white/20 hover:border-luxury-gold hover:text-luxury-gold"
            >
              Read All Publications
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogsToShow.map((post) => (
            <AnimateIn key={post.id} preset="fade-up" duration={0.85}>
              <BlogCard post={post} />
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* Bottom CTA Full-Width Banner */}
      <section className="relative w-full py-36 px-4 bg-luxury-dark border-t border-luxury-border/30 overflow-hidden">
        {/* Subtle gold decoration circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-luxury-gold/[0.02] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <Typography variant="subheading" className="text-luxury-gold tracking-widest block">
              Private Allocation Inquiries
            </Typography>
            <Typography variant="section" as="h2" className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white">
              Ready to Discover Your<br />Next Luxury Property?
            </Typography>
            <Typography variant="body" className="max-w-xl mx-auto text-gray-400 font-light text-xs sm:text-sm">
              Connect with our private office specialists to receive bespoke investment options, off-market catalogs, or schedule a virtual walkthrough.
            </Typography>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/properties" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(241,217,155,0.25)] transition-all duration-300"
              >
                Explore Properties
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/20 hover:border-luxury-gold hover:text-luxury-gold hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300"
              >
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
