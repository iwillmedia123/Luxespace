"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Mail, Phone, MessageSquare, ArrowRight, Languages, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { Agent } from "@/types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      try {
        setLoading(true);
        const list = await db.getAgents();
        setAgents(list);
      } catch (err) {
        console.error("Error loading agents:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []);

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-4 select-none">
          <Link href="/" className="hover:text-luxury-gold transition-colors duration-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-luxury-gold">Advisory Board</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-luxury-border/20 pb-6 mb-12">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-luxury-gold" />
            <span>Private Client Advisory</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mt-1">Our Elite Advisors</h1>
          <p className="text-xs text-gray-400 mt-2 font-light max-w-xl leading-relaxed">
            Meet our board of ultra-luxury real estate advisors, dedicated to representing global high-net-worth buyers with confidentiality, precision, and deep market intelligence.
          </p>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((ag) => (
              <div
                key={ag.id}
                className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500 flex flex-col group hover:-translate-y-1 shadow-luxury"
              >
                {/* Agent Avatar */}
                <div className="h-64 relative bg-luxury-charcoal/80 overflow-hidden">
                  <Image
                    src={ag.avatarUrl || "/assets/agent_1.png"}
                    alt={ag.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-750 group-hover:scale-105"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-transparent to-transparent" />
                  
                  {ag.isFeatured && (
                    <span className="absolute top-4 right-4 bg-luxury-gold text-luxury-charcoal text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-luxury-charcoal" />
                      <span>Partner</span>
                    </span>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-6">
                    <h3 className="font-serif text-lg text-white leading-tight">{ag.name}</h3>
                    <p className="text-[9px] text-luxury-gold uppercase tracking-widest font-semibold mt-0.5">{ag.title}</p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1.5">
                      {ag.specialization.map((spec, idx) => (
                        <span key={idx} className="text-[8px] uppercase tracking-wider text-gray-400 border border-luxury-border/30 rounded px-2 py-0.5">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                      {ag.bio || `Senior portfolio advisor specializing in high-value asset acquisitions, private off-market penthouses, and bespoke developer relations across prime Dubai freehold sectors.`}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="border-t border-luxury-border/10 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                      <Languages className="w-3.5 h-3.5 text-luxury-gold/75" />
                      <span>{ag.languages.join(" | ")}</span>
                    </div>

                    {/* Social/Contact quick action triggers */}
                    <div className="flex items-center gap-3">
                      <a href={`mailto:${ag.email}`} className="text-gray-500 hover:text-white transition-colors" title="Send Email">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={`tel:${ag.phone}`} className="text-gray-500 hover:text-white transition-colors" title="Call Phone">
                        <Phone className="w-4 h-4" />
                      </a>
                      {ag.whatsapp && (
                        <a href={`https://wa.me/${ag.whatsapp.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-emerald-400 transition-colors" title="Chat on WhatsApp">
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <Link href={`/agents/${ag.slug}`} className="w-full py-2.5 rounded-xl border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300 text-[9px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 text-gray-300 group-hover:bg-luxury-gold/5 cursor-pointer">
                      <span>View Advisor Dossier</span>
                      <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
