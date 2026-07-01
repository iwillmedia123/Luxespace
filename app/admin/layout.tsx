"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // If we are on the login portal, render full bleed without the sidebar and header
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[#1f232c] text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-charcoal text-white flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Panel Content */}
      <div className="flex-grow pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-luxury-border/30 px-8 flex items-center justify-between bg-luxury-dark/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Operational Portals
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-white">Administrator</span>
              <span className="text-[10px] text-luxury-gold uppercase tracking-wider font-medium">
                System Role
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-charcoal flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page content wrapper */}
        <main className="flex-1 p-8 bg-luxury-charcoal">
          {children}
        </main>
      </div>
    </div>
  );
}
