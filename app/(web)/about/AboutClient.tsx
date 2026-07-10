"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  Key,
  Landmark,
  TrendingUp,
  Building2,
  FileSearch,
  PieChart,
  LineChart,
  Home,
  Paintbrush,
  Armchair,
  Calculator,
  FileText,
  ClipboardCheck,
  Briefcase
} from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/layout/SectionHeading";
import SectionDivider from "@/components/layout/SectionDivider";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  staggerCards,
  drawLine,
  splitHeadingReveal,
  parallaxImage,
  magneticHover
} from "@/lib/motion";

export default function AboutClient() {
  // Page entry & Cursor Refs
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  // Hero Refs
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroParagraphRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);

  // Who We Are Refs
  const whoSectionRef = useRef<HTMLDivElement>(null);
  const whoImageRef = useRef<HTMLDivElement>(null);
  const whoContentRef = useRef<HTMLDivElement>(null);
  const whoDividerRef = useRef<HTMLDivElement>(null);
  const whoTitleRef = useRef<HTMLHeadingElement>(null);

  // Why We Exist Refs
  const existSectionRef = useRef<HTMLDivElement>(null);
  const existGridRef = useRef<HTMLDivElement>(null);

  // Challenge vs Solution Refs
  const challengeSectionRef = useRef<HTMLDivElement>(null);
  const challengeCardRef = useRef<HTMLDivElement>(null);
  const solutionCardRef = useRef<HTMLDivElement>(null);
  const challengeDividerRef = useRef<HTMLDivElement>(null);

  // Vision & Mission Refs
  const visionSectionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionDividerRef = useRef<HTMLDivElement>(null);
  const visionCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCleanupRef = useRef<(() => void) | null>(null);

  // Our Story Refs
  const storySectionRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const storyBgRef = useRef<HTMLImageElement>(null);
  const storyHeadingRef = useRef<HTMLHeadingElement>(null);
  const storyReadingProgressRef = useRef<HTMLDivElement>(null);
  const storyTitleRef = useRef<HTMLHeadingElement>(null);

  // What We Do Refs
  const whatSectionRef = useRef<HTMLDivElement>(null);
  const whatGridRef = useRef<HTMLDivElement>(null);

  // 10-Step Process Refs
  const processSectionRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // CTA Refs
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const ctaBgRef = useRef<HTMLImageElement>(null);
  const ctaOverlayRef = useRef<HTMLDivElement>(null);
  const ctaHeadingRef = useRef<HTMLHeadingElement>(null);
  const ctaTextRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnsRef = useRef<HTMLDivElement>(null);

  // Floating Decorative elements Refs
  const floatCirclesRef = useRef<SVGSVGElement>(null);

  const services = [
    {
      title: "Investment Advisory",
      desc: "Data-driven capital allocation strategies for institutional and private investors targeting high-yield UAE assets.",
      icon: TrendingUp,
    },
    {
      title: "Property Brokerage",
      desc: "Bespoke acquisition and divestment services for premier residential villas, penthouses, and off-market estates.",
      icon: Building2,
    },
    {
      title: "Project Comparison & Due Diligence",
      desc: "Rigorous developer auditing, escrow validation, construction checks, and structural risk analysis.",
      icon: FileSearch,
    },
    {
      title: "Portfolio Planning",
      desc: "Structured asset allocation, leverage planning, and risk diversification matching long-term wealth objectives.",
      icon: PieChart,
    },
    {
      title: "Market Research",
      desc: "Granular historical evaluation profiles, capital appreciation curves, supply-demand curves, and demographic trends.",
      icon: LineChart,
    },
    {
      title: "Property Management",
      desc: "End-to-end management, comprehensive tenant onboarding, leasing optimization, and preventive maintenance control.",
      icon: Home,
    },
    {
      title: "Interior Design",
      desc: "Bespoke interior architecture, spacial remodeling, luxury finish specifications, and turnkey spatial aesthetics.",
      icon: Paintbrush,
    },
    {
      title: "Home Furnishing",
      desc: "Curated furniture packages, luxury styling, and decorative art sourcing from leading international designers.",
      icon: Armchair,
    },
    {
      title: "Mortgage Assistance",
      desc: "Bespoke structural leverage, competitive lending rates, and multi-bank pre-approval advisory for local/non-resident clients.",
      icon: Calculator,
    },
    {
      title: "Golden Visa Guidance",
      desc: "Bespoke legal assistance bridging property purchases with UAE residency Golden Visa pipelines and bank setup.",
      icon: FileText,
    },
    {
      title: "Property Handover",
      desc: "Comprehensive snagging, physical walk-throughs, Title Deed registration, and official keys collection.",
      icon: ClipboardCheck,
    },
    {
      title: "After-Sales Services",
      desc: "Ongoing support extending past transaction handovers including luxury tenant concierges and building renovations.",
      icon: Briefcase,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery",
      desc: "Detailed briefing session to establish investment risk profile, budgets, locations, and asset specifications.",
    },
    {
      step: "02",
      title: "Consultation",
      desc: "Strategic review of current macro-trends, regulatory parameters, developer credibility, and market cycles.",
    },
    {
      step: "03",
      title: "Market Analysis",
      desc: "Data-driven yield calculations, payment schedules exposure modeling, and supply pipeline evaluations.",
    },
    {
      step: "04",
      title: "Property Shortlisting",
      desc: "Curation of exclusive public listings, off-market opportunities, and premier developer releases.",
    },
    {
      step: "05",
      title: "Comparative Evaluation",
      desc: "Side-by-side analysis of developer track record, asset construction progress, and historical appreciation.",
    },
    {
      step: "06",
      title: "Site Visits",
      desc: "Private helicopter or luxury yacht viewings, construction audits, and physical layouts snagging.",
    },
    {
      step: "07",
      title: "Negotiation",
      desc: "Leveraging market network to secure the best commercial pricing, unit allocations, and payment terms.",
    },
    {
      step: "08",
      title: "Documentation",
      desc: "Facilitating legal contracts (SPA), escrow compliance, and registration procedures with DLD.",
    },
    {
      step: "09",
      title: "Handover",
      desc: "Comprehensive physical inspection, Snagging list resolution, utility connections, and keys handover.",
    },
    {
      step: "10",
      title: "After-Sales Support",
      desc: "Turnkey interior styling, asset management, tenant sourcing, or capital exit restructuring.",
    },
  ];

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 0. PREMIUM LOADING & TRANSITION SYSTEM
    // ==========================================
    gsap.fromTo(
      pageWrapperRef.current,
      { opacity: 0, filter: "blur(10px)" },
      { opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }
    );

    // ==========================================
    // 1. SCROLL PROGRESS BAR (Desktop Edge)
    // ==========================================
    if (scrollProgressRef.current) {
      gsap.to(scrollProgressRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        },
      });
    }

    // ==========================================
    // 2. HERO SECTION ON-LOAD ANIMATIONS
    // ==========================================
    const heroBg = heroBgRef.current;
    const heroOverlay = heroOverlayRef.current;
    const heroSubtitle = heroSubtitleRef.current;
    const heroHeading = heroHeadingRef.current;
    const heroParagraph = heroParagraphRef.current;
    const heroButtons = heroButtonsRef.current?.querySelectorAll("a");

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroBg) {
      heroTl.fromTo(heroBg, { scale: 1.08 }, { scale: 1.0, duration: 2.0 });
    }
    if (heroOverlay) {
      heroTl.fromTo(heroOverlay, { opacity: 0 }, { opacity: 0.65, duration: 1.4 }, 0);
    }
    if (heroSubtitle) {
      heroTl.fromTo(heroSubtitle, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.9 }, 0.4);
    }
    if (heroHeading) {
      const headingLines = heroHeading.querySelectorAll(".line-split");
      heroTl.fromTo(
        headingLines,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 },
        0.5
      );
    }
    if (heroParagraph) {
      heroTl.fromTo(heroParagraph, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0 }, 0.8);
    }
    if (heroButtons && heroButtons.length > 0) {
      heroTl.fromTo(
        heroButtons,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        1.0
      );
    }

    // Parallax on Scroll (Hero background)
    if (heroBg && heroContainerRef.current) {
      parallaxImage(heroBg, heroContainerRef.current, 18);
    }

    // ==========================================
    // 3. WHO WE ARE & READING PROGRESS
    // ==========================================
    if (whoSectionRef.current) {
      fadeRight(whoImageRef.current, 0, 1.3, whoSectionRef.current);
      fadeLeft(whoContentRef.current, 0.1, 1.3, whoSectionRef.current);
      
      // Reading Progress line link to the section scroll
      gsap.fromTo(
        whoDividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: whoSectionRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.5,
          },
        }
      );

      // Highlighting Section Title on reading
      gsap.fromTo(
        whoTitleRef.current,
        { color: "#9ca3af" },
        {
          color: "#ffffff",
          duration: 0.5,
          scrollTrigger: {
            trigger: whoSectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      
      const whoParas = whoContentRef.current?.querySelectorAll("p");
      if (whoParas && whoParas.length > 0) {
        gsap.fromTo(
          whoParas,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.22,
            ease: "power2.out",
            scrollTrigger: {
              trigger: whoSectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }

    // ==========================================
    // 4. WHY WE EXIST CARDS
    // ==========================================
    if (existSectionRef.current && existGridRef.current) {
      const existCards = existGridRef.current.querySelectorAll(".exist-card");
      if (existCards && existCards.length > 0) {
        staggerCards(existCards, existSectionRef.current, 0, 1.3, 0.18);
      }
    }

    // ==========================================
    // 5. CHALLENGE VS SOLUTION
    // ==========================================
    if (challengeSectionRef.current) {
      fadeRight(challengeCardRef.current, 0, 1.3, challengeSectionRef.current);
      fadeLeft(solutionCardRef.current, 0, 1.3, challengeSectionRef.current);
      drawLine(challengeDividerRef.current, challengeSectionRef.current, 0.3, 1.3, "vertical");
    }

    // ==========================================
    // 6. VISION & MISSION
    // ==========================================
    if (visionSectionRef.current) {
      drawLine(visionDividerRef.current, visionSectionRef.current, 0.2, 1.2, "horizontal");

      const visionSentences = visionRef.current?.querySelectorAll(".sentence-split");
      if (visionSentences && visionSentences.length > 0) {
        splitHeadingReveal(visionSentences, visionSectionRef.current, 0, 1.1, 0.12);
      }

      const missionSentences = missionRef.current?.querySelectorAll(".sentence-split");
      if (missionSentences && missionSentences.length > 0) {
        splitHeadingReveal(missionSentences, visionSectionRef.current, 0.15, 1.1, 0.12);
      }
    }

    // Subtle Vision particles system
    const canvas = visionCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    let animationFrameId: number;

    if (canvas && ctx) {
      const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || 400;
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const particles: Array<{ x: number; y: number; r: number; dx: number; dy: number; alpha: number }> = [];
      const particleCount = 15;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.2 + 0.05,
        });
      }

      const animateParticles = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "rgba(212, 180, 106, 0.25)";
        particles.forEach((p) => {
          p.x += p.dx;
          p.y += p.dy;

          if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
          if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 180, 106, ${p.alpha})`;
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(animateParticles);
      };
      animateParticles();

      // Clean up vision particles window listener
      const canvasCleanup = () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationFrameId);
      };
      
      // Store cleanup handler
      canvasCleanupRef.current = canvasCleanup;
    }

    // ==========================================
    // 7. OUR STORY & READING PROGRESS
    // ==========================================
    if (storySectionRef.current) {
      fadeUp(storyHeadingRef.current, 0, 1.1, storySectionRef.current);

      // Scrub Story Reading Progress Line
      gsap.fromTo(
        storyReadingProgressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.5,
          },
        }
      );

      // Highlight Title
      gsap.fromTo(
        storyTitleRef.current,
        { color: "#9ca3af" },
        {
          color: "#ffffff",
          duration: 0.5,
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      
      const storyParas = storySectionRef.current.querySelectorAll(".story-p");
      if (storyParas && storyParas.length > 0) {
        staggerCards(storyParas, storySectionRef.current, 0.2, 1.1, 0.15);
      }

      if (storyBgRef.current && storyContainerRef.current) {
        parallaxImage(storyBgRef.current, storyContainerRef.current, 12);
      }
    }

    // ==========================================
    // 8. WHAT WE DO
    // ==========================================
    if (whatSectionRef.current && whatGridRef.current) {
      const whatCards = whatGridRef.current.querySelectorAll(".what-card");
      if (whatCards && whatCards.length > 0) {
        staggerCards(whatCards, whatSectionRef.current, 0, 1.1, 0.08);
      }
    }

    // ==========================================
    // 9. 10-STEP PROCESS (Signature vertical timeline)
    // ==========================================
    if (processSectionRef.current) {
      // 1. Animate progress line scaling down on scroll scrub
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "center top",
          scrollTrigger: {
            trigger: processSectionRef.current,
            start: "top 50%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        }
      );

      // 2. Animate each step row individually on entrance
      const rows = processSectionRef.current.querySelectorAll(".process-step-row");
      rows.forEach((row, idx) => {
        const dots = row.querySelectorAll(".timeline-dot");
        const cards = row.querySelectorAll(".timeline-card");
        const isEven = idx % 2 === 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 78%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        // Animate dot pop-in
        tl.fromTo(
          dots,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.8)",
          }
        );

        // Animate cards sliding in
        cards.forEach((card) => {
          const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
          let startX = 30;
          if (isDesktop) {
            startX = isEven ? -50 : 50;
          }

          tl.fromTo(
            card,
            {
              opacity: 0,
              x: startX,
              y: 15,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
            },
            "-=0.4"
          );
        });
      });
    }

    // ==========================================
    // 10. CTA SECTION
    // ==========================================
    if (ctaSectionRef.current) {
      if (ctaBgRef.current) {
        gsap.fromTo(
          ctaBgRef.current,
          { scale: 1.0 },
          {
            scale: 1.12,
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (ctaOverlayRef.current) {
        gsap.fromTo(
          ctaOverlayRef.current,
          { opacity: 0.65 },
          {
            opacity: 0.85,
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      fadeUp(ctaHeadingRef.current, 0, 1.1, ctaSectionRef.current);
      fadeUp(ctaTextRef.current, 0.15, 1.1, ctaSectionRef.current);

      const ctaBtns = ctaBtnsRef.current?.querySelectorAll("a");
      if (ctaBtns && ctaBtns.length > 0) {
        gsap.fromTo(
          ctaBtns,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }

    // ==========================================
    // 11. FLOATING DECORATIVE INF-ANIMATIONS
    // ==========================================
    const floatOrnaments = floatCirclesRef.current?.querySelectorAll(".floating-ornament");
    if (floatOrnaments && floatOrnaments.length > 0) {
      floatOrnaments.forEach((node, idx) => {
        const speed = 6 + idx * 3;
        const offset = idx * 2.5;

        // Slow infinite float up-down
        gsap.to(node, {
          y: -15,
          duration: speed,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: offset,
        });

        // Slow infinite rotation
        gsap.to(node, {
          rotation: 360,
          transformOrigin: "center center",
          duration: speed * 3,
          repeat: -1,
          ease: "none",
        });
      });
    }

    // ==========================================
    // ==========================================
    // 13. MOUSE HOVER MAGNETIC BINDINGS
    // ==========================================
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    const magneticCleanupFns: Array<() => void> = [];

    magneticBtns.forEach((btn) => {
      const cleanup = magneticHover(btn as HTMLElement, 0.25);
      if (cleanup) magneticCleanupFns.push(cleanup);
    });

    // ==========================================
    // CLEANUP ON UNMOUNT
    // ==========================================
    return () => {
      // 1. Destroy ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // 2. Stop Canvas anim
      if (canvasCleanupRef.current) {
        canvasCleanupRef.current();
      }

      // 3. Remove Magnetic Hovers
      magneticCleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={pageWrapperRef}
      className="bg-luxury-charcoal min-h-screen text-white pt-20 relative overflow-hidden opacity-0 blur-md transition-all duration-300"
    >
      {/* Luxury Structured SEO JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Us | Luxespace Properties",
            "description": "Learn about Luxespace Properties, Dubai's premier luxury real estate advisory firm built on transparency, expertise, and research.",
            "publisher": {
              "@type": "RealEstateAgent",
              "name": "Luxespace Properties",
              "url": "https://luxespace.ae",
              "logo": "https://luxespace.ae/assets/logo.png"
            }
          })
        }}
      />

      {/* Scroll Progress Bar (Desktop only) */}
      <div className="hidden lg:block fixed right-6 top-1/4 bottom-1/4 w-[1.5px] bg-luxury-border/15 z-40 rounded-full overflow-hidden">
        <div
          ref={scrollProgressRef}
          className="w-full bg-luxury-gold origin-top scale-y-0 h-full"
        />
      </div>

      {/* Background Decorative floating lines & circles */}
      <svg
        ref={floatCirclesRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <circle
          className="floating-ornament"
          cx="10%"
          cy="25%"
          r="80"
          stroke="rgba(212, 180, 106, 0.05)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          className="floating-ornament"
          cx="85%"
          cy="45%"
          r="130"
          stroke="rgba(212, 180, 106, 0.03)"
          strokeWidth="1"
          fill="none"
        />
        <circle
          className="floating-ornament"
          cx="20%"
          cy="75%"
          r="100"
          stroke="rgba(212, 180, 106, 0.04)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="45%" cy="30%" r="4" fill="rgba(212, 180, 106, 0.12)" filter="blur(2px)" />
        <circle cx="75%" cy="80%" r="5" fill="rgba(212, 180, 106, 0.08)" filter="blur(3px)" />
      </svg>

      {/* 1. Hero Section */}
      <section
        ref={heroContainerRef}
        className="relative h-[65vh] sm:h-[75vh] w-full flex items-center justify-center overflow-hidden border-b border-luxury-border/20"
      >
        <Image
          ref={heroBgRef}
          src="/assets/about-section-hero-image.jpg"
          alt="Dubai Skyline"
          fill
          priority
          className="object-cover object-center scale-108"
        />
        <div ref={heroOverlayRef} className="absolute inset-0 bg-black/65 z-10 opacity-0" />
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div ref={heroSubtitleRef} className="opacity-0">
            <Typography variant="subheading" className="text-luxury-gold tracking-[0.25em] text-xs sm:text-sm font-semibold">
              LUXESPACE PROPERTIES
            </Typography>
          </div>
          <h1
            ref={heroHeadingRef}
            className="text-5xl sm:text-7xl font-serif font-bold text-white tracking-wide leading-none"
          >
            <span className="line-split block">About Us</span>
          </h1>
          <div className="w-16 h-[1px] bg-luxury-gold/50 mx-auto my-6" />
          <p
            ref={heroParagraphRef}
            className="text-lg sm:text-xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed opacity-0"
          >
            We don&apos;t simply help clients buy property.<br />
            We help them make confident real estate decisions.
          </p>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section ref={whoSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          {/* Left: Image */}
          <div
            ref={whoImageRef}
            className="lg:col-span-6 relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-luxury-border/30 opacity-0 group"
          >
            <Image
              src="/assets/villa_render.webp"
              alt="Who We Are"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-luxury-charcoal/10 mix-blend-multiply" />
          </div>

          {/* Right: Content */}
          <div ref={whoContentRef} className="lg:col-span-6 space-y-8 opacity-0 text-center lg:text-left">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Introduction</span>
              <h2 ref={whoTitleRef} className="font-serif text-3xl sm:text-4xl text-white transition-colors duration-500">
                Who We Are
              </h2>
            </div>
            
            <div ref={whoDividerRef} className="w-full h-[1.5px] bg-luxury-gold/40 origin-left scale-x-0 mx-auto lg:mx-0" />

            <div className="space-y-6 text-sm text-gray-400 font-light leading-relaxed">
              <p className="opacity-0">
                At Luxespace Properties, we believe real estate isn&apos;t just about buying property — it&apos;s about making one of the most important financial decisions of your life.
              </p>
              <p className="opacity-0">
                Whether purchasing a first home, building a portfolio, or making a strategic investment, we help clients make decisions with confidence.
              </p>
              <p className="opacity-0">
                The UAE offers incredible opportunities, but also enormous complexity. Our role is to simplify that journey through honest advice and market expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 3. Why We Exist */}
      <section ref={existSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-16">
          <SectionHeading
            align="center"
            subtitle="Core Philosophy"
            title="Why We Exist"
            description="Our brokerage operations are built entirely on client outcomes, not transaction volumes."
          />
        </div>

        <div ref={existGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="exist-card bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/50 hover:-translate-y-1.5 hover:shadow-[0_10px_35px_rgba(212,180,106,0.06)] transition-all duration-500 opacity-0 group text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold/10 transition-colors duration-500">
              <Shield className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Honest Advice
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Clients deserve objective recommendations based on their goals—not sales targets.
            </Typography>
          </div>

          {/* Card 2 */}
          <div className="exist-card bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/50 hover:-translate-y-1.5 hover:shadow-[0_10px_35px_rgba(212,180,106,0.06)] transition-all duration-500 opacity-0 group text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold/10 transition-colors duration-500">
              <Key className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Strategic Guidance
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Every recommendation is backed by market research, project analysis, and long-term thinking.
            </Typography>
          </div>

          {/* Card 3 */}
          <div className="exist-card bg-luxury-dark/60 border border-luxury-border/30 rounded-2xl p-8 space-y-4 hover:border-luxury-gold/50 hover:-translate-y-1.5 hover:shadow-[0_10px_35px_rgba(212,180,106,0.06)] transition-all duration-500 opacity-0 group text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold/10 transition-colors duration-500">
              <Landmark className="w-6 h-6" />
            </div>
            <Typography variant="subheading" className="text-white normal-case text-lg font-serif">
              Trusted Relationships
            </Typography>
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Our commitment continues well beyond the transaction through ongoing support and market insights.
            </Typography>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 4. The Challenge vs Our Solution */}
      <section ref={challengeSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-23 items-stretch gap-0 relative">
          
          {/* Challenge Card */}
          <div
            ref={challengeCardRef}
            className="lg:col-span-11 bg-[#181a1f] border border-red-500/10 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden opacity-0 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/2 blur-3xl rounded-full" />
            <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">The Reality</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">The Challenge</h3>
            <div className="w-12 h-[1px] bg-red-500/20" />
            <div className="space-y-4 text-sm text-gray-400 font-light leading-relaxed">
              <p>
                Most buyers receive dozens of listings but very little guidance.
              </p>
              <p>
                Brochures rarely explain developer quality, payment exposure, rental performance, or long-term investment potential.
              </p>
            </div>
          </div>

          {/* Center Divider Line (1 col on desktop, none on mobile) */}
          <div className="hidden lg:flex lg:col-span-1 justify-center items-center relative">
            <div ref={challengeDividerRef} className="w-[1px] h-full bg-luxury-border/30 origin-top scale-y-0" />
          </div>

          {/* Solution Card */}
          <div
            ref={solutionCardRef}
            className="lg:col-span-11 bg-luxury-dark/85 border border-luxury-gold/15 rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden opacity-0 mt-8 lg:mt-0 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 blur-3xl rounded-full" />
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Our Approach</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">Our Solution</h3>
            <div className="w-12 h-[1px] bg-luxury-gold/30" />
            <div className="space-y-4 text-sm text-gray-400 font-light leading-relaxed">
              <p>
                We begin by understanding each client&apos;s goals before recommending opportunities.
              </p>
              <p>
                Every recommendation is driven by research, market intelligence, and long-term value creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 5. Vision & Mission */}
      <section ref={visionSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-8 sm:p-16 text-center max-w-4xl mx-auto space-y-12 relative overflow-hidden">
          
          {/* Subtle canvas for gold dust particles */}
          <canvas
            ref={visionCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Vision */}
          <div ref={visionRef} className="space-y-4 relative z-10">
            <span className="sentence-split text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">Our Vision</span>
            <h3 className="sentence-split font-serif text-2xl sm:text-3xl text-white">To put people before properties.</h3>
            <p className="sentence-split text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              To become one of the UAE&apos;s most trusted real estate advisory firms by putting people before properties and relationships before transactions.
            </p>
          </div>

          <div ref={visionDividerRef} className="w-12 h-[1px] bg-luxury-border/20 mx-auto origin-center scale-x-0 relative z-10" />

          {/* Mission */}
          <div ref={missionRef} className="space-y-4 relative z-10">
            <span className="sentence-split text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">Our Mission</span>
            <h3 className="sentence-split font-serif text-2xl sm:text-3xl text-white">To empower through objective insight.</h3>
            <p className="sentence-split text-sm text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
              To empower investors and homeowners through objective advice, strategic market insight, and end-to-end property solutions that create lasting value.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 6. Our Story */}
      <section ref={storySectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Heritage</span>
          
          <h2 ref={storyTitleRef} className="font-serif text-3xl sm:text-4xl text-white transition-colors duration-500">
            Our Story
          </h2>
          
          {/* Scroll linked reading indicator */}
          <div className="relative w-24 h-[1.5px] bg-luxury-border/20 mx-auto mt-4 overflow-hidden">
            <div ref={storyReadingProgressRef} className="absolute inset-y-0 left-0 bg-luxury-gold w-full origin-left scale-x-0" />
          </div>
          
          <div ref={storyHeadingRef} className="space-y-6 text-sm text-gray-300 font-light leading-relaxed text-center">
            <p className="story-p opacity-0">
              Luxespace Properties was established to challenge the traditional brokerage model.
            </p>
            <p className="story-p opacity-0">
              Rather than overwhelming buyers with endless listings, we focus on understanding their objectives first and recommending only what truly aligns with their goals.
            </p>
            <p className="story-p opacity-0">
              We are building an advisory-first company founded on honesty, research, and long-term client relationships.
            </p>
          </div>
        </div>

        {/* Story Background Parallax Image container */}
        <div
          ref={storyContainerRef}
          className="relative h-[250px] sm:h-[400px] w-full rounded-2xl overflow-hidden mt-16 border border-luxury-border/30 group"
        >
          <Image
            ref={storyBgRef}
            src="/assets/apartment_render.webp"
            alt="Luxury Residence Lobby"
            fill
            className="object-cover scale-108 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      </section>

      <SectionDivider />

      {/* 7. What We Do */}
      <section ref={whatSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-16">
          <SectionHeading
            align="center"
            subtitle="Expertise Grid"
            title="What We Do"
            description="Our capabilities span the full real estate lifecycle, providing holistic private-office support."
          />
        </div>

        <div ref={whatGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="what-card bg-luxury-dark/40 border border-luxury-border/30 rounded-2xl p-6 space-y-4 hover:border-luxury-gold/50 hover:bg-luxury-dark/95 hover:-translate-y-1.5 hover:shadow-[0_10px_35px_rgba(212,180,106,0.05)] transition-all duration-500 opacity-0 group text-center md:text-left flex flex-col items-center md:items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold/10 group-hover:rotate-6 transition-all duration-500">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base text-white">{svc.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">{svc.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider />

      {/* 8. Our Process */}
      <section ref={processSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-16">
          <SectionHeading
            align="center"
            subtitle="Timeline"
            title="Our Process"
            description="A methodical, 10-step advisory journey designed to ensure clarity, safety, and performance."
          />
        </div>

        {/* Vertical Timeline wrapper */}
        <div className="relative max-w-6xl mx-auto mt-20">
          
          {/* Vertical Timeline Track (Grey background track line) */}
          <div
            ref={timelineTrackRef}
            className="absolute left-[20px] lg:left-1/2 top-4 bottom-4 w-[2px] bg-luxury-border/15 -translate-x-1/2 z-0"
          />

          {/* Vertical Timeline Progress (Gold line that grows on scroll) */}
          <div
            ref={progressLineRef}
            className="absolute left-[20px] lg:left-1/2 top-4 bottom-4 w-[2px] bg-luxury-gold origin-top scale-y-0 -translate-x-1/2 z-10"
          />

          {/* Process Step Rows */}
          <div className="space-y-16 lg:space-y-24 relative z-20">
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className="process-step-row relative grid grid-cols-1 lg:grid-cols-12 items-center gap-0"
                >
                  
                  {/* Left Column (Desktop: Card for even index, spacer for odd) */}
                  <div className="hidden lg:block lg:col-span-5 text-left lg:text-right">
                    {isEven && (
                      <div className="timeline-card hidden lg:block bg-luxury-dark/45 border border-luxury-border/30 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-luxury-gold/50 hover:shadow-[0_10px_35px_rgba(212,180,106,0.06)] hover:-translate-y-1.5 transition-all duration-500 text-left lg:text-right inline-block max-w-xl opacity-0">
                        <span className="font-serif text-3xl sm:text-4xl text-luxury-gold/25 font-bold block">
                          {step.step}
                        </span>
                        <h5 className="font-serif text-lg sm:text-xl text-white font-semibold">{step.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    )}
                    {!isEven && (
                      <div className="hidden lg:block w-full h-1" />
                    )}
                  </div>

                  {/* Middle Column (Timeline Marker / Dot on Desktop) */}
                  <div className="hidden lg:flex lg:col-span-2 justify-center items-center relative h-full">
                    {/* The Dot */}
                    <div className="timeline-dot w-4.5 h-4.5 rounded-full bg-luxury-gold ring-4 ring-luxury-charcoal z-20 scale-0 opacity-0 relative">
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 rounded-full bg-luxury-gold animate-ping opacity-25 scale-150" />
                    </div>
                  </div>

                  {/* Mobile Dot: absolute positioning on the left track */}
                  <div className="lg:hidden absolute left-[20px] top-[40px] -translate-x-1/2 z-30">
                    <div className="timeline-dot w-4 h-4 rounded-full bg-luxury-gold ring-4 ring-luxury-charcoal z-20 scale-0 opacity-0 relative">
                      <div className="absolute inset-0 rounded-full bg-luxury-gold animate-ping opacity-20 scale-150" />
                    </div>
                  </div>

                  {/* Right Column (Desktop: Card for odd index, spacer for even) */}
                  <div className="lg:col-span-5 pl-12 lg:pl-0">
                    {/* Desktop/Mobile Odd Card */}
                    {!isEven && (
                      <div className="timeline-card bg-luxury-dark/45 border border-luxury-border/30 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-luxury-gold/50 hover:shadow-[0_10px_35px_rgba(212,180,106,0.06)] hover:-translate-y-1.5 transition-all duration-500 text-left inline-block max-w-xl opacity-0">
                        <span className="font-serif text-3xl sm:text-4xl text-luxury-gold/25 font-bold block">
                          {step.step}
                        </span>
                        <h5 className="font-serif text-lg sm:text-xl text-white font-semibold">{step.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    )}
                    
                    {/* Mobile Even Card */}
                    {isEven && (
                      <div className="timeline-card lg:hidden bg-luxury-dark/45 border border-luxury-border/30 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-luxury-gold/50 hover:shadow-[0_10px_35px_rgba(212,180,106,0.06)] hover:-translate-y-1.5 transition-all duration-500 text-left inline-block max-w-xl opacity-0">
                        <span className="font-serif text-3xl sm:text-4xl text-luxury-gold/25 font-bold block">
                          {step.step}
                        </span>
                        <h5 className="font-serif text-lg sm:text-xl text-white font-semibold">{step.title}</h5>
                        <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. Call To Action Section */}
      <section
        ref={ctaSectionRef}
        className="relative w-full py-36 overflow-hidden border-t border-luxury-border/20"
      >
        <Image
          ref={ctaBgRef}
          src="/assets/penthouse_render.webp"
          alt="Luxury Penthouse View"
          fill
          className="object-cover object-center"
        />
        <div ref={ctaOverlayRef} className="absolute inset-0 bg-black/75 z-10" />
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Get In Touch</span>
          
          <h2 ref={ctaHeadingRef} className="font-serif text-3xl sm:text-5xl text-white font-bold leading-tight opacity-0">
            Ready to Begin Your Property Journey?
          </h2>
          
          <p ref={ctaTextRef} className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed opacity-0">
            Whether you&apos;re searching for your dream home or building a long-term investment portfolio, our advisors are ready to help.
          </p>
          
          <div ref={ctaBtnsRef} className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="magnetic-btn w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-500 hover:shadow-[0_0_20px_rgba(212,180,106,0.4)]"
              >
                Book Consultation
              </Button>
            </Link>
            
            <Link href="/properties" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="magnetic-btn w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider border-white/20 hover:border-luxury-gold transition-colors duration-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Explore Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
