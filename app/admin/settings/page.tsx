"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, ShieldAlert, Globe, Server, BarChart3, HelpCircle, Users, Plus, Trash2, Shield } from "lucide-react";
import { db } from "@/lib/db";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Form States
  const [companyName, setCompanyName] = useState("Luxespace Properties");
  const [email, setEmail] = useState("luxespace@gmail.com");
  const [phone, setPhone] = useState("9745334644");
  const [address, setAddress] = useState("Downtown Boulevard Tower 1, Dubai, UAE");
  const [resendApiKey, setResendApiKey] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/9745334644");
  const [instagramLink, setInstagramLink] = useState("https://instagram.com/luxespace");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");

  // Admin Accounts States
  const [adminsList, setAdminsList] = useState<Record<string, string>[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await db.getSettings();
        if (data) {
          setCompanyName(data.companyName || "Luxespace Properties");
          setEmail(data.email || "luxespace@gmail.com");
          setPhone(data.phone || "9745334644");
          setAddress(data.address || "Downtown Boulevard Tower 1, Dubai, UAE");
          setResendApiKey(data.resendApiKey || "");
          setWhatsappLink(data.whatsappLink || "https://wa.me/9745334644");
          setInstagramLink(data.instagramLink || "https://instagram.com/luxespace");
          setGoogleAnalyticsId(data.googleAnalyticsId || "");
          setMetaPixelId(data.metaPixelId || "");
        }
      } catch (err) {
        console.error("Load settings error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    function loadAdmins() {
      if (typeof window !== "undefined") {
        const adminsJSON = localStorage.getItem("luxespace_admins");
        if (adminsJSON) {
          try {
            setAdminsList(JSON.parse(adminsJSON));
          } catch (e) {
            setAdminsList([]);
          }
        } else {
          const defaultAdmin = {
            id: "admin-default",
            username: "admin@luxespace.com",
            password: "admin",
            role: "super_admin",
            createdAt: new Date().toISOString()
          };
          localStorage.setItem("luxespace_admins", JSON.stringify([defaultAdmin]));
          setAdminsList([defaultAdmin]);
        }
      }
    }

    loadSettings();
    loadAdmins();
  }, []);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminSuccess("");

    if (!newAdminUsername || !newAdminPassword) {
      setAdminError("Please provide both email/username and password.");
      return;
    }

    if (!newAdminUsername.includes("@")) {
      setAdminError("Please enter a valid email address.");
      return;
    }

    const matches = adminsList.find(a => a.username.toLowerCase() === newAdminUsername.toLowerCase());
    if (matches) {
      setAdminError("An administrator with this email already exists.");
      return;
    }

    const newAdmin = {
      id: "admin-" + Math.random().toString(36).substr(2, 9),
      username: newAdminUsername,
      password: newAdminPassword,
      role: newAdminRole,
      createdAt: new Date().toISOString()
    };

    const updatedList = [...adminsList, newAdmin];
    localStorage.setItem("luxespace_admins", JSON.stringify(updatedList));
    setAdminsList(updatedList);

    setNewAdminUsername("");
    setNewAdminPassword("");
    setAdminSuccess("Administrator created successfully.");
    setTimeout(() => setAdminSuccess(""), 4000);
  };

  const handleDeleteAdmin = (id: string) => {
    setAdminError("");
    setAdminSuccess("");

    if (id === "admin-default") {
      setAdminError("Cannot delete the default backup system admin.");
      return;
    }

    const updatedList = adminsList.filter(a => a.id !== id);
    localStorage.setItem("luxespace_admins", JSON.stringify(updatedList));
    setAdminsList(updatedList);

    setAdminSuccess("Administrator deleted successfully.");
    setTimeout(() => setAdminSuccess(""), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      companyName,
      email,
      phone,
      address,
      resendApiKey,
      whatsappLink,
      instagramLink,
      googleAnalyticsId,
      metaPixelId,
    };

    try {
      await db.updateSettings(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !success) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-luxury-dark/40 rounded-xl" />
        <div className="h-96 bg-luxury-dark/40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Portal Control
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">System Settings</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Update company details, SMTP mailers, analytics keys, and public contact information.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="flex items-center gap-2 text-xs hover:shadow-[0_0_20px_rgba(241,217,155,0.2)]"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </Button>
      </div>

      {/* Success alert */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex gap-3 text-xs text-emerald-400 backdrop-blur-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p>System configuration saved successfully. Global keys reloaded.</p>
        </div>
      )}

      {/* Settings Sections Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1: General Branding details */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
            <Globe className="w-4 h-4 text-luxury-gold" />
            <span>General Branding</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Physical Office Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Col 2: Integrations (SMTP & Resend) */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
            <Server className="w-4 h-4 text-luxury-gold" />
            <span>SMTP / Mailer API</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                Resend API Token
              </label>
              <input
                type="password"
                value={resendApiKey}
                placeholder="re_••••••••••••••••"
                onChange={(e) => setResendApiKey(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
              <p className="text-[8px] text-gray-500 uppercase tracking-wider font-semibold">
                Used to trigger automated email summaries of viewing appointments to agents.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                WhatsApp Chat Link
              </label>
              <input
                type="url"
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Instagram Profile Link
              </label>
              <input
                type="url"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Col 3: Analytics IDs */}
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-serif text-white flex items-center gap-2 border-b border-luxury-border/20 pb-3">
            <BarChart3 className="w-4 h-4 text-luxury-gold" />
            <span>SEO & Analytics Tracking</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={googleAnalyticsId}
                placeholder="G-XXXXXXXXXX"
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                Meta Pixel tracking ID
              </label>
              <input
                type="text"
                value={metaPixelId}
                placeholder="123456789012345"
                onChange={(e) => setMetaPixelId(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Administrators Management Section */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-6 mt-8 space-y-6">
        <div className="border-b border-luxury-border/20 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-luxury-gold" />
            <div>
              <h3 className="text-sm font-serif text-white uppercase tracking-wider">Administrative Credentials</h3>
              <p className="text-[10px] text-gray-400 font-light mt-0.5">Create and manage security logins for dashboard administrators.</p>
            </div>
          </div>
        </div>

        {/* Error/Success alerts */}
        {adminError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-400">
            {adminError}
          </div>
        )}
        {adminSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-400">
            {adminSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Admin Form */}
          <form onSubmit={handleAddAdmin} className="space-y-4 lg:col-span-1 border-r border-luxury-border/10 pr-0 lg:pr-8">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Plus className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Create Administrator</span>
            </h4>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Email / Username</label>
              <input
                type="email"
                value={newAdminUsername}
                onChange={(e) => setNewAdminUsername(e.target.value)}
                placeholder="advisor@luxespace.com"
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Password</label>
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">Role Level</label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value)}
                className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="admin">Administrator / Editor</option>
                <option value="super_admin">Super Administrator</option>
              </select>
            </div>

            <Button type="submit" size="sm" className="w-full text-[10px] py-2 flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Button>
          </form>

          {/* Admin List Table */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Active Accounts ({adminsList.length})</span>
            </h4>

            <div className="bg-[#1f232c]/50 rounded-xl border border-luxury-border/30 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-luxury-border/20 bg-[#1f232c] text-[8px] uppercase tracking-widest text-gray-400 font-semibold">
                    <th className="py-2.5 px-4">Username</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Created Date</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-border/10 text-xs text-white">
                  {adminsList.map((adm) => (
                    <tr key={adm.id} className="hover:bg-luxury-dark/40 transition-colors duration-150">
                      <td className="py-3 px-4 font-light text-gray-200">{adm.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-semibold border ${
                          adm.role === "super_admin" 
                            ? "bg-luxury-gold/10 border-luxury-gold/30 text-luxury-gold" 
                            : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                        }`}>
                          {adm.role === "super_admin" ? "Super Admin" : "Editor"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-gray-500 font-light">
                        {new Date(adm.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {adm.id === "admin-default" ? (
                          <span className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold italic">System Backup</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(adm.id)}
                            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer p-1"
                            title="Delete Admin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
