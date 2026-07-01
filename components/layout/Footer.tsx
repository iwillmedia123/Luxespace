import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import Typography from "@/components/ui/Typography";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury-dark border-t border-luxury-border/30 pt-20 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 overflow-hidden rounded bg-luxury-charcoal border border-luxury-gold/20 flex items-center justify-center p-1">
                <Image
                  src="/assets/logo.png"
                  alt="Luxespace"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <Typography variant="nav" className="text-white hover:text-luxury-gold tracking-widest uppercase font-serif">
                Luxespace
              </Typography>
            </Link>
            
            <Typography variant="body" className="text-xs text-gray-400 font-light leading-relaxed">
              Dubai&apos;s premier boutique agency specializing in ultra-luxury villas, penthouses, and signature developments. We curate exclusive investment opportunities.
            </Typography>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/9745334644"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-luxury-border/50 hover:border-luxury-gold hover:bg-luxury-gold/10 flex items-center justify-center text-gray-300 hover:text-luxury-gold transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="mailto:luxespace@gmail.com"
                className="w-9 h-9 rounded-full border border-luxury-border/50 hover:border-luxury-gold hover:bg-luxury-gold/10 flex items-center justify-center text-gray-300 hover:text-luxury-gold transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography variant="subheading" className="text-white mb-6 text-[10px]">
              Services & Portfolios
            </Typography>
            <ul className="space-y-3.5 text-xs">
              <li>
                <Link href="/properties" className="hover:text-luxury-gold transition-colors duration-300">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/buy" className="hover:text-luxury-gold transition-colors duration-300">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-luxury-gold transition-colors duration-300">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/investment" className="hover:text-luxury-gold transition-colors duration-300">
                  High-yield Investment
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-luxury-gold transition-colors duration-300">
                  Exclusive Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Agents */}
          <div>
            <Typography variant="subheading" className="text-white mb-6 text-[10px]">
              Discover Dubai
            </Typography>
            <ul className="space-y-3.5 text-xs">
              <li>
                <Link href="/communities" className="hover:text-luxury-gold transition-colors duration-300">
                  Prime Communities
                </Link>
              </li>
              <li>
                <Link href="/developers" className="hover:text-luxury-gold transition-colors duration-300">
                  Top Developers
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-luxury-gold transition-colors duration-300">
                  Our Specialists
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-luxury-gold transition-colors duration-300">
                  Editorial News
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-luxury-gold transition-colors duration-300">
                  Client FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <Typography variant="subheading" className="text-white text-[10px]">
              Private Enquiries
            </Typography>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span>Dubai, United Arab Emirates</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
                <a href="tel:+9745334644" className="hover:text-luxury-gold transition-colors duration-300">
                  +974 5334 644
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
                <a href="mailto:luxespace@gmail.com" className="hover:text-luxury-gold transition-colors duration-300">
                  luxespace@gmail.com
                </a>
              </li>
            </ul>

            {/* Newsletter element */}
            <div className="pt-2">
              <Typography variant="label" className="text-white block mb-3 text-[9px]">
                Subscribe to private catalog
              </Typography>
              <div className="flex border-b border-luxury-border py-1.5">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-transparent text-xs w-full focus:outline-none text-white placeholder-gray-600"
                />
                <button aria-label="Subscribe" className="text-luxury-gold hover:text-white transition-colors duration-300 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Panel */}
        <div className="border-t border-luxury-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
          <p>&copy; {currentYear} Luxespace Properties. All rights reserved. Developed in Dubai, UAE.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
