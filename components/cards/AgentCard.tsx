import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { Agent } from "@/types";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

export interface AgentCardProps {
  agent: Agent;
  className?: string;
}

export default function AgentCard({ agent, className }: AgentCardProps) {
  return (
    <Card className={cn("p-0 flex flex-col group h-full bg-luxury-dark border-luxury-border/30 overflow-hidden", className)}>
      {/* Agent Avatar Frame */}
      <div className="relative aspect-[3/4] overflow-hidden bg-luxury-charcoal">
        {agent.avatarUrl ? (
          <Image
            src={agent.avatarUrl}
            alt={agent.name}
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-serif text-3xl">
            {agent.name.split(" ").map(n => n.charAt(0)).join("")}
          </div>
        )}

        {/* Hover quick links panel */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <a
            href={`tel:${agent.phone}`}
            className="flex-1 bg-luxury-dark/95 border border-white/10 hover:border-luxury-gold py-2 rounded-lg flex items-center justify-center text-white hover:text-luxury-gold transition-colors duration-300"
            aria-label="Call Agent"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a
            href={`https://wa.me/${agent.whatsapp || agent.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-luxury-dark/95 border border-white/10 hover:border-luxury-gold py-2 rounded-lg flex items-center justify-center text-white hover:text-luxury-gold transition-colors duration-300"
            aria-label="WhatsApp Agent"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="flex-1 bg-luxury-dark/95 border border-white/10 hover:border-luxury-gold py-2 rounded-lg flex items-center justify-center text-white hover:text-luxury-gold transition-colors duration-300"
            aria-label="Email Agent"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Name and Designation Info */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-1 text-center">
          <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold">
            {agent.title}
          </span>
          <h3 className="font-serif text-lg text-white group-hover:text-luxury-gold transition-colors duration-300">
            {agent.name}
          </h3>
        </div>

        {/* Languages and Area Specialization */}
        <div className="space-y-2 border-t border-luxury-border/20 pt-4 text-xs text-gray-400">
          {agent.specialization && agent.specialization.length > 0 && (
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500 uppercase tracking-wider font-semibold">Focus Areas</span>
              <span className="text-white font-medium line-clamp-1">{agent.specialization.slice(0, 2).join(", ")}</span>
            </div>
          )}
          
          {agent.languages && agent.languages.length > 0 && (
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500 uppercase tracking-wider font-semibold">Languages</span>
              <span className="text-white font-medium line-clamp-1">{agent.languages.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <div className="pt-2 text-center">
          <Link
            href={`/agents/${agent.slug}`}
            className="inline-flex items-center justify-center gap-1 text-[9px] uppercase tracking-widest text-gray-400 hover:text-luxury-gold font-bold transition-all duration-300 w-full py-2.5 rounded-lg border border-luxury-border/40 hover:border-luxury-gold/50"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
