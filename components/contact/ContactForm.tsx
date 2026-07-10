"use client";

import { useState } from "react";
import { CheckCircle2, Send, Info, ChevronDown } from "lucide-react";
import { db } from "@/lib/db";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [interestedIn, setInterestedIn] = useState("General Enquiry");
  const [budget, setBudget] = useState("Under AED 1M");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError("You must agree to be contacted by Luxespace Properties.");
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const nameParts = fullName.split(" ");
      await db.createLead({
        firstName: nameParts[0] || fullName,
        lastName: nameParts.slice(1).join(" ") || "",
        email: email,
        phone: phone,
        source: "contact_page",
        status: "new",
        notes: `${message}\n\nInterested In: ${interestedIn}\nTarget Budget: ${budget}\nCountry of Residence: ${country || "N/A"}`,
      });

      setSuccess(true);
      setFullName("");
      setPhone("");
      setEmail("");
      setCountry("");
      setInterestedIn("General Enquiry");
      setBudget("Under AED 1M");
      setMessage("");
      setAgree(false);
    } catch (err) {
      console.error("Contact Form submit error:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-luxury">
        <CheckCircle2 className="w-16 h-16 text-luxury-gold mx-auto animate-pulse" />
        <div className="space-y-3">
          <h3 className="font-serif text-2xl text-white">Consultation Requested</h3>
          <p className="text-sm text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            Thank you. Your request has been logged securely. A private real estate advisor will review your parameters and establish contact with you within one business day.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
          className="text-xs border-luxury-border/65 px-8 py-3"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div id="contact-form" className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto shadow-luxury space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Dossier Submission</span>
        <h3 className="font-serif text-2xl sm:text-3xl text-white">Request a Private Consultation</h3>
        <p className="text-xs text-gray-400 font-light max-w-md mx-auto leading-relaxed">
          Please provide your parameters below. Our advisors will coordinate a customized portfolio review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
            placeholder="Sir / Madame..."
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
              placeholder="e.g. name@domain.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
              placeholder="e.g. +971 50 123 4567"
            />
          </div>
        </div>

        {/* Country & Interested In */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Country of Residence</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all duration-300"
              placeholder="e.g. Monaco, Switzerland"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Interested In</label>
            <div className="relative">
              <select
                value={interestedIn}
                onChange={(e) => setInterestedIn(e.target.value)}
                className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-xl px-4 py-3 text-xs text-white focus:outline-none appearance-none pr-10 transition-all duration-300 cursor-pointer"
              >
                <option value="Buy Property">Buy Property</option>
                <option value="Rent Property">Rent Property</option>
                <option value="Investment Advisory">Investment Advisory</option>
                <option value="Property Management">Property Management</option>
                <option value="Golden Visa">Golden Visa Guidance</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Investment Budget (AED)</label>
          <div className="relative">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-xl px-4 py-3 text-xs text-white focus:outline-none appearance-none pr-10 transition-all duration-300 cursor-pointer"
            >
              <option value="Under AED 1M">Under AED 1M</option>
              <option value="AED 1M – 3M">AED 1M – 3M</option>
              <option value="AED 3M – 5M">AED 3M – 5M</option>
              <option value="AED 5M+">AED 5M+ (Ultra-High-Net-Worth Portfolio)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Additional Parameters / Notes</label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/25 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none resize-none transition-all duration-300"
            placeholder="Please detail your location requirements, bedroom sizes, payout schedule preferences..."
          />
        </div>

        {/* Custom Luxury Checkbox wrapper */}
        <div className="flex items-start gap-3 pt-2">
          <div className="relative flex items-center">
            <input
              id="agreement"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-4.5 h-4.5 rounded border border-luxury-border/50 bg-luxury-charcoal flex items-center justify-center peer-checked:border-luxury-gold peer-checked:bg-luxury-gold/10 transition-all duration-300 cursor-pointer">
              {/* Animated checkmark icon */}
              <svg
                className="w-3 h-3 text-luxury-gold opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <label htmlFor="agreement" className="text-xs text-gray-400 font-light leading-relaxed cursor-pointer select-none">
            I agree to be contacted by Luxespace Properties regarding private listings, market reports, and portfolio opportunities.
          </label>
        </div>

        {error && (
          <div className="text-red-400 text-xs font-light flex items-center gap-1.5 pt-2 animate-shake">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <div className="space-y-4 pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full text-xs font-bold py-4 flex items-center justify-center gap-2 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,180,106,0.45)]"
            disabled={loading}
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Registering dossiers..." : "Book Consultation"}</span>
          </Button>
          <p className="text-center text-[10px] text-gray-500 font-light">
            Our advisors will respond within one business day.
          </p>
        </div>
      </form>
    </div>
  );
}
