import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="relative w-full py-32 overflow-hidden border-t border-luxury-border/20">
      <Image
        src="/assets/penthouse_render.png"
        alt="Dubai skyline luxury view"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/80 z-10" />
      
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Conclusion</span>
        
        <h2 className="font-serif text-3xl sm:text-5xl text-white font-bold leading-tight">
          Ready to Find Your Perfect Property?
        </h2>
        
        <p className="text-sm sm:text-base text-gray-300 font-light max-w-xl mx-auto leading-relaxed">
          Whether you&apos;re purchasing your first home or building your investment portfolio, our advisors are ready to guide you.
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
