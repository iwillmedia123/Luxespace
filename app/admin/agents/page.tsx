"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X } from "lucide-react";
import { db } from "@/lib/db";
import { Agent } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function AgentsManagerPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [specializationText, setSpecializationText] = useState("");
  const [experienceYears, setExperienceYears] = useState(5);
  const [bio, setBio] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await db.getAgents();
        setAgents(data);
      } catch (err) {
        console.error("Agents load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleOpenAdd = () => {
    setEditingAgent(null);
    setName("");
    setSlug("");
    setTitle("Senior Investment Advisor");
    setEmail("");
    setPhone("");
    setWhatsapp("");
    setLanguagesText("English, Arabic");
    setSpecializationText("Palm Jumeirah, Luxury Villas");
    setExperienceYears(5);
    setBio("");
    setIsFeatured(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (ag: Agent) => {
    setEditingAgent(ag);
    setName(ag.name);
    setSlug(ag.slug);
    setTitle(ag.title);
    setEmail(ag.email);
    setPhone(ag.phone);
    setWhatsapp(ag.whatsapp || "");
    setLanguagesText(ag.languages ? ag.languages.join(", ") : "");
    setSpecializationText(ag.specialization ? ag.specialization.join(", ") : "");
    setExperienceYears(ag.experienceYears || 5);
    setBio(ag.bio || "");
    setIsFeatured(ag.isFeatured);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Agent, "id" | "createdAt" | "updatedAt"> = {
      name,
      slug,
      title,
      email,
      phone,
      whatsapp,
      languages: languagesText.split(",").map((s) => s.trim()).filter(Boolean),
      specialization: specializationText.split(",").map((s) => s.trim()).filter(Boolean),
      experienceYears,
      bio,
      isFeatured,
      avatarUrl: "/assets/logo.png",
    };

    try {
      if (editingAgent) {
        await db.updateAgent(editingAgent.id, payload);
      } else {
        await db.createAgent(payload);
      }

      const updated = await db.getAgents();
      setAgents(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      setLoading(true);
      await db.deleteAgent(id);
      const updated = await db.getAgents();
      setAgents(updated);
      setLoading(false);
    }
  };

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Catalog Management
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Agents</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Manage your advisory consultants, contact details, and languages spoken.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Agent</span>
        </Button>
      </div>

      {/* Search Filter */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search agents by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table list */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-luxury-border/20 text-gray-500 text-[9px] uppercase tracking-wider font-semibold bg-luxury-charcoal/20">
                <th className="py-4 px-6">Agent Details</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">Featured status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No agents found.
                  </td>
                </tr>
              ) : (
                filtered.map((ag) => (
                  <tr key={ag.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="space-y-1">
                        <span className="font-serif text-sm text-white block">
                          {ag.name}
                        </span>
                        <span className="text-[10px] text-luxury-gold uppercase tracking-wider font-bold">
                          {ag.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-gray-300">
                      {ag.email}
                    </td>
                    <td className="py-4.5 px-6 text-gray-300">
                      {ag.phone}
                    </td>
                    <td className="py-4.5 px-6 text-gray-400">
                      {ag.experienceYears || 5} Years
                    </td>
                    <td className="py-4.5 px-6 capitalize text-gray-400">
                      {ag.isFeatured ? "Featured" : "Standard"}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleOpenEdit(ag)}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ag.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end">
          <div className="w-full max-w-md bg-luxury-dark border-l border-luxury-border/30 h-full flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="h-16 px-8 border-b border-luxury-border/20 flex items-center justify-between shrink-0">
              <h2 className="font-serif text-lg text-white">
                {editingAgent ? "Modify Agent profile" : "Add Agent profile"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow p-8 overflow-y-auto space-y-6">
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Position Title */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Position Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Experience Years */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Experience Years
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Languages spoken */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Languages Spoken (comma separated)
                  </label>
                  <input
                    type="text"
                    value={languagesText}
                    onChange={(e) => setLanguagesText(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    placeholder="English, Arabic, French"
                  />
                </div>

                {/* Specialization */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Specializations (comma separated)
                  </label>
                  <input
                    type="text"
                    value={specializationText}
                    onChange={(e) => setSpecializationText(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    placeholder="Palm Jumeirah, Beachfront"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Biography (Bio)
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                {/* Feature Status */}
                <div className="flex items-center gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="isFeaturedAgent"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedAgent" className="text-xs text-gray-300 font-light cursor-pointer select-none">
                    Feature on advisor listings
                  </label>
                </div>
              </div>
            </form>

            <div className="h-20 px-8 border-t border-luxury-border/20 flex items-center justify-end gap-4 shrink-0 bg-luxury-dark">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                className="text-xs"
              >
                {editingAgent ? "Save Changes" : "Create Agent"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
