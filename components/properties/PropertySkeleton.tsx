"use client";

import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface PropertySkeletonProps {
  viewMode?: "grid" | "list";
}

export default function PropertySkeleton({ viewMode = "grid" }: PropertySkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card className="p-0 flex flex-col md:flex-row group overflow-hidden border-luxury-border/30 animate-pulse min-h-[220px]">
        {/* Image Box */}
        <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto bg-luxury-charcoal/40 shrink-0" />
        
        {/* Content Area */}
        <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-grow">
                <div className="h-3 w-1/4 bg-luxury-charcoal/40 rounded" />
                <div className="h-6 w-3/4 bg-luxury-charcoal/40 rounded" />
              </div>
              <div className="h-6 w-24 bg-luxury-charcoal/40 rounded shrink-0" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-luxury-charcoal/40 rounded" />
              <div className="h-3 w-5/6 bg-luxury-charcoal/40 rounded" />
            </div>
          </div>

          <div className="flex gap-4 border-t border-b border-luxury-border/10 py-3.5">
            <div className="h-4 w-12 bg-luxury-charcoal/40 rounded" />
            <div className="h-4 w-12 bg-luxury-charcoal/40 rounded" />
            <div className="h-4 w-16 bg-luxury-charcoal/40 rounded" />
          </div>

          <div className="flex justify-between items-center pt-1">
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-full bg-luxury-charcoal/40" />
              <div className="h-9 w-9 rounded-full bg-luxury-charcoal/40" />
            </div>
            <div className="h-9 w-28 bg-luxury-charcoal/40 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 flex flex-col group h-full border-luxury-border/30 animate-pulse">
      {/* Image Block */}
      <div className="relative aspect-[4/3] bg-luxury-charcoal/40 shrink-0" />

      {/* Content Block */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-3 w-1/3 bg-luxury-charcoal/40 rounded" />
          <div className="h-5 w-4/5 bg-luxury-charcoal/40 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-luxury-charcoal/40 rounded" />
            <div className="h-3 w-2/3 bg-luxury-charcoal/40 rounded" />
          </div>
        </div>

        {/* Spec row */}
        <div className="grid grid-cols-3 border-t border-luxury-border/10 pt-4 gap-4">
          <div className="h-6 bg-luxury-charcoal/40 rounded" />
          <div className="h-6 bg-luxury-charcoal/40 rounded" />
          <div className="h-6 bg-luxury-charcoal/40 rounded" />
        </div>

        {/* Buttons row */}
        <div className="pt-2 flex gap-2">
          <div className="h-9 w-9 bg-luxury-charcoal/40 rounded-lg shrink-0" />
          <div className="h-9 w-9 bg-luxury-charcoal/40 rounded-lg shrink-0" />
          <div className="h-9 bg-luxury-charcoal/40 rounded-lg flex-grow" />
        </div>
      </div>
    </Card>
  );
}
