"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Mail, Phone, Globe, Send } from "lucide-react";
import { db } from "@/lib/db";
import Button from "@/components/ui/Button";

interface PropertyEnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export default function PropertyEnquiryForm({ propertyId, propertyTitle }: PropertyEnquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone" | "whatsapp">("email");
  const [message, setMessage] = useState(`I am interested in securing a private viewing of ${propertyTitle}. Please coordinate.`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await db.createEnquiry({
        propertyId,
        fullName,
        email,
        phone,
        whatsapp: whatsapp || undefined,
        country: country || undefined,
        preferredContact,
        message,
      });

      setSuccess(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setWhatsapp("");
      setCountry("");
    } catch (err) {
      console.error("Submit enquiry error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-8 text-center space-y-4 shadow-luxury animate-scale-in">
        <CheckCircle2 className="w-16 h-16 text-luxury-gold mx-auto animate-pulse" />
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-white">Viewing Requested</h3>
          <p className="text-xs text-gray-400 font-light max-w-sm mx-auto leading-relaxed">
            Thank you. Your dossier has been securely logged in our CRM. A private client partner will establish contact with you shortly.
          </p>
        </div>
        <Button variant="outline" onClick={() => setSuccess(false)} className="text-xs border-luxury-border/65">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 shadow-luxury space-y-6">
      <div>
        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Consultation</span>
        <h3 className="font-serif text-xl text-white mt-0.5">Secure Private Tour</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
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
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
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
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              placeholder="e.g. +971 50 123 4567"
            />
          </div>
        </div>

        {/* WhatsApp & Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">WhatsApp (Optional)</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              placeholder="e.g. +971 50 123 4567"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Country of Residence</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
              placeholder="e.g. Monaco, United Kingdom"
            />
          </div>
        </div>

        {/* Contact Method Preference */}
        <div className="space-y-2">
          <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Preferred Contact Channel</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Email", value: "email", icon: Mail },
              { label: "Phone", value: "phone", icon: Phone },
              { label: "WhatsApp", value: "whatsapp", icon: MessageCircle },
            ].map((chan) => {
              const Icon = chan.icon;
              return (
                <button
                  type="button"
                  key={chan.value}
                  onClick={() => setPreferredContact(chan.value as "email" | "phone" | "whatsapp")}
                  className={`py-2 rounded-xl text-[9px] font-semibold uppercase tracking-wider border transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                    preferredContact === chan.value
                      ? "bg-luxury-gold border-luxury-gold text-luxury-charcoal"
                      : "bg-luxury-charcoal border-luxury-border/30 text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{chan.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Private Message</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <Button type="submit" variant="primary" className="w-full text-xs font-bold py-3.5 flex items-center justify-center gap-2" disabled={loading}>
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Logging Enquiry..." : "Submit dossiers"}</span>
        </Button>
      </form>
    </div>
  );
}
