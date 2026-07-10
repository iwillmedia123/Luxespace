"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin, Globe, Home, Navigation, MessageSquare } from "lucide-react";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import OfficeLocation from "@/components/contact/OfficeLocation";
import ContactForm from "@/components/contact/ContactForm";
import CompanyInfo from "@/components/contact/CompanyInfo";
import SocialLinks from "@/components/contact/SocialLinks";
import CTASection from "@/components/contact/CTASection";
import SectionDivider from "@/components/layout/SectionDivider";
import { parallaxImage } from "@/lib/motion";

export default function ContactClient() {
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  
  // Hero refs for scroll effect
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLImageElement>(null);

  const infoCards = [
    {
      title: "Phone",
      values: ["+971 50 134 8020"],
      icon: Phone,
      hrefs: ["tel:+971501348020"],
    },
    {
      title: "Email",
      values: ["info@luxespaceproperties.com", "luxespaceproperties@gmail.com"],
      icon: Mail,
      hrefs: ["mailto:info@luxespaceproperties.com", "mailto:luxespaceproperties@gmail.com"],
    },
    {
      title: "Office HQ",
      values: ["The Binary by Omniyat", "Office 2117, Business Bay", "Dubai, United Arab Emirates"],
      icon: MapPin,
      hrefs: undefined,
    },
    {
      title: "Website",
      values: ["www.luxespaceproperties.com"],
      icon: Globe,
      hrefs: ["https://www.luxespaceproperties.com"],
    },
  ];

  useEffect(() => {
    // 1. Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 2. PAGE LOADING & ENTRANCE TRANSITION
    // ==========================================
    gsap.fromTo(
      pageWrapperRef.current,
      { opacity: 0, filter: "blur(10px)" },
      { opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power2.out" }
    );

    // ==========================================
    // 3. HERO ON-LOAD ANIMATIONS
    // ==========================================
    const heroSection = pageWrapperRef.current?.querySelector("section");
    const heroBg = heroSection?.querySelector("img");
    const heroOverlay = heroSection?.querySelector(".absolute.inset-0");
    const heroContent = heroSection?.querySelector(".relative.z-20");

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroBg) {
      heroTl.fromTo(heroBg, { scale: 1.08 }, { scale: 1.0, duration: 2.2 });
    }
    if (heroOverlay) {
      heroTl.fromTo(heroOverlay, { opacity: 0 }, { opacity: 0.7, duration: 1.5 }, 0);
    }
    if (heroContent) {
      const subtitle = heroContent.querySelector("p, span");
      const title = heroContent.querySelector("h1");
      const desc = heroContent.querySelector("p.text-lg");
      const btns = heroContent.querySelectorAll("a");

      if (subtitle) {
        heroTl.fromTo(subtitle, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, 0.4);
      }
      if (title) {
        heroTl.fromTo(title, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.0 }, 0.5);
      }
      if (desc) {
        heroTl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.7);
      }
      if (btns && btns.length > 0) {
        heroTl.fromTo(btns, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.9);
      }
    }

    // Hero Background Parallax on scroll
    if (heroBg && heroSection) {
      parallaxImage(heroBg, heroSection as HTMLElement, 16);
    }

    // ==========================================
    // 4. CONTACT INFO CARDS STAGGERED REVEAL
    // ==========================================
    const infoSection = pageWrapperRef.current?.querySelector(".contact-info-section");
    const cards = infoSection?.querySelectorAll(".info-card-wrapper");

    if (infoSection && cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoSection,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }

    // ==========================================
    // 5. OFFICE LOCATION SECTION ANIMATION
    // ==========================================
    const officeSection = pageWrapperRef.current?.querySelector(".office-location-section");
    const mapCol = officeSection?.querySelector(".lg\\:col-span-7");
    const infoCol = officeSection?.querySelector(".lg\\:col-span-5");

    if (officeSection) {
      // Map entrance slide/zoom
      if (mapCol) {
        gsap.fromTo(
          mapCol,
          { opacity: 0, x: -40, scale: 0.98 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: officeSection,
              start: "top 78%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      // Info entrance slide
      if (infoCol) {
        const infoElements = infoCol.children;
        gsap.fromTo(
          infoElements,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: officeSection,
              start: "top 78%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }

    // ==========================================
    // 6. CONTACT FORM ENVELOPE REVEAL
    // ==========================================
    const formSection = pageWrapperRef.current?.querySelector(".contact-form-section");
    const formWrapper = formSection?.querySelector("#contact-form");

    if (formSection && formWrapper) {
      const formChildren = formWrapper.children;
      gsap.fromTo(
        formWrapper,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formSection,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }

    // ==========================================
    // 7. COMPANY INFORMATION REVEAL
    // ==========================================
    const companySection = pageWrapperRef.current?.querySelector(".company-info-section");
    const companyCard = companySection?.querySelector(".bg-luxury-dark\\/45");

    if (companySection && companyCard) {
      const companyElements = companyCard.querySelectorAll(".grid > div, h3, span, div");
      gsap.fromTo(
        companyCard,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: companySection,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }

    // ==========================================
    // 8. SOCIAL LINKS STAGGERED REVEAL
    // ==========================================
    const socialSection = pageWrapperRef.current?.querySelector(".social-links-section");
    const socialHeading = socialSection?.querySelector(".text-center");
    const socialCards = socialSection?.querySelectorAll(".grid > a");

    if (socialSection) {
      if (socialHeading) {
        gsap.fromTo(
          socialHeading,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: socialSection,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      if (socialCards && socialCards.length > 0) {
        gsap.fromTo(
          socialCards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: socialSection,
              start: "top 78%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }

    // ==========================================
    // 9. FINAL CTA SCROLL-LINKED MOTION
    // ==========================================
    const ctaSection = pageWrapperRef.current?.querySelector("section:last-of-type");
    const ctaBg = ctaSection?.querySelector("img");
    const ctaOverlay = ctaSection?.querySelector(".absolute.inset-0");
    const ctaContent = ctaSection?.querySelector(".relative.z-20");

    if (ctaSection) {
      if (ctaBg) {
        gsap.fromTo(
          ctaBg,
          { scale: 1.0 },
          {
            scale: 1.12,
            scrollTrigger: {
              trigger: ctaSection,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (ctaOverlay) {
        gsap.fromTo(
          ctaOverlay,
          { opacity: 0.75 },
          {
            opacity: 0.88,
            scrollTrigger: {
              trigger: ctaSection,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (ctaContent) {
        const ctaChildren = ctaContent.children;
        gsap.fromTo(
          ctaChildren,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }

    // ==========================================
    // CLEANUP ON UNMOUNT
    // ==========================================
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
            "@type": "ContactPage",
            "name": "Contact Us | Luxespace Properties",
            "description": "Reach out to Luxespace Properties for premier real estate opportunities and wealth portfolio comparison in Dubai.",
            "url": "https://luxespace.ae/contact",
            "publisher": {
              "@type": "RealEstateAgent",
              "name": "Luxespace Properties",
              "url": "https://luxespace.ae",
              "logo": "https://luxespace.ae/assets/logo.png"
            }
          })
        }}
      />

      {/* 1. Hero */}
      <ContactHero />

      {/* 2. Contact Information Cards */}
      <section className="contact-info-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {infoCards.map((card, idx) => (
            <div key={idx} className="info-card-wrapper opacity-0 h-full">
              <ContactInfoCard
                title={card.title}
                values={card.values}
                icon={card.icon}
                hrefs={card.hrefs}
              />
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* 3. Office Location Section */}
      <section className="office-location-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <OfficeLocation />
      </section>

      <SectionDivider />

      {/* 4. Premium Contact Form Section */}
      <section className="contact-form-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <ContactForm />
      </section>

      <SectionDivider />

      {/* 5. Company Registration Compliance Section */}
      <section className="company-info-section max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <CompanyInfo />
      </section>

      <SectionDivider />

      {/* 6. Social Media Links Section */}
      <section className="social-links-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <SocialLinks />
      </section>

      {/* 7. Final Call to Action */}
      <CTASection />

      {/* Sticky Mobile Contact Actions (visible only on mobile/tablet) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-luxury-charcoal/95 border-t border-luxury-border/30 backdrop-blur-md px-4 py-3 flex items-center justify-around gap-2 pb-[calc(12px+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        {/* Call Now */}
        <a
          href="tel:+971501348020"
          className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 text-gray-400 hover:text-luxury-gold transition-colors duration-300"
        >
          <Phone className="w-5 h-5 text-luxury-gold" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Call</span>
        </a>

        <div className="w-[1px] h-6 bg-luxury-border/30" />

        {/* WhatsApp */}
        <a
          href="https://wa.me/971501348020"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 text-gray-400 hover:text-luxury-gold transition-colors duration-300"
        >
          <MessageSquare className="w-5 h-5 text-luxury-gold" />
          <span className="text-[9px] uppercase tracking-widest font-bold">WhatsApp</span>
        </a>

        <div className="w-[1px] h-6 bg-luxury-border/30" />

        {/* Directions */}
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=The%20Binary%20by%20Omniyat%20Dubai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 text-gray-400 hover:text-luxury-gold transition-colors duration-300"
        >
          <Navigation className="w-5 h-5 text-luxury-gold" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Directions</span>
        </a>

        <div className="w-[1px] h-6 bg-luxury-border/30" />

        {/* Properties */}
        <Link
          href="/properties"
          className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 text-gray-400 hover:text-luxury-gold transition-colors duration-300"
        >
          <Home className="w-5 h-5 text-luxury-gold" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Properties</span>
        </Link>
      </div>
    </div>
  );
}
