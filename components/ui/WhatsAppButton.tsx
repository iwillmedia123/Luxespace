"use client";

import { MessageSquare } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/9745334644"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 left-8 z-40 w-11 h-11 rounded-full bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-500/20 flex items-center justify-center text-white shadow-2xl transition-all duration-300 focus:outline-none cursor-pointer group hover:scale-110 active:scale-95"
      aria-label="Contact on WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping opacity-75" />
      <span className="absolute -inset-1 rounded-full border border-emerald-500/30 scale-75 group-hover:scale-100 transition-all duration-300" />
      
      <MessageSquare className="w-5 h-5 relative z-10" />
    </a>
  );
}
