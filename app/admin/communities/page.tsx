"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X } from "lucide-react";
import { db } from "@/lib/db";
import { Community } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function CommunitiesManagerPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await db.getCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Communities load error:", err);
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
    setEditingCommunity(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsFeatured(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (comm: Community) => {
    setEditingCommunity(comm);
    setName(comm.name);
    setSlug(comm.slug);
    setDescription(comm.description || "");
    setIsFeatured(comm.isFeatured);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Community, "id" | "createdAt" | "updatedAt"> = {
      name,
      slug,
      description,
      isFeatured,
      bannerUrl: "/assets/palm_jumeirah_render.png",
    };

    try {
      if (editingCommunity) {
        await db.updateCommunity(editingCommunity.id, payload);
      } else {
        await db.createCommunity(payload);
      }

      const updated = await db.getCommunities();
      setCommunities(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this community?")) {
      setLoading(true);
      await db.deleteCommunity(id);
      const updated = await db.getCommunities();
      setCommunities(updated);
      setLoading(false);
    }
  };

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Catalog Management
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Communities</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Manage high-end residential areas and geographical enclaves in Dubai.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Community</span>
        </Button>
      </div>

      {/* Search Filter */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search communities by name..."
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
                <th className="py-4 px-6">Community Name</th>
                <th className="py-4 px-6">URL Slug</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Featured status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No communities found.
                  </td>
                </tr>
              ) : (
                filtered.map((comm) => (
                  <tr key={comm.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                    <td className="py-4.5 px-6 font-serif text-sm text-white">
                      {comm.name}
                    </td>
                    <td className="py-4.5 px-6 text-gray-300 font-mono text-[10px]">
                      /communities/{comm.slug}
                    </td>
                    <td className="py-4.5 px-6 text-gray-400 font-light truncate max-w-xs">
                      {comm.description}
                    </td>
                    <td className="py-4.5 px-6 capitalize text-gray-400">
                      {comm.isFeatured ? "Featured" : "Standard"}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleOpenEdit(comm)}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comm.id)}
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
                {editingCommunity ? "Modify Community" : "Add Community"}
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
                    Community Name
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

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                {/* Feature Status */}
                <div className="flex items-center gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="isFeaturedComm"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedComm" className="text-xs text-gray-300 font-light cursor-pointer select-none">
                    Feature on public homepage grid
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
                {editingCommunity ? "Save Changes" : "Create Community"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
