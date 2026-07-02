"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { BlogPost, Agent } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [tagsText, setTagsText] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [data, ags] = await Promise.all([
          db.getBlogs(),
          db.getAgents(),
        ]);
        setBlogs(data);
        setAgents(ags);
        if (ags.length > 0) setAuthorId(ags[0].id);
      } catch (err) {
        console.error("Blogs load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setIsPublished(false);
    setTagsText("Market Report, Luxury Living");
    if (agents.length > 0) setAuthorId(agents[0].id);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingBlog(post);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setIsPublished(post.isPublished);
    setTagsText(post.tags ? post.tags.join(", ") : "");
    setAuthorId(post.authorId);
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> = {
      title,
      slug,
      summary,
      content,
      isPublished,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      authorId,
      publishedAt: isPublished ? new Date().toISOString() : undefined,
      coverImage: "/assets/apartment_render.png",
    };

    try {
      if (editingBlog) {
        await db.updateBlog(editingBlog.id, payload);
      } else {
        await db.createBlog(payload);
      }

      const updated = await db.getBlogs();
      setBlogs(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setLoading(true);
      await db.deleteBlog(id);
      const updated = await db.getBlogs();
      setBlogs(updated);
      setLoading(false);
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) || b.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Editorial CMS
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Blogs & Publications</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Publish real estate investment updates, advisory briefings, and market analysis.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Publication</span>
        </Button>
      </div>

      {/* Search Filter */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles by title..."
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
                <th className="py-4 px-6">Article Details</th>
                <th className="py-4 px-6">Tags</th>
                <th className="py-4 px-6">Publication Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No articles found.
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="space-y-1">
                        <span className="font-serif text-sm text-white block">
                          {post.title}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate max-w-sm font-light">
                          {post.summary}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-gray-300">
                      {post.tags ? post.tags.join(", ") : ""}
                    </td>
                    <td className="py-4.5 px-6 text-gray-400 font-light">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Not Published"}
                    </td>
                    <td className="py-4.5 px-6">
                      {post.isPublished ? (
                        <span className="text-emerald-400 text-[9px] uppercase tracking-wider font-bold">
                          Published
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[9px] uppercase tracking-wider font-bold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
          <div className="w-full max-w-xl bg-luxury-dark border-l border-luxury-border/30 h-full flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="h-16 px-8 border-b border-luxury-border/20 flex items-center justify-between shrink-0">
              <h2 className="font-serif text-lg text-white">
                {editingBlog ? "Modify Article" : "Log New Article"}
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
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
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

                {/* Author */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Assigned Author
                  </label>
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.title})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Summary / Subtitle
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Content body (Markdown/HTML)
                  </label>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none font-mono"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Editorial Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsText}
                    onChange={(e) => setTagsText(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    placeholder="Market Outlook, Luxury Living"
                  />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-2.5 pt-4">
                  <input
                    type="checkbox"
                    id="isPublishedPost"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isPublishedPost" className="text-xs text-gray-300 font-light cursor-pointer select-none">
                    Publish immediately (Publishing syncs this to public blog catalog)
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
                {editingBlog ? "Save Changes" : "Create Publication"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
