import { MapPin, Clock, Navigation } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function OfficeLocation() {
  const address = "The Binary by Omniyat, Office 2117, Business Bay, Dubai, UAE";
  const mapQuery = encodeURIComponent(address);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-stretch">
      {/* Left: Map Container */}
      <div className="lg:col-span-7 relative min-h-[350px] rounded-2xl overflow-hidden border border-luxury-border/30 bg-[#161a22]">
        {/* Interactive Google Map iframe */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178385202868!2d55.2699863761367!3d25.18734997771746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69cdc22e3ad7%3A0x6b8bc2de1d2fb7c!2sThe%20Binary%20by%20Omniyat!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "invert(90%) grayscale(100%) contrast(95%) brightness(80%)", opacity: 0.85 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full z-0"
          title="Luxespace Properties Office Map"
        />

        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-luxury-charcoal/80 backdrop-blur-md border border-luxury-border/20 rounded-xl p-4 flex items-center gap-3 max-w-sm">
          <MapPin className="w-5 h-5 text-luxury-gold flex-shrink-0" />
          <div>
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block">Office Address</span>
            <span className="text-xs text-white leading-relaxed block font-light">Office 2117, The Binary by Omniyat, Dubai</span>
          </div>
        </div>

        {/* Map Action Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-luxury-charcoal/80 backdrop-blur-md border border-luxury-border/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-[10px] text-gray-400 font-light">
            GPS Coordinates: 25.1873° N, 55.2721° E
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-widest text-luxury-gold hover:text-white font-bold transition-colors duration-300 flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            Open Google Maps
          </a>
        </div>
      </div>

      {/* Right: Info */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-center lg:text-left">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block">Office Headquarter</span>
            <Typography variant="section" className="font-serif text-3xl text-white">
              Visit Our Office
            </Typography>
          </div>
          
          <div className="w-12 h-[1px] bg-luxury-gold/30 mx-auto lg:mx-0" />

          {/* Address details */}
          <div className="space-y-6 lg:space-y-4">
            <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4">
              <MapPin className="w-5 h-5 text-luxury-gold flex-shrink-0" />
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">Location</span>
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  The Binary by Omniyat<br />
                  Office 2117<br />
                  Business Bay, Dubai<br />
                  United Arab Emirates
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4">
              <Clock className="w-5 h-5 text-luxury-gold flex-shrink-0" />
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">Business Hours</span>
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  Monday – Saturday<br />
                  9:00 AM – 7:00 PM<br />
                  <span className="text-xs text-gray-500 font-light block mt-1">Closed on Sundays & Public Holidays</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider"
            >
              Get Directions
            </Button>
          </a>
          <a href="tel:+971501348020" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider border-white/20 hover:border-luxury-gold"
            >
              Call Now
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
