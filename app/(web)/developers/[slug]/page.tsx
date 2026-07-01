"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, ArrowLeft, Globe, Award, Home, MapPin, Sparkles, Send } from "lucide-react";
import { db } from "@/lib/db";
import { Developer, Property, Community } from "@/types";
import PropertyCardLuxury from "@/components/cards/PropertyCardLuxury";
import Button from "@/components/ui/Button";

interface DeveloperDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function DeveloperDetailPage({ params }: DeveloperDetailPageProps) {
  const resolvedParams = use(params);
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "projects" | "listings">("about");

  // Contact form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadDeveloperData() {
      try {
        setLoading(true);
        const [devs, props, comms] = await Promise.all([
          db.getDevelopers(),
          db.getProperties(),
          db.getCommunities(),
        ]);

        const currentDev = devs.find((d) => d.slug === resolvedParams.slug);
        if (currentDev) {
          setDeveloper(currentDev);
          // Filter properties
          const devProps = props.filter((p) => p.developerId === currentDev.id);
          setProperties(devProps);

          // Find communities where developer operates
          const commIds = devProps.map((p) => p.communityId);
          const devComms = comms.filter((c) => commIds.includes(c.id));
          setCommunities(devComms);
        }
      } catch (err) {
        console.error("Error loading developer detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeveloperData();
  }, [resolvedParams.slug]);

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!developer) return;
    setSubmitting(true);
    try {
      await db.createLead({
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ").slice(1).join(" ") || "",
        email,
        phone,
        source: `developer_detail: ${developer.name}`,
        status: "new",
        notes: `${message}\n\nEnquiry about developer projects: ${developer.name}`,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setPhone("");
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
        <p className="text-xs text-gray-400 font-light tracking-wider">Loading Developer Dossier...</p>
      </div>
    );
  }

  if (!developer) {
    return (
      <main className="min-h-screen bg-[#1f232c] pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <Building2 className="w-12 h-12 text-luxury-gold/50 mb-4 animate-pulse" />
        <h1 className="font-serif text-2xl text-white">Developer Profile Not Found</h1>
        <p className="text-xs text-gray-400 mt-2 font-light max-w-sm">
          The requested luxury developer dossier could not be retrieved from our archives.
        </p>
        <Link href="/developers" className="mt-6 text-xs text-luxury-gold hover:underline uppercase tracking-widest font-bold flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Developers</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link href="/developers" className="text-gray-400 hover:text-luxury-gold transition-colors duration-300 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 mb-6 select-none">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Developers</span>
        </Link>

        {/* Hero Card Overview */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 mb-10">
          {/* Logo container */}
          <div className="w-36 h-36 rounded-2xl bg-white border border-luxury-border/30 flex items-center justify-center p-4 shadow-xl shrink-0 self-center">
            {developer.logoUrl && developer.logoUrl.startsWith("http") ? (
              <div className="relative w-full h-full">
                <Image
                  src={developer.logoUrl}
                  alt={developer.name}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
            ) : (
              <Building2 className="w-14 h-14 text-luxury-charcoal" />
            )}
          </div>

          {/* Details Overview */}
          <div className="flex-grow flex flex-col justify-between text-center lg:text-left space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold bg-luxury-gold/5 border border-luxury-gold/25 px-2.5 py-1 rounded-full">
                  Master Developer Partner
                </span>
                {developer.isFeatured && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-400/5 border border-emerald-400/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 fill-emerald-400" />
                    <span>Featured Partner</span>
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif text-white">{developer.name}</h1>
              <p className="text-xs text-gray-400 font-light max-w-xl leading-relaxed mx-auto lg:mx-0">
                {developer.description || "Leading property developer delivering world-class residences, luxury master developments, and iconic commercial projects in primary freehold areas."}
              </p>
            </div>

            {/* Quick stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-luxury-border/10 pt-5 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Established</span>
                <span className="text-white font-sans text-xs">{developer.foundedYear || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Active Projects</span>
                <span className="text-white font-sans text-xs">{properties.length} Active Listings</span>
              </div>
              <div>
                <span className="block text-[8px] text-gray-500 mb-1">Communities</span>
                <span className="text-white font-sans text-xs">{communities.length} Locations</span>
              </div>
              {developer.website && (
                <div>
                  <span className="block text-[8px] text-gray-500 mb-1">Official Web</span>
                  <a href={developer.website} target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline lowercase font-sans text-xs flex items-center justify-center lg:justify-start gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{developer.website.replace("https://", "").replace("www.", "")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex gap-4 border-b border-luxury-border/20 mb-8 select-none overflow-x-auto pb-1">
          {[
            { id: "about", label: "Profile Dossier" },
            { id: "projects", label: "Master Communities" },
            { id: "listings", label: `Catalog Listings (${properties.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "about" | "projects" | "listings")}
              className={`text-[10px] uppercase tracking-widest font-bold pb-3 border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? "border-luxury-gold text-luxury-gold"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab views */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main section: Col span 2 */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "about" && (
              <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                    <Building2 className="w-4 h-4 text-luxury-gold" />
                    <span>Company Overview & History</span>
                  </h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {developer.name} is widely regarded as one of the most prominent master development houses in Dubai. Over the years, they have built iconic landmarks that define the Dubai skyline, delivering on a commitment to architectural excellence, meticulous engineering, and investor value.
                  </p>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    By partnering with Luxespace Properties, {developer.name} projects are backed by priority off-plan allocations, flexible developer payment schedules, and verified ready-to-move-in title deed validation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-luxury-border/10">
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-luxury-gold font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Investment Benefits</span>
                    </h4>
                    <ul className="text-xs text-gray-400 font-light space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>High historical capital appreciation rates</li>
                      <li>Elite master community construction standards</li>
                      <li>Extremely competitive post-handover payment plans</li>
                      <li>Consistent high net-rental ROI yields</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] text-luxury-gold font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Core Specialities</span>
                    </h4>
                    <ul className="text-xs text-gray-400 font-light space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Ultra-luxury beachfront villa communities</li>
                      <li>High-rise panoramic sky suites</li>
                      <li>Integrated family-centric golf estates</li>
                      <li>Iconic architectural design concepts</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-6">
                <h3 className="text-sm font-serif text-white uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                  <MapPin className="w-4 h-4 text-luxury-gold" />
                  <span>Master Communities Under Management</span>
                </h3>
                {communities.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No community operations registered currently.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {communities.map((comm) => (
                      <Link href={`/communities/${comm.slug}`} key={comm.id}>
                        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-luxury-charcoal relative overflow-hidden shrink-0">
                            <Image
                              src={comm.bannerUrl || "/assets/apartment_render.png"}
                              alt={comm.name}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif text-sm text-white group-hover:text-luxury-gold transition-colors duration-300">{comm.name}</h4>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Explore Location</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "listings" && (
              <div className="space-y-6">
                <h3 className="text-sm font-serif text-white uppercase tracking-widest flex items-center gap-2 border-b border-luxury-border/20 pb-3">
                  <Home className="w-4 h-4 text-luxury-gold" />
                  <span>Verified Listings in Catalog</span>
                </h3>
                {properties.length === 0 ? (
                  <div className="text-center py-10 bg-luxury-dark border border-luxury-border/30 rounded-2xl space-y-2">
                    <p className="text-xs text-gray-400 font-light">No properties are currently listed for this developer in our catalog.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {properties.map((property) => (
                      <PropertyCardLuxury key={property.id} property={property} viewMode="grid" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Col span 1 */}
          <div className="space-y-6">
            {/* Consultation Enquiry Card */}
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs text-luxury-gold font-bold uppercase tracking-widest border-b border-luxury-border/20 pb-3">
                Request Developer Info
              </h3>
              
              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center text-xs text-emerald-400">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-400 animate-bounce" />
                  <p className="font-bold">Thank you!</p>
                  <p className="font-light mt-1 text-[11px]">Your request has been filed. An advisor will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Full Name</label>
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
                      placeholder="john.doe@example.com"
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
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`I am interested in projects by ${developer.name}.`}
                      rows={3}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full py-2.5 text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5" disabled={submitting}>
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? "Sending..." : "Submit Enquiry"}</span>
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
