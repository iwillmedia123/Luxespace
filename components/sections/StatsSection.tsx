"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { gsap } from "gsap";
import Typography from "@/components/ui/Typography";

export interface StatItemProps {
  number: number;
  suffix: string;
  label: string;
}

function AnimatedCounter({ number, suffix, label }: StatItemProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    if (isInView) {
      gsap.to(countRef.current, {
        val: number,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          setDisplayVal(Math.floor(countRef.current.val));
        },
      });
    }
  }, [isInView, number]);

  return (
    <div ref={ref} className="text-center space-y-2 py-4">
      <Typography variant="stat" className="text-luxury-gold font-bold font-serif text-5xl sm:text-6xl lg:text-7xl block">
        {displayVal}
        {suffix}
      </Typography>
      <Typography variant="caption" className="text-gray-400 font-light tracking-widest uppercase block text-[10px]">
        {label}
      </Typography>
    </div>
  );
}

export default function StatsSection() {
  const stats: StatItemProps[] = [
    { number: 150, suffix: "+", label: "Luxury Properties" },
    { number: 50, suffix: "+", label: "Trusted Developers" },
    { number: 98, suffix: "%", label: "Client Satisfaction" },
    { number: 15, suffix: "+", label: "Years Combined Experience" },
  ];

  return (
    <div className="w-full bg-luxury-dark/40 backdrop-blur-md border border-luxury-border/30 rounded-3xl p-8 sm:p-12 lg:p-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-luxury-border/20">
        {stats.map((stat, i) => (
          <div key={i} className={i >= 2 ? "pt-8 md:pt-0" : ""}>
            <AnimatedCounter
              number={stat.number}
              suffix={stat.suffix}
              label={stat.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
