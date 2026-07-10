import Link from "next/link";
import Image from "next/image";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function ContactHero() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] w-full flex items-center justify-center overflow-hidden border-b border-luxury-border/20">
      <Image
        src="/assets/contactus-hero-image.webp"
        alt="Dubai Skyline View"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/70 z-10" />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <Typography
          variant="subheading"
          className="text-luxury-gold tracking-[0.25em] text-xs sm:text-sm font-semibold"
        >
          LUXESPACE PROPERTIES
        </Typography>
        
        <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white tracking-wide leading-none">
          Contact Us
        </h1>
        
        <div className="w-16 h-[1px] bg-luxury-gold/50 mx-auto my-6" />
        
        <p className="text-lg sm:text-xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
          We welcome the opportunity to discuss your goals and help you make confident real estate decisions in Dubai.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="#contact-form" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider"
            >
              Book Consultation
            </Button>
          </Link>
          <Link href="/properties" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider border-white/20 hover:border-luxury-gold"
            >
              Explore Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
