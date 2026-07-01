"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Building2,
  MapPin,
  FileText,
  MessageSquare,
  Mail,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { db } from "@/lib/db";
import { Property, Lead, Appointment } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface StatsState {
  totalProperties: number;
  forSale: number;
  forRent: number;
  featured: number;
  developersCount: number;
  communitiesCount: number;
  agentsCount: number;
  blogsCount: number;
  testimonialsCount: number;
  leadsCount: number;
  appointmentsCount: number;
  subscribersCount: number;
}

export default function OverviewPage() {
  const [stats, setStats] = useState<StatsState | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [latestProperty, setLatestProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check if Supabase keys are configured in local environment
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url || !key) {
      setDemoMode(true);
    }

    async function loadDashboardData() {
      try {
        const [
          properties,
          communities,
          developers,
          agents,
          blogs,
          testimonials,
          leads,
          appointments,
          subscribers,
        ] = await Promise.all([
          db.getProperties(),
          db.getCommunities(),
          db.getDevelopers(),
          db.getAgents(),
          db.getBlogs(),
          db.getTestimonials(),
          db.getLeads(),
          db.getAppointments(),
          db.getSubscribers(),
        ]);

        setStats({
          totalProperties: properties.length,
          forSale: properties.filter((p) => p.status === "buy").length,
          forRent: properties.filter((p) => p.status === "rent").length,
          featured: properties.filter((p) => p.isFeatured).length,
          developersCount: developers.length,
          communitiesCount: communities.length,
          agentsCount: agents.length,
          blogsCount: blogs.length,
          testimonialsCount: testimonials.length,
          leadsCount: leads.length,
          appointmentsCount: appointments.length,
          subscribersCount: subscribers.length,
        });

        // Set recent objects
        setRecentLeads(leads.slice(0, 4));
        setRecentAppointments(appointments.slice(0, 3));
        
        if (properties.length > 0) {
          // Sort by creation date or fallback
          const sorted = [...properties].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLatestProperty(sorted[0]);
        }
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl" />
          <div className="h-96 bg-luxury-dark/40 border border-luxury-border/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Headers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Luxespace Properties
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Real estate portfolio performance, advisory analytics, and private client leads.
          </p>
        </div>
        
        {/* Dynamic banner if environment keys are missing */}
        {demoMode && (
          <div className="bg-luxury-gold/5 border border-luxury-gold/25 rounded-xl px-4 py-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-luxury-gold font-bold">
            <AlertTriangle className="w-4 h-4 text-luxury-gold" />
            <span>High-Fidelity Demo Sandbox Mode</span>
          </div>
        )}
      </div>

      {/* Grid 1: Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total properties */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold group-hover:text-luxury-gold transition-colors">
              Total Properties
            </span>
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <Typography variant="stat" className="text-3xl font-serif text-white font-bold block">
              {stats.totalProperties}
            </Typography>
            <div className="flex gap-3 text-[10px] text-gray-400 font-light">
              <span>{stats.forSale} For Sale</span>
              <span>•</span>
              <span>{stats.forRent} For Rent</span>
            </div>
          </div>
        </div>

        {/* Card 2: CRM Leads */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold group-hover:text-luxury-gold transition-colors">
              Active Enquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <Typography variant="stat" className="text-3xl font-serif text-white font-bold block">
              {stats.leadsCount}
            </Typography>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14% inbound this week</span>
            </div>
          </div>
        </div>

        {/* Card 3: Appointments */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold group-hover:text-luxury-gold transition-colors">
              Advisory Viewings
            </span>
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <Typography variant="stat" className="text-3xl font-serif text-white font-bold block">
              {stats.appointmentsCount}
            </Typography>
            <div className="flex gap-2 text-[10px] text-gray-400 font-light">
              <span>Next viewing scheduled in 48h</span>
            </div>
          </div>
        </div>

        {/* Card 4: Subscribers */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 hover:border-luxury-gold/30 transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold group-hover:text-luxury-gold transition-colors">
              Newsletter List
            </span>
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <Typography variant="stat" className="text-3xl font-serif text-white font-bold block">
              {stats.subscribersCount}
            </Typography>
            <div className="flex gap-2 text-[10px] text-gray-400 font-light">
              <span>Subscribed to private catalog releases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: Mini KPIs Sub-stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Developers", count: stats.developersCount, icon: Building2, href: "/admin/developers" },
          { label: "Communities", count: stats.communitiesCount, icon: MapPin, href: "/admin/communities" },
          { label: "Active Agents", count: stats.agentsCount, icon: Users, href: "/admin/agents" },
          { label: "Blog Posts", count: stats.blogsCount, icon: FileText, href: "/admin/blogs" },
          { label: "Testimonials", count: stats.testimonialsCount, icon: MessageSquare, href: "/admin/testimonials" },
          { label: "Featured Listings", count: stats.featured, icon: Layers, href: "/admin/properties" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="bg-luxury-dark/40 border border-luxury-border/20 rounded-xl p-4 flex items-center gap-3 hover:border-luxury-gold/25 transition-all duration-300 cursor-pointer"
            >
              <div className="w-8 h-8 rounded bg-luxury-charcoal flex items-center justify-center text-luxury-gold shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[14px] font-bold text-white block truncate leading-none">
                  {item.count}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold block truncate mt-1">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid 3: Analytical Charts and CRM widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Lead Trends vector chart */}
        <div className="lg:col-span-2 bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">
                Performance Analytics
              </span>
              <h3 className="text-lg font-serif text-white leading-none">
                Inbound Lead Velocity
              </h3>
            </div>
            <div className="flex gap-2">
              <span className="bg-luxury-gold/5 border border-luxury-gold/25 text-luxury-gold text-[8px] uppercase tracking-wider font-bold rounded px-2.5 py-1">
                YTD Metrics
              </span>
            </div>
          </div>

          {/* High-Fidelity SVG Line Graph */}
          <div className="w-full h-64 relative pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full text-luxury-gold overflow-visible" fill="none">
              {/* Grid Lines */}
              <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <line x1="0" y1="10" x2="500" y2="10" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* Area Under Curve Gradient */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f1d99b" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f1d99b" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 180 Q 90 140 170 120 T 330 60 T 490 20 L 490 180 Z"
                fill="url(#chartGrad)"
              />

              {/* Curve Line */}
              <path
                d="M 10 180 Q 90 140 170 120 T 330 60 T 490 20"
                stroke="#f1d99b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              <circle cx="170" cy="120" r="4" className="fill-luxury-gold stroke-luxury-dark stroke-2" />
              <circle cx="330" cy="60" r="4" className="fill-luxury-gold stroke-luxury-dark stroke-2" />
              <circle cx="490" cy="20" r="4" className="fill-luxury-gold stroke-luxury-dark stroke-2" />

              {/* Months Text Labels */}
              <text x="10" y="195" fill="gray" fontSize="8" textAnchor="middle" className="font-semibold uppercase tracking-wider">Jan</text>
              <text x="130" y="195" fill="gray" fontSize="8" textAnchor="middle" className="font-semibold uppercase tracking-wider">Mar</text>
              <text x="250" y="195" fill="gray" fontSize="8" textAnchor="middle" className="font-semibold uppercase tracking-wider">May</text>
              <text x="370" y="195" fill="gray" fontSize="8" textAnchor="middle" className="font-semibold uppercase tracking-wider">Jul</text>
              <text x="490" y="195" fill="gray" fontSize="8" textAnchor="middle" className="font-semibold uppercase tracking-wider">Sep</text>
            </svg>
          </div>
        </div>

        {/* Right Col: Quick actions & Latest property */}
        <div className="space-y-6">
          {/* Quick actions panel */}
          <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif text-white">Quick Actions</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <Link href="/admin/properties">
                <button className="w-full flex items-center justify-between bg-luxury-charcoal hover:bg-luxury-gold/5 border border-luxury-border/30 hover:border-luxury-gold/30 rounded-xl px-4 py-3 text-xs text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Plus className="w-4 h-4 text-luxury-gold" />
                    <span>Upload New Property</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </Link>
              
              <Link href="/admin/appointments">
                <button className="w-full flex items-center justify-between bg-luxury-charcoal hover:bg-luxury-gold/5 border border-luxury-border/30 hover:border-luxury-gold/30 rounded-xl px-4 py-3 text-xs text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-luxury-gold" />
                    <span>Schedule Client Viewing</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </Link>
              
              <Link href="/admin/leads">
                <button className="w-full flex items-center justify-between bg-luxury-charcoal hover:bg-luxury-gold/5 border border-luxury-border/30 hover:border-luxury-gold/30 rounded-xl px-4 py-3 text-xs text-gray-300 hover:text-white transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-luxury-gold" />
                    <span>Record Manual Lead</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </Link>
            </div>
          </div>

          {/* Latest property added widget */}
          {latestProperty && (
            <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  Latest Listing
                </h3>
                <span className="text-[8px] bg-luxury-gold/10 text-luxury-gold uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-luxury-gold/20">
                  {latestProperty.status}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg bg-luxury-charcoal overflow-hidden shrink-0 border border-luxury-border/30">
                  <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400">
                    <Compass className="w-4 h-4 text-luxury-gold/50" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm text-white truncate">
                    {latestProperty.title}
                  </h4>
                  <span className="text-xs text-luxury-gold block font-semibold mt-1">
                    AED {latestProperty.price.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-500 block truncate mt-0.5">
                    {latestProperty.location}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid 4: Recent Leads & Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: CRM Leads List */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
            <h3 className="text-sm font-serif text-white">Recent Leads (CRM)</h3>
            <Link href="/admin/leads" className="text-[10px] uppercase tracking-wider text-luxury-gold hover:text-white transition-colors font-bold cursor-pointer">
              View CRM
            </Link>
          </div>

          <div className="divide-y divide-luxury-border/20">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No inbound enquiries received yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs text-white font-medium block">
                      {lead.firstName} {lead.lastName}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                      {lead.email} • {lead.phone}
                    </span>
                  </div>
                  <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                    lead.status === "new"
                      ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Appointments List */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border/20 pb-3">
            <h3 className="text-sm font-serif text-white">Upcoming Viewings</h3>
            <Link href="/admin/appointments" className="text-[10px] uppercase tracking-wider text-luxury-gold hover:text-white transition-colors font-bold cursor-pointer">
              View Calendar
            </Link>
          </div>

          <div className="divide-y divide-luxury-border/20">
            {recentAppointments.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No viewing appointments scheduled.</p>
            ) : (
              recentAppointments.map((app) => (
                <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-white font-medium block">
                      Viewing Appointment
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {new Date(app.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <span className="text-[8px] bg-luxury-gold/5 text-luxury-gold border border-luxury-gold/20 uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                    {app.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
