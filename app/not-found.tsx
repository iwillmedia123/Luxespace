import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-luxury-gold text-xs uppercase tracking-widest font-semibold">
          Error 404
        </span>
        <h1 className="text-5xl font-serif text-white">Page Not Found</h1>
        <p className="text-gray-400 text-sm font-light leading-relaxed">
          The property or exclusive portal you are trying to access does not exist, or has been moved to a private portfolio.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-charcoal hover:bg-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full transition-all duration-300"
          >
            <span>Return to Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
