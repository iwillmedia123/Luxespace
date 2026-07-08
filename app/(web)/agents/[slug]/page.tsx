"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, ArrowLeft, Mail, Phone, MessageSquare, Briefcase, Calendar, Award, Home, Send, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { Agent, Property } from "@/types";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import Button from "@/components/ui/Button";

interface AgentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const resolvedParams = use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadAgentData() {
      try {
        setLoading(true);
        const ags = await db.getAgents({ slug: resolvedParams.slug });
        const currentAgent = ags[0];

        if (currentAgent) {
          setAgent(currentAgent);
          const propsRes = await db.getPropertiesByFilters({ agent: currentAgent.id, isSummary: true });
          setProperties(propsRes.properties);
        }
      } catch (err) {
        console.error("Error loading agent details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAgentData();
  }, [resolvedParams.slug]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setSubmitting(true);
    try {
      await db.createLead({
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "",
        email,
        phone,
        source: `agent_booking: ${agent.name}`,
        status: "new",
        notes: `Preferred Meeting Date: ${preferredDate}\n\nClient Message:\n${message}`,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setPhone("");
        setPreferredDate("");
        setMessage("");
      }, 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f232c] pt-32 pb-20 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-light tracking-wider">Retrieving Advisor Dossier...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <main className="min-h-screen bg-[#1f232c] pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <Users className="w-12 h-12 text-luxury-gold/50 mb-4 animate-pulse" />
        <h1 className="font-serif text-2xl text-white">Advisor Dossier Not Found</h1>
        <p className="text-xs text-gray-400 mt-2 font-light max-w-sm">
          The requested luxury real estate advisor dossier could not be retrieved from our archives.
        </p>
        <Link href="/agents" className="mt-6 text-xs text-luxury-gold hover:underline uppercase tracking-widest font-bold flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Advisory Board</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link href="/agents" className="text-gray-400 hover:text-luxury-gold transition-colors duration-300 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 mb-6 select-none">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Advisory Board</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 mb-10">
          {/* Avatar Container */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-luxury-charcoal relative overflow-hidden border border-luxury-border/40 shrink-0 self-center md:self-start">
            <Image
              src={agent.avatarUrl || "/assets/agent_1.png"}
              alt={agent.name}
              fill
              sizes="(max-width: 768px) 192px, 160px"
              className="object-cover"
              priority
            />
          </div>

          {/* details block */}
          <div className="flex-grow flex flex-col justify-between text-center md:text-left space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold bg-luxury-gold/5 border border-luxury-gold/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-luxury-gold" />
                  <span>Licensed Luxury Advisor</span>
                </span>
                {agent.isFeatured && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-400/5 border border-emerald-400/25 px-2.5 py-1 rounded-full">
                    Sovereign Partner
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-serif text-white">{agent.name}</h1>
              <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{agent.title}</p>
            </div>

            {/* Quick specifications stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-luxury-border/10 pt-5 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Active Portfolio</span>
                <span className="text-white font-sans text-xs">{properties.length} Listings</span>
              </div>
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Languages Spoken</span>
                <span className="text-white font-sans text-xs">{agent.languages.join(", ")}</span>
              </div>
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Specialties</span>
                <span className="text-white font-sans text-xs">{agent.specialization.join(", ")}</span>
              </div>
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Advisory Direct</span>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-1 text-gray-400">
                  <a href={`mailto:${agent.email}`} className="hover:text-white" title="Email Address"><Mail className="w-4 h-4" /></a>
                  <a href={`tel:${agent.phone}`} className="hover:text-white" title="Phone Call"><Phone className="w-4 h-4" /></a>
                  {agent.whatsapp && <a href={`https://wa.me/${agent.whatsapp.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400" title="WhatsApp Chat"><MessageSquare className="w-4 h-4" /></a>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography & Active properties */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content: Col span 2 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                <Briefcase className="w-4 h-4 text-luxury-gold" />
                <span>Executive Biography & Credentials</span>
              </h3>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                {agent.bio || `${agent.name} is a highly accomplished ${agent.title} at Luxespace Properties, representing private families and institutional investors in high-value asset transactions. With specialized knowledge in prime Dubai markets, they oversee client portfolio allocations with extreme confidentiality, discretion, and strategic advisory.`}
              </p>
              <p className="text-xs text-gray-300 font-light leading-relaxed">
                Leveraging extensive developer connections and proprietary off-market access, {agent.name} assists clients through real estate cycles, ensuring capital preservation, tax structuring compliance, and maximum net-rental yields.
              </p>
            </div>

            {/* Active portfolio grid */}
            <div className="space-y-6">
              <h3 className="text-sm font-serif text-white uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                <Home className="w-4 h-4 text-luxury-gold" />
                <span>Active Listings Portfolio ({properties.length})</span>
              </h3>

              {properties.length === 0 ? (
                <div className="text-center py-10 bg-luxury-dark border border-luxury-border/30 rounded-2xl">
                  <p className="text-xs text-gray-400 font-light">No properties are currently managed under this advisor&apos;s catalog.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <PropertyCardLuxury key={property.id} property={property} viewMode="grid" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Consultation Booking card */}
          <div className="space-y-6">
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest border-b border-luxury-border/20 pb-3">
                Schedule Consultation
              </h3>

              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center text-xs text-emerald-400">
                  <Award className="w-6 h-6 mx-auto mb-2 text-emerald-400 animate-bounce" />
                  <p className="font-bold">Meeting Requested</p>
                  <p className="font-light mt-1 text-[11px]">Your request has been logged. {agent.name} will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Preferred Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Brief Requirements</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify budget, target communities, or off-plan interests."
                      rows={3}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full py-2.5 text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5" disabled={submitting}>
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? "Sending..." : "Book Consultation"}</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
