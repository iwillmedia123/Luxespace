"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Calendar, ArrowRight, TrendingUp, DollarSign, Percent, BarChart3 } from "lucide-react";
import { db } from "@/lib/db";
import { BlogPost } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import BlogCard from "@/components/cards/BlogCard";
import NewsletterSection from "@/components/layout/NewsletterSection";

export default function MarketInsightsPage() {
  const [reports, setReports] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const priceIndexCanvasRef = useRef<HTMLCanvasElement>(null);
  const yieldCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function loadReports() {
      try {
        const bls = await db.getBlogs();
        // Filter by category = Market Insights or Investment Guides
        const filtered = bls.filter(
          (b) =>
            (b.status === "published" || b.isPublished) &&
            (b.category === "Market Insights" || b.category === "Investment Guides")
        );
        setReports(filtered);
      } catch (err) {
        console.error("Error loading market reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  // Draw Price index line chart and ROI bar chart on canvas
  useEffect(() => {
    if (loading) return;

    // 1. Draw Price Index Chart
    const priceCanvas = priceIndexCanvasRef.current;
    if (priceCanvas) {
      const ctx = priceCanvas.getContext("2d");
      if (ctx) {
        const width = priceCanvas.width = priceCanvas.offsetWidth * window.devicePixelRatio;
        const height = priceCanvas.height = priceCanvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        const cssWidth = priceCanvas.offsetWidth;
        const cssHeight = priceCanvas.offsetHeight;

        ctx.clearRect(0, 0, cssWidth, cssHeight);

        // Chart parameters
        const padding = { top: 30, right: 20, bottom: 40, left: 50 };
        const chartWidth = cssWidth - padding.left - padding.right;
        const chartHeight = cssHeight - padding.top - padding.bottom;

        // Data points (Years 2022 to 2026)
        const years = ["2022", "2023", "2024", "2025", "2026"];
        const data = [120, 145, 180, 215, 250]; // Growth index

        // Draw grid lines
        ctx.strokeStyle = "rgba(224, 180, 107, 0.08)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
          const y = padding.top + (chartHeight / 4) * i;
          ctx.beginPath();
          ctx.moveTo(padding.left, y);
          ctx.lineTo(cssWidth - padding.right, y);
          ctx.stroke();

          // Y Axis Labels
          ctx.fillStyle = "#6b7280";
          ctx.font = "9px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          const val = Math.round(250 - (130 / 4) * i);
          ctx.fillText(`${val}k/sqft`, padding.left - 10, y);
        }

        // Draw line & gradient fill
        const points = data.map((val, i) => {
          const x = padding.left + (chartWidth / (data.length - 1)) * i;
          const y = padding.top + chartHeight - ((val - 100) / 150) * chartHeight;
          return { x, y };
        });

        // Gradient under line
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, "rgba(224, 180, 107, 0.15)");
        gradient.addColorStop(1, "rgba(224, 180, 107, 0.0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartHeight);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();

        // Line
        ctx.strokeStyle = "#e0b46b";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();

        // Points & Labels
        points.forEach((p, i) => {
          ctx.fillStyle = "#e0b46b";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#1f232c";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // X Axis labels
          ctx.fillStyle = "#9ca3af";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(years[i], p.x, padding.top + chartHeight + 12);
        });
      }
    }

    // 2. Draw ROI Yields Chart
    const yieldCanvas = yieldCanvasRef.current;
    if (yieldCanvas) {
      const ctx = yieldCanvas.getContext("2d");
      if (ctx) {
        const width = yieldCanvas.width = yieldCanvas.offsetWidth * window.devicePixelRatio;
        const height = yieldCanvas.height = yieldCanvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        const cssWidth = yieldCanvas.offsetWidth;
        const cssHeight = yieldCanvas.offsetHeight;

        ctx.clearRect(0, 0, cssWidth, cssHeight);

        const padding = { top: 20, right: 30, bottom: 20, left: 100 };
        const chartWidth = cssWidth - padding.left - padding.right;
        const chartHeight = cssHeight - padding.top - padding.bottom;

        // ROI Data
        const locations = ["JVC", "Dubai Marina", "Business Bay", "Downtown", "Palm Jumeirah"];
        const rois = [8.5, 7.2, 6.8, 6.5, 5.8]; // % yields

        const barHeight = chartHeight / locations.length;

        locations.forEach((loc, i) => {
          const y = padding.top + barHeight * i + (barHeight - 16) / 2;
          const barWidth = (rois[i] / 10) * chartWidth;

          // Bar Background Track
          ctx.fillStyle = "rgba(224, 180, 107, 0.04)";
          ctx.beginPath();
          ctx.roundRect(padding.left, y, chartWidth, 16, 4);
          ctx.fill();

          // Bar Gold Fill
          ctx.fillStyle = "#e0b46b";
          ctx.beginPath();
          ctx.roundRect(padding.left, y, barWidth, 16, 4);
          ctx.fill();

          // Y Label (Location)
          ctx.fillStyle = "#9ca3af";
          ctx.font = "9px sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          ctx.fillText(loc, padding.left - 12, y + 8);

          // Value inside/outside bar
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "left";
          ctx.fillText(`${rois[i]}%`, padding.left + barWidth + 8, y + 8);
        });
      }
    }
  }, [loading]);

  return (
    <main className="min-h-screen bg-[#1f232c] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-luxury-gold/[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Title */}
        <div className="border-b border-luxury-border/20 pb-8">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 font-bold select-none">
            <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-luxury-gold">Market Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-white mt-3">Advisory & Intelligence</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2.5 font-light max-w-2xl leading-relaxed">
            Data-backed indicators, yield tracking models, price appreciation forecasts, and prime sector analytics in Dubai.
          </p>
        </div>

        {/* Dynamic Analytics Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 select-none">
          {/* Chart 1: Price Index */}
          <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Price Appreciation Index</span>
                </span>
                <h3 className="font-serif text-lg text-white">5-Year Growth Curve</h3>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-bold">
                +108.3% CAGR
              </span>
            </div>
            
            <div className="h-64 w-full relative">
              <canvas ref={priceIndexCanvasRef} className="w-full h-full" />
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed font-light text-center uppercase tracking-wider">
              Dubai luxury villa price index growth tracker (AED/SQFT). Source: Luxespace Private Registry.
            </p>
          </div>

          {/* Chart 2: Rental Yields */}
          <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Rental Yield Performance</span>
                </span>
                <h3 className="font-serif text-lg text-white">Net ROI % by Master Community</h3>
              </div>
              <span className="text-[9px] font-mono text-luxury-gold bg-luxury-gold/5 px-2 py-0.5 rounded border border-luxury-gold/10 font-bold">
                7.1% Avg Net
              </span>
            </div>
            
            <div className="h-64 w-full relative">
              <canvas ref={yieldCanvasRef} className="w-full h-full" />
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed font-light text-center uppercase tracking-wider">
              Net rental return calculations factoring annual maintenance. Source: Luxespace Research.
            </p>
          </div>
        </section>

        {/* Investment Summaries Stat Boxes */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 select-none">
          <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-2">
            <div className="w-8 h-8 rounded bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/20">
              <DollarSign className="w-4 h-4 text-luxury-gold" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Average Yield</span>
            <Typography variant="section" className="text-xl font-serif text-white leading-none">
              6.8% - 8.5% Net ROI
            </Typography>
            <span className="text-[9px] text-emerald-400 font-light block">Leading global luxury capitals.</span>
          </div>

          <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-2">
            <div className="w-8 h-8 rounded bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/20">
              <TrendingUp className="w-4 h-4 text-luxury-gold" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Appreciation Rate</span>
            <Typography variant="section" className="text-xl font-serif text-white leading-none">
              +15.2% Year-on-Year
            </Typography>
            <span className="text-[9px] text-emerald-400 font-light block">Prime waterfront and golf communities.</span>
          </div>

          <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-2">
            <div className="w-8 h-8 rounded bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/20">
              <BarChart3 className="w-4 h-4 text-luxury-gold" />
            </div>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Off-Plan Segment</span>
            <Typography variant="section" className="text-xl font-serif text-white leading-none">
              64% Capital Allocation
            </Typography>
            <span className="text-[9px] text-gray-400 font-light block">Driven by signature brand releases.</span>
          </div>
        </section>

        {/* Dynamically List Editorial Market Reports & Investment Guides */}
        <section className="space-y-8 border-t border-luxury-border/20 pt-12">
          <div className="flex items-center justify-between border-b border-luxury-border/10 pb-4 mb-4 select-none">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Editorial briefs</span>
              <h2 className="text-2xl font-serif text-white">Investment Bulletins & Reports</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-luxury-gold font-bold hover:text-white transition-colors">
              <span>View All Publications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-96 bg-luxury-dark border border-luxury-border/20 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-luxury-dark/40 border border-luxury-border/10 rounded-2xl select-none">
              <p className="text-xs text-gray-500 italic">No investment bulletins are published at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reports.map((report) => (
                <BlogCard key={report.id} post={report} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Registrations */}
        <NewsletterSection />
      </div>
    </main>
  );
}
