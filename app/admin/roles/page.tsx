import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Roles & Permissions | Security Portal",
  description: "Control RBAC structures and access limits.",
};

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-luxury-border/20 pb-4">
        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Luxespace Admin</span>
        <h1 className="text-3xl font-serif text-white mt-1">Roles</h1>
        <p className="text-xs text-gray-400 mt-1">Control RBAC structures and access limits.</p>
      </div>

      <div className="h-[500px] border border-dashed border-luxury-border/30 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Roles Interface Structure (Ready to receive admin modules)
      </div>
    </div>
  );
}
