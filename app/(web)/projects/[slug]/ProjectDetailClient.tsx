"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, MapPin, Calendar, Layers, FileDown, 
  Share2, ChevronRight, CheckCircle2, ChevronDown, ChevronUp, 
  Phone, MessageSquare, Clock, Shield, Sparkles, Award,
  ArrowRight, Check
} from "lucide-react";
import { Project, Agent } from "@/types";
import { formatAED } from "@/lib/utils";
import { db } from "@/lib/db";

interface ProjectDetailClientProps {
  project: Project;
  assignedAgent?: Agent | null;
  relatedProjects?: Project[];
}

export default function ProjectDetailClient({
  project,
  assignedAgent,
  relatedProjects = [],
}: ProjectDetailClientProps) {
  // Gallery active index
  const allImages = [project.coverImage, ...(project.gallery || [])].filter(Boolean);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // FAQ Accordion State (first FAQ open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(
    project.units && project.units.length > 0 ? project.units[0].typology : "General Inquiry"
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  // Share link feedback toast
  const [copiedLink, setCopiedLink] = useState(false);

  // Ref to form for smooth scroll
  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 500);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.headline || `Explore ${project.title} on Luxespace Properties`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share cancelled
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const triggerPdfDownload = () => {
    if (project.pdfBrochureUrl) {
      // If it's a data URL or real link, trigger download
      const link = document.createElement("a");
      link.href = project.pdfBrochureUrl;
      link.download = project.pdfBrochureName || `${project.slug}-official-brochure.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError("Please enter your name, email, and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(" ") || "";

      await db.createLead({
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim(),
        source: `Project Dossier: ${project.title}`,
        status: "new",
        notes: `Inquiry for ${project.title}\nSelected Typology: ${selectedUnit}\nClient Notes: ${message || "Requested official PDF brochure"}`,
      });

      setIsSubmitted(true);
      // Trigger brochure download automatically if available
      triggerPdfDownload();
    } catch (err: unknown) {
      console.error("Lead submission error:", err);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again or contact us via WhatsApp.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Luxespace, I'm inquiring about ${project.title} (${formatAED(project.startingPrice)}). Please share availability and floor plans.`
  );
  const whatsappUrl = `https://wa.me/971501348020?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-luxury-dark text-white selection:bg-luxury-gold selection:text-luxury-charcoal">
      {/* Top Sticky Action Bar */}
      <div className="sticky top-0 z-40 bg-luxury-dark/95 backdrop-blur-md border-b border-luxury-border/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/projects"
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-luxury-gold flex items-center gap-1 shrink-0"
            >
              <span>Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="font-serif text-sm sm:text-base text-white truncate font-medium">
              {project.title}
            </span>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 shrink-0">
              From {formatAED(project.startingPrice)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleShare}
              title="Share Project"
              className="px-3 py-2 rounded-lg border border-luxury-border/50 hover:border-luxury-gold text-gray-300 hover:text-luxury-gold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold tracking-wide transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Speak to Advisor</span>
            </a>

            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-luxury-gold/20 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Brochure</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-luxury-gold truncate">{project.title}</span>
        </div>

        {/* Hero Title & Subheading */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-luxury-gold text-luxury-charcoal">
              {project.status === "pre-launch" ? "Pre-Launch Exclusive" : project.status.toUpperCase()}
            </span>
            {project.developerName && (
              <span className="px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide bg-luxury-charcoal/80 text-luxury-gold border border-luxury-gold/30 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {project.developerName}
              </span>
            )}
            <span className="px-3 py-1 rounded-md text-[11px] font-medium text-gray-300 bg-luxury-charcoal/60 border border-luxury-border/40 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-luxury-gold" />
              {project.location}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
            {project.title}
          </h1>

          {project.headline && (
            <p className="mt-3 text-lg sm:text-xl text-gray-300 font-light leading-relaxed max-w-4xl">
              {project.headline}
            </p>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase font-medium bg-luxury-dark border border-luxury-border/40 text-gray-400"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Gallery / Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Visual Display */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-luxury-charcoal/40 border border-luxury-border/40 shadow-2xl">
              <Image
                src={allImages[activeImageIndex] || "/assets/apartment_render.webp"}
                alt={`${project.title} Render ${activeImageIndex + 1}`}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Status pill on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 font-medium">
                  {project.propertyType || "Luxury Residences"}
                </span>
                <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-gray-300">
                  Image {activeImageIndex + 1} of {allImages.length}
                </span>
              </div>
            </div>

            {/* Thumbnails row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-luxury-gold shadow-md shadow-luxury-gold/20 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Facts & Direct Action Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-luxury-charcoal/50 border border-luxury-border/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-luxury-gold font-bold block mb-1">
                Official Launch Dossier
              </span>
              <p className="font-serif text-3xl sm:text-4xl text-luxury-gold font-normal">
                {formatAED(project.startingPrice)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Starting Price (Subject to unit selection)</p>
            </div>

            {/* Fast Summary Specs */}
            <div className="space-y-3.5 border-y border-luxury-border/30 py-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-luxury-gold" /> Developer:
                </span>
                <span className="font-medium text-white">{project.developerName || "Nakheel"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-luxury-gold" /> Location:
                </span>
                <span className="font-medium text-white">{project.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-luxury-gold" /> Estimated Handover:
                </span>
                <span className="font-medium text-white">{project.handoverDate || "TBA"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-luxury-gold" /> Payment Structure:
                </span>
                <span className="font-medium text-luxury-gold">{project.paymentPlanSummary || "Flexible"}</span>
              </div>
            </div>

            {/* PDF Brochure Card inside panel */}
            <div className="bg-luxury-dark/90 border border-luxury-gold/30 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold shrink-0">
                  <FileDown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Project PDF
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {project.pdfBrochureName || "Palm-Springs-Nakheel-Brochure.pdf"}
                  </p>
                  <span className="inline-block mt-1 text-[10px] text-luxury-gold font-medium">
                    Size: {project.pdfBrochureSize || "Official (Under 20MB)"}
                  </span>
                </div>
              </div>

              <button
                onClick={scrollToForm}
                className="w-full py-2.5 px-4 rounded-lg bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Instant PDF Download</span>
              </button>
            </div>

            {/* Direct Advisor WhatsApp Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp with Advisor</span>
            </a>
          </div>
        </div>

        {/* Content Layout: 8 cols details, 4 cols sidebar form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Dossier Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-14">

            {/* SECTION 1: Key Facts Table */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-luxury-gold" />
                <h2 className="font-serif text-2xl text-white font-normal">
                  Key Facts &amp; Development Overview
                </h2>
              </div>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                Summary of the master development parameters, developer pedigree, and release milestone framework.
              </p>

              <div className="overflow-x-auto border border-luxury-border/40 rounded-xl bg-luxury-charcoal/30">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-luxury-border/30">
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 w-1/3 bg-luxury-dark/40">Developer</td>
                      <td className="py-3.5 px-4 text-white font-medium">{project.developerName || "Nakheel"}</td>
                    </tr>
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 bg-luxury-dark/40">Location &amp; District</td>
                      <td className="py-3.5 px-4 text-white font-medium">{project.location}</td>
                    </tr>
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 bg-luxury-dark/40">Project Typology</td>
                      <td className="py-3.5 px-4 text-white font-medium">{project.propertyType}</td>
                    </tr>
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 bg-luxury-dark/40">Starting Price</td>
                      <td className="py-3.5 px-4 text-luxury-gold font-bold">{formatAED(project.startingPrice)}</td>
                    </tr>
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 bg-luxury-dark/40">Payment Plan</td>
                      <td className="py-3.5 px-4 text-white font-medium">{project.paymentPlanSummary || "60/40 Construction-linked"}</td>
                    </tr>
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 bg-luxury-dark/40">Expected Handover</td>
                      <td className="py-3.5 px-4 text-white font-medium">{project.handoverDate || "October 2030"}</td>
                    </tr>
                    <tr className="hover:bg-luxury-charcoal/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-400 bg-luxury-dark/40">Status</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold uppercase">{project.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 2: Units, Sizes & Pricing Table */}
            {project.units && project.units.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-luxury-gold" />
                    <h2 className="font-serif text-2xl text-white font-normal">
                      Pricing, Typologies &amp; Square Footage
                    </h2>
                  </div>
                  <span className="text-[11px] text-gray-400 hidden sm:inline">
                    Updated Launch Allocation
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Official breakdown of unit layouts, gross built-up areas (BUA), plot allowances, and square-footage rates.
                </p>

                <div className="overflow-x-auto border border-luxury-border/40 rounded-xl bg-luxury-charcoal/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-luxury-charcoal/80 text-luxury-gold uppercase text-[10px] tracking-wider border-b border-luxury-border/40">
                      <tr>
                        <th className="py-3 px-4">Typology</th>
                        <th className="py-3 px-4">Starting Price</th>
                        <th className="py-3 px-4">BUA (sq ft)</th>
                        <th className="py-3 px-4">Plot Area (sq ft)</th>
                        <th className="py-3 px-4">AED / sq ft</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-border/20">
                      {project.units.map((unit, idx) => (
                        <tr key={idx} className="hover:bg-luxury-charcoal/50 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-white">{unit.typology}</td>
                          <td className="py-3.5 px-4 font-bold text-luxury-gold">
                            {typeof unit.startingPrice === "number" ? formatAED(unit.startingPrice) : unit.startingPrice}
                          </td>
                          <td className="py-3.5 px-4 text-gray-300">{unit.buaSqft || "—"}</td>
                          <td className="py-3.5 px-4 text-gray-300">{unit.plotSqft || "—"}</td>
                          <td className="py-3.5 px-4 text-gray-400">{unit.pricePerSqftBua || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 italic">
                  * Note: Square footage and pricing are developer-subject to allocation tiers. Final sizes confirmed on issuance of SPA.
                </p>
              </section>
            )}

            {/* SECTION 3: Payment Plan Milestones Table */}
            {project.paymentPlan && project.paymentPlan.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-luxury-gold" />
                  <h2 className="font-serif text-2xl text-white font-normal">
                    Structured Payment Schedule
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Construction-linked milestone disbursement plan designed for optimal cash-flow and capital preservation.
                </p>

                <div className="overflow-x-auto border border-luxury-border/40 rounded-xl bg-luxury-charcoal/30">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-luxury-charcoal/80 text-luxury-gold uppercase text-[10px] tracking-wider border-b border-luxury-border/40">
                      <tr>
                        <th className="py-3 px-4">Milestone</th>
                        <th className="py-3 px-4">Share (%)</th>
                        <th className="py-3 px-4">Due Timing / Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-border/20">
                      {project.paymentPlan.map((milestone, idx) => (
                        <tr key={idx} className="hover:bg-luxury-charcoal/50 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-white">{milestone.milestone}</td>
                          <td className="py-3.5 px-4 font-bold text-luxury-gold">
                            {milestone.sharePercentage}%
                          </td>
                          <td className="py-3.5 px-4 text-gray-300">{milestone.timing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SECTION 4: Location & Drive Times */}
            {project.driveTimes && project.driveTimes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-luxury-gold" />
                  <h2 className="font-serif text-2xl text-white font-normal">
                    Strategic Connectivity &amp; Transit Times
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Direct connectivity to Dubai&apos;s key transit arteries, business hubs, international airports, and leisure destinations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.driveTimes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-luxury-charcoal/40 border border-luxury-border/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-white font-medium">{item.destination}</span>
                      </div>
                      <span className="font-serif text-sm text-luxury-gold font-semibold">{item.time}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 5: Editorial Content / Description */}
            {project.content && (
              <section className="prose prose-invert max-w-none">
                <div className="flex items-center gap-2 mb-6 not-prose">
                  <Sparkles className="w-4 h-4 text-luxury-gold" />
                  <h2 className="font-serif text-2xl text-white font-normal">
                    Architectural Vision &amp; Master Community
                  </h2>
                </div>
                <div 
                  className="text-gray-300 text-sm leading-relaxed space-y-4 font-light whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </section>
            )}

            {/* SECTION 6: Master Plan Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-luxury-gold" />
                  <h2 className="font-serif text-2xl text-white font-normal">
                    Exclusive Lifestyle Amenities &amp; Private Clubs
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Curated world-class facilities dedicated exclusively to the residents of {project.title}.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-luxury-charcoal/40 border border-luxury-border/30 flex items-center gap-2.5 text-xs text-gray-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 7: Interactive FAQ Accordion */}
            {project.faqs && project.faqs.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-luxury-gold" />
                  <h2 className="font-serif text-2xl text-white font-normal">
                    Frequently Asked Questions
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Essential regulatory, financial, and procedural inquiries regarding acquiring off-plan units in {project.title}.
                </p>

                <div className="space-y-3">
                  {project.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-luxury-border/30 bg-luxury-charcoal/30 overflow-hidden transition-colors"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full py-4 px-5 flex items-center justify-between text-left text-sm font-medium text-white hover:text-luxury-gold transition-colors cursor-pointer"
                        >
                          <span className="pr-4">{faq.question}</span>
                          <span className="p-1 rounded bg-luxury-dark/60 text-luxury-gold shrink-0">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-xs text-gray-300 font-light leading-relaxed border-t border-luxury-border/20 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sticky Sidebar Form (#Form-advisor) (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div
              id="Form-advisor"
              ref={formRef}
              className="sticky top-24 bg-luxury-charcoal/80 border border-luxury-gold/40 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-luxury-gold/15 text-luxury-gold text-[10px] uppercase font-bold tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>VIP Pre-Launch Registration</span>
                </div>
                <h3 className="font-serif text-2xl text-white font-normal">
                  Download Dossier &amp; Price Sheet
                </h3>
                <p className="text-xs text-gray-300 font-light mt-2 leading-relaxed">
                  Submit your inquiry to automatically receive the official 20MB brochure and reserve priority unit allocations.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded-xl bg-luxury-gold/10 border border-luxury-gold/40 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-luxury-gold text-luxury-charcoal mx-auto flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-lg text-white">Inquiry Registered</h4>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    Thank you, {name}. Your inquiry for <strong>{project.title}</strong> has been logged with our senior client desk.
                  </p>
                  {project.pdfBrochureUrl && (
                    <div className="pt-2">
                      <button
                        onClick={triggerPdfDownload}
                        className="w-full py-2.5 px-4 rounded-lg bg-luxury-gold text-luxury-charcoal font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Download PDF Again</span>
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => { setIsSubmitted(false); }}
                    className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                      Full Name *
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Vance"
                      className="w-full px-3.5 py-2.5 bg-luxury-dark border border-luxury-border/50 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@investments.com"
                      className="w-full px-3.5 py-2.5 bg-luxury-dark border border-luxury-border/50 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full px-3.5 py-2.5 bg-luxury-dark border border-luxury-border/50 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold transition-colors"
                    />
                  </div>

                  {project.units && project.units.length > 0 && (
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                        Preferred Typology
                      </label>
                      <select
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-luxury-dark border border-luxury-border/50 rounded-lg text-xs text-white focus:outline-none focus:border-luxury-gold cursor-pointer"
                      >
                        {project.units.map((u, i) => (
                          <option key={i} value={u.typology}>
                            {u.typology} — {typeof u.startingPrice === "number" ? formatAED(u.startingPrice) : u.startingPrice}
                          </option>
                        ))}
                        <option value="General Investment Consultation">General Investment Consultation</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
                      Message / Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify your investment horizon, mortgage or cash preference..."
                      className="w-full px-3.5 py-2.5 bg-luxury-dark border border-luxury-border/50 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-lg bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Registering &amp; Preparing PDF...</span>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>Register &amp; Get Official PDF</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-500 text-center">
                    🔒 Strict Confidentiality. Your details will never be sold or shared.
                  </p>
                </form>
              )}

              {/* Assigned Advisor Section */}
              <div className="pt-4 border-t border-luxury-border/30">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-3 font-semibold">
                  Dedicated Project Specialist
                </span>
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-luxury-dark border border-luxury-gold/30 shrink-0">
                    <Image
                      src={assignedAgent?.avatarUrl || "/assets/agent1.webp"}
                      alt={assignedAgent?.name || "Luxespace Senior Advisor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">
                      {assignedAgent?.name || "Sophia Sterling"}
                    </h4>
                    <p className="text-[11px] text-luxury-gold">
                      {assignedAgent?.title || "Director of Off-Plan Acquisitions"}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Direct: {assignedAgent?.phone || "+971 50 134 8020"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-lg bg-luxury-dark hover:bg-luxury-charcoal border border-luxury-border/40 hover:border-luxury-gold text-xs text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${assignedAgent?.phone || "+971501348020"}`}
                    className="flex-1 py-2 px-3 rounded-lg bg-luxury-dark hover:bg-luxury-charcoal border border-luxury-border/40 hover:border-luxury-gold text-xs text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 8: Related Developments */}
        {relatedProjects.length > 0 && (
          <div className="mt-24 pt-12 border-t border-luxury-border/30">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-bold block mb-1">
                  Similar Opportunities
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white">
                  Other Curated Off-Plan Developments
                </h3>
              </div>
              <Link
                href="/projects"
                className="text-xs uppercase tracking-widest text-luxury-gold hover:text-white font-bold flex items-center gap-1"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/projects/${rel.slug}`}
                  className="group bg-luxury-charcoal/40 border border-luxury-border/30 rounded-xl overflow-hidden hover:border-luxury-gold/50 transition-all"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-luxury-dark">
                    <Image
                      src={rel.coverImage || "/assets/apartment_render.webp"}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-luxury-charcoal/90 px-2 py-0.5 rounded text-[10px] text-luxury-gold font-semibold uppercase">
                      {rel.status}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] text-gray-400 block">{rel.location}</span>
                    <h4 className="font-serif text-base text-white group-hover:text-luxury-gold transition-colors line-clamp-1">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-luxury-gold font-semibold">
                      From {formatAED(rel.startingPrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
