"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Star } from "lucide-react";
import { db } from "@/lib/db";
import { Testimonial } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function TestimonialsManagerPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form Fields
  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await db.getTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error("Testimonials load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setClientName("");
    setClientTitle("Director, Capital Corp");
    setRating(5);
    setContent("");
    setIsFeatured(false);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (test: Testimonial) => {
    setEditingTestimonial(test);
    setClientName(test.clientName);
    setClientTitle(test.clientTitle || "");
    setRating(test.rating);
    setContent(test.content);
    setIsFeatured(test.isFeatured);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Testimonial, "id" | "createdAt"> = {
      clientName,
      clientTitle,
      rating,
      content,
      isFeatured,
      avatarUrl: undefined,
    };

    try {
      if (editingTestimonial) {
        await db.updateTestimonial(editingTestimonial.id, payload);
      } else {
        await db.createTestimonial(payload);
      }

      const updated = await db.getTestimonials();
      setTestimonials(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setLoading(true);
      await db.deleteTestimonial(id);
      const updated = await db.getTestimonials();
      setTestimonials(updated);
      setLoading(false);
    }
  };

  const filtered = testimonials.filter((t) =>
    t.clientName.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Client Opinions
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Testimonials</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Manage your advisory testimonials, client ratings, and quotes displayed on the public site.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      {/* Search Filter */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search testimonials by client name..."
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
                <th className="py-4 px-6">Client Details</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Review Content</th>
                <th className="py-4 px-6">Featured status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                filtered.map((test) => (
                  <tr key={test.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="space-y-1">
                        <span className="font-serif text-sm text-white block">
                          {test.clientName}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-light">
                          {test.clientTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="flex gap-0.5 text-luxury-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < test.rating ? "fill-luxury-gold" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-gray-300 font-light max-w-xs truncate italic">
                      &ldquo;{test.content}&rdquo;
                    </td>
                    <td className="py-4.5 px-6 capitalize text-gray-400">
                      {test.isFeatured ? "Featured" : "Standard"}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleOpenEdit(test)}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(test.id)}
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
                {editingTestimonial ? "Modify Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="h-[calc(100vh-9rem)] overflow-y-auto p-8 space-y-6" data-lenis-prevent>
              <div className="space-y-4">
                {/* Client Name */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Client Title / Position */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Client Title / Position
                  </label>
                  <input
                    type="text"
                    value={clientTitle}
                    onChange={(e) => setClientTitle(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Rating selection */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded bg-luxury-charcoal border transition-all duration-300 ${
                          rating >= star
                            ? "border-luxury-gold/40 text-luxury-gold"
                            : "border-luxury-border/20 text-gray-600"
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Review / Quote Content
                  </label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Feature Status */}
                <div className="flex items-center gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="isFeaturedTest"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedTest" className="text-xs text-gray-300 font-light cursor-pointer select-none">
                    Feature on homepage slider
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
                {editingTestimonial ? "Save Changes" : "Create Testimonial"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
