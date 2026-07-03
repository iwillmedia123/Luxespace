"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Building2,
  MapPin,
  Users,
  FileText,
  MessageSquare,
  Mail,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/developers", label: "Developers", icon: Building2 },
  { href: "/admin/communities", label: "Communities", icon: MapPin },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/blogs", label: "Blog CMS", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/leads", label: "Leads (CRM)", icon: Mail },
  { href: "/admin/newsletter", label: "Newsletter", icon: Newspaper },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/media-library", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    // If Supabase is active, log out session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    if (supabaseUrl) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    // Clear sandbox session cookie and local storage items
    document.cookie = "luxespace_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem("luxespace_admin_session");
    localStorage.removeItem("luxespace_admin_role");
    // Redirect to login page
    window.location.href = "/admin/login";
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-luxury-dark border-r border-luxury-border/30 flex flex-col justify-between z-30 select-none">
      <div className="flex-1 flex flex-col">
        {/* Header Branding */}
        <div className="h-16 px-6 border-b border-luxury-border/30 flex items-center gap-2.5">
          <div className="relative w-8 h-8 overflow-hidden rounded bg-luxury-charcoal border border-luxury-gold/20 flex items-center justify-center p-1">
            <Image
              src="/assets/logo.png"
              alt="Luxespace"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <span className="font-serif text-sm tracking-widest text-white uppercase block">
            Luxespace <span className="text-[9px] text-luxury-gold font-sans font-bold tracking-normal block leading-none">CMS Portal</span>
          </span>
        </div>

        {/* Navigation Link Lists */}
        <nav className="flex-grow py-6 px-3 space-y-1 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-xs tracking-wider uppercase font-semibold transition-all duration-300 relative group cursor-pointer",
                  isActive
                    ? "text-luxury-charcoal bg-luxury-gold font-bold shadow-md shadow-luxury-gold/10"
                    : "text-gray-400 hover:text-white hover:bg-luxury-charcoal/50"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-luxury-charcoal" : "text-luxury-gold group-hover:text-white")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer operations (Return to main site / Log out) */}
      <div className="p-4 border-t border-luxury-border/20 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-4.5 py-2.5 rounded-lg text-[10px] uppercase tracking-wider text-gray-500 hover:text-white transition-all duration-300 font-semibold cursor-pointer"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4.5 py-3 rounded-lg text-xs tracking-wider uppercase text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 font-semibold cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
