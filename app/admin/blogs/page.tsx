"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Copy, Eye, Globe, Calendar, FileText, Settings } from "lucide-react";
import { db } from "@/lib/db";
import { BlogPost, Agent, Property, Community, Developer, BlogCategory } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });
const MediaUploadGrid = dynamic(() => import("@/components/admin/MediaUploadGrid"), { ssr: false });
import { parseMarkdown } from "@/lib/markdown";

export default function BlogsManagerPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSavingDossier, setIsSavingDossier] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingAdvisor, setIsSavingAdvisor] = useState(false);
  const [search, setSearch] = useState("");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Preview overlay state
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  // Success / Error Alerts state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Editorial Category CRUD state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState<BlogCategory[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<BlogCategory | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  // Assigned Advisor CRUD state
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [newAdvName, setNewAdvName] = useState("");
  const [newAdvTitle, setNewAdvTitle] = useState("Senior Property Advisor");
  const [newAdvEmail, setNewAdvEmail] = useState("");
  const [newAdvPhone, setNewAdvPhone] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Dubai Real Estate News");
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>("draft");
  const [readingTime, setReadingTime] = useState(5);
  const [isFeaturedArticle, setIsFeaturedArticle] = useState(false);
  const [tagsText, setTagsText] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  
  const [coverImage, setCoverImage] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  
  const [relatedProperties, setRelatedProperties] = useState<string[]>([]);
  const [relatedCommunities, setRelatedCommunities] = useState<string[]>([]);
  const [relatedDevelopers, setRelatedDevelopers] = useState<string[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<string[]>([]);

  // SEO Form Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const categories = [
    "Dubai Real Estate News",
    "Investment Guides",
    "Market Insights",
    "Luxury Lifestyle",
    "Buying Guide",
    "Selling Guide",
    "Renting Guide",
    "Community Guides",
    "Developer News",
    "Interior Design",
    "Property Tips",
    "Visa & Residency"
  ];

  const triggerAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [bls, ags, prps, comms, devs, cats] = await Promise.all([
          db.getBlogs(),
          db.getAgents(),
          db.getProperties(),
          db.getCommunities(),
          db.getDevelopers(),
          db.getBlogCategories(),
        ]);
        setBlogs(bls);
        setAgents(ags);
        setProperties(prps);
        setCommunities(comms);
        setDevelopers(devs);
        setDbCategories(cats);
        if (ags.length > 0) setAuthorId(ags[0].id);
      } catch (err) {
        console.error("Blogs manager load error:", err);
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

  const handleSuggestSeo = () => {
    setMetaTitle(`${title} | Luxespace Insights`);
    setMetaDescription(summary || `Read our latest editorial bulletin regarding ${title} in the Dubai luxury real estate market.`);
    setSeoKeywords(tagsText);
    setCanonicalUrl(`https://luxespace.ae/blog/${slug}`);
  };

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setCategory("Dubai Real Estate News");
    setStatus("draft");
    setReadingTime(5);
    setIsFeaturedArticle(false);
    setTagsText("Market Report, Luxury Living");
    if (agents.length > 0) setAuthorId(agents[0].id);
    setPublishedAt("");
    setCoverImage("/assets/apartment_render.png");
    setGallery([]);
    setRelatedProperties([]);
    setRelatedCommunities([]);
    setRelatedDevelopers([]);
    setRelatedBlogs([]);
    setMetaTitle("");
    setMetaDescription("");
    setSeoKeywords("");
    setCanonicalUrl("");
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingBlog(post);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category || "Dubai Real Estate News");
    setStatus(post.status || (post.isPublished ? "published" : "draft"));
    setReadingTime(post.readingTime || 5);
    setIsFeaturedArticle(post.isFeaturedArticle || false);
    setTagsText(post.tags ? post.tags.join(", ") : "");
    setAuthorId(post.authorId);
    setPublishedAt(post.publishedAt ? post.publishedAt.split("T")[0] : "");
    setCoverImage(post.coverImage || "/assets/apartment_render.png");
    setGallery(post.gallery || []);
    setRelatedProperties(post.relatedProperties || []);
    setRelatedCommunities(post.relatedCommunities || []);
    setRelatedDevelopers(post.relatedDevelopers || []);
    setRelatedBlogs(post.relatedBlogs || []);
    
    // SEO
    setMetaTitle(post.seo?.metaTitle || "");
    setMetaDescription(post.seo?.metaDescription || "");
    setSeoKeywords(post.seo?.keywords ? post.seo.keywords.join(", ") : "");
    setCanonicalUrl(post.seo?.canonicalUrl || "");
    
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSavingDossier) return;
    if (!authorId) {
      triggerAlert("error", "Dossier validation failed: Assigned Advisor (Author) is required.");
      return;
    }

    setIsSavingDossier(true);

    const isPub = status === "published";
    const pubDate = status === "scheduled" && publishedAt
      ? new Date(publishedAt).toISOString()
      : (isPub ? new Date().toISOString() : undefined);

    const payload: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> = {
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      content: content.trim(),
      coverImage: coverImage || "/assets/apartment_render.png",
      gallery,
      category,
      status,
      readingTime: readingTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      isFeaturedArticle,
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      authorId,
      publishedAt: pubDate,
      isPublished: isPub,
      relatedProperties,
      relatedCommunities,
      relatedDevelopers,
      relatedBlogs,
      seo: {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        keywords: seoKeywords.split(",").map((s) => s.trim()).filter(Boolean),
        canonicalUrl: canonicalUrl.trim(),
        ogImage: coverImage,
        ogTitle: metaTitle.trim(),
        ogDescription: metaDescription.trim()
      }
    };

    try {
      if (editingBlog) {
        await db.updateBlog(editingBlog.id, payload);
        triggerAlert("success", `Dossier "${title}" updated successfully!`);
      } else {
        await db.createBlog(payload);
        triggerAlert("success", `Dossier "${title}" published as a draft!`);
      }

      const updated = await db.getBlogs();
      setBlogs(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      triggerAlert("error", `Failed to save dossier: ${msg}`);
    } finally {
      setIsSavingDossier(false);
    }
  };

  const handleDuplicate = async (post: BlogPost) => {
    if (confirm(`Duplicate article "${post.title}"?`)) {
      setLoading(true);
      try {
        const payload: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> = {
          ...post,
          title: `${post.title} (Copy)`,
          slug: `${post.slug}-copy-${Math.floor(Math.random() * 1000)}`,
          status: "draft",
          isPublished: false,
          publishedAt: undefined
        };
        await db.createBlog(payload);
        const updated = await db.getBlogs();
        setBlogs(updated);
        triggerAlert("success", `Dossier "${post.title}" duplicated successfully.`);
      } catch (err) {
        console.error("Duplicate error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        triggerAlert("error", `Failed to duplicate: ${msg}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setLoading(true);
      try {
        await db.deleteBlog(id);
        const updated = await db.getBlogs();
        setBlogs(updated);
        triggerAlert("success", "Dossier deleted successfully.");
      } catch (err) {
        console.error("Delete error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        triggerAlert("error", `Failed to delete dossier: ${msg}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleRelation = (id: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(id)) {
      setter(list.filter(x => x !== id));
    } else {
      setter([...list, id]);
    }
  };

  // Category CRUD Handlers
  const handleCreateCategory = async () => {
    if (!newCatName.trim() || isSavingCategory) return;
    setIsSavingCategory(true);
    try {
      const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const newCat = await db.createBlogCategory(newCatName.trim(), slug);
      setDbCategories([...dbCategories, newCat]);
      setNewCatName("");
      triggerAlert("success", `Category "${newCat.name}" added successfully.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      triggerAlert("error", `Failed to create category: ${msg}`);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCat || !editingCatName.trim() || isSavingCategory) return;
    setIsSavingCategory(true);
    try {
      const slug = editingCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const updated = await db.updateBlogCategory(editingCat.id, editingCatName.trim(), slug);
      setDbCategories(dbCategories.map(c => c.id === editingCat.id ? updated : c));
      setEditingCat(null);
      setEditingCatName("");
      triggerAlert("success", "Category updated successfully.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      triggerAlert("error", `Failed to update category: ${msg}`);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Delete this category? Blog posts using this category will remain, but the category selector will no longer show it.")) {
      try {
        await db.deleteBlogCategory(id);
        setDbCategories(dbCategories.filter(c => c.id !== id));
        triggerAlert("success", "Category deleted successfully.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        triggerAlert("error", `Failed to delete category: ${msg}`);
      }
    }
  };

  // Advisor CRUD Handlers
  const handleCreateAdvisor = async () => {
    if (!newAdvName.trim() || !newAdvEmail.trim() || isSavingAdvisor) {
      if (!isSavingAdvisor) triggerAlert("error", "Name and Email are required for advisors");
      return;
    }
    setIsSavingAdvisor(true);
    try {
      const slug = newAdvName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload: Omit<Agent, "id" | "createdAt" | "updatedAt"> = {
        name: newAdvName.trim(),
        slug,
        title: newAdvTitle.trim(),
        email: newAdvEmail.trim(),
        phone: newAdvPhone.trim(),
        whatsapp: newAdvPhone.trim(),
        languages: ["English"],
        specialization: ["Dubai Luxury"],
        experienceYears: 5,
        bio: `${newAdvName} is a luxury advisory consultant at Luxespace Properties.`,
        isFeatured: false,
        avatarUrl: "/assets/logo.png"
      };
      const newAgent = await db.createAgent(payload);
      setAgents([...agents, newAgent]);
      setAuthorId(newAgent.id);
      setIsAdvisorModalOpen(false);
      setNewAdvName("");
      setNewAdvEmail("");
      setNewAdvPhone("");
      triggerAlert("success", `Advisor "${newAgent.name}" added successfully and selected.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      triggerAlert("error", `Failed to add advisor: ${msg}`);
    } finally {
      setIsSavingAdvisor(false);
    }
  };

  const handleDeleteAdvisor = async (id: string) => {
    if (confirm("Delete this advisor? Properties or articles assigned to this advisor will retain their references, but they will not show up in the consult dropdown.")) {
      try {
        await db.deleteAgent(id);
        setAgents(agents.filter(a => a.id !== id));
        if (authorId === id && agents.length > 0) {
          setAuthorId(agents.filter(a => a.id !== id)[0]?.id || "");
        }
        triggerAlert("success", "Advisor deleted successfully.");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        triggerAlert("error", `Failed to delete advisor: ${msg}`);
      }
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    (b.summary && b.summary.toLowerCase().includes(search.toLowerCase())) ||
    (b.category && b.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center space-y-4 select-none">
        <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-luxury-gold font-light tracking-wider uppercase">Loading Publications...</span>
      </div>
    );
  }

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
          className="flex items-center gap-2 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Publication</span>
        </Button>
      </div>

      {/* Forms Alert Banner */}
      {alert && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border select-none transition-all duration-300 animate-fade-in ${
          alert.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider">{alert.type === "success" ? "Success:" : "Error:"}</span>
            <span>{alert.message}</span>
          </div>
          <button type="button" onClick={() => setAlert(null)} className="hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles by title, category..."
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
              <tr className="border-b border-luxury-border/20 text-gray-500 text-[9px] uppercase tracking-wider font-semibold bg-luxury-charcoal/20 select-none">
                <th className="py-4 px-6">Article Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Reading Time</th>
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
                        <span className="text-[10px] text-gray-400 block truncate max-w-xs font-light">
                          {post.summary}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-gray-300">
                      {post.category || "Dubai Real Estate News"}
                    </td>
                    <td className="py-4.5 px-6 text-gray-400 font-light">
                      {post.readingTime || 5} Min
                    </td>
                    <td className="py-4.5 px-6">
                      {post.status === "published" ? (
                        <span className="text-emerald-400 text-[9px] uppercase tracking-wider font-bold">
                          Published
                        </span>
                      ) : post.status === "scheduled" ? (
                        <span className="text-amber-400 text-[9px] uppercase tracking-wider font-bold">
                          Scheduled
                        </span>
                      ) : post.status === "archived" ? (
                        <span className="text-red-400 text-[9px] uppercase tracking-wider font-bold">
                          Archived
                        </span>
                      ) : (
                        <span className="text-gray-500 text-[9px] uppercase tracking-wider font-bold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-3.5">
                        <button
                          onClick={() => setPreviewPost(post)}
                          title="Preview Layout"
                          className="text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(post)}
                          title="Duplicate/Clone"
                          className="text-gray-500 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          title="Modify"
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          title="Delete"
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
          <div className="w-full max-w-2xl bg-luxury-dark border-l border-luxury-border/30 h-full flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="h-16 px-8 border-b border-luxury-border/20 flex items-center justify-between shrink-0">
              <h2 className="font-serif text-lg text-white">
                {editingBlog ? "Modify Article Dossier" : "Log New Article Dossier"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="h-[calc(100vh-9rem)] overflow-y-auto p-8 space-y-8" data-lenis-prevent>
              {/* Basic Fields */}
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-bold border-b border-luxury-border/20 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      Slug URL Link
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between select-none">
                      <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                        Editorial Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="text-[9px] uppercase tracking-wider text-luxury-gold hover:text-white transition-colors font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Manage Categories</span>
                      </button>
                    </div>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {(dbCategories.length > 0 ? dbCategories.map(c => c.name) : categories).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between select-none">
                      <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                        Assigned Advisor (Author)
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAdvisorModalOpen(true)}
                        className="text-[9px] uppercase tracking-wider text-luxury-gold hover:text-white transition-colors font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Manage Advisors</span>
                      </button>
                    </div>
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
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Short Summary / Subtitle
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Drag and Drop Media Uploaders */}
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-bold border-b border-luxury-border/20 pb-2">
                  Media Uploader (Drag & Drop)
                </h3>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Featured Cover Image
                  </label>
                  <MediaUploadGrid
                    images={coverImage ? [coverImage] : []}
                    onChange={(imgs) => setCoverImage(imgs[0] || "")}
                    maxImages={1}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Article Gallery Images
                  </label>
                  <MediaUploadGrid
                    images={gallery}
                    onChange={setGallery}
                    maxImages={12}
                  />
                </div>
              </div>

              {/* Rich text editor content */}
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Article Body (HTML/Markdown)
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                />
              </div>

              {/* Status and Scheduling */}
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-bold border-b border-luxury-border/20 pb-2">
                  Status & Schedule Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled' | 'archived')}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      Reading Time Estimation (Min)
                    </label>
                    <input
                      type="number"
                      value={readingTime}
                      onChange={(e) => setReadingTime(Number(e.target.value))}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {status === "scheduled" && (
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Scheduling Publication Date</span>
                    </label>
                    <input
                      type="date"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="isFeaturedToggle"
                      checked={isFeaturedArticle}
                      onChange={(e) => setIsFeaturedArticle(e.target.checked)}
                      className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="isFeaturedToggle" className="text-xs text-gray-300 font-light cursor-pointer select-none">
                      Mark as Featured Article
                    </label>
                  </div>
                  
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
                </div>
              </div>

              {/* SEO management */}
              <div className="space-y-5 bg-luxury-charcoal/10 border border-luxury-border/20 rounded-2xl p-5">
                <div className="flex items-center justify-between border-b border-luxury-border/20 pb-2">
                  <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>SEO Management</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleSuggestSeo}
                    className="text-[9px] uppercase tracking-wider text-luxury-gold hover:underline cursor-pointer font-bold"
                  >
                    Auto-Suggest Meta
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    SEO Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Relations Pickers */}
              <div className="space-y-5">
                <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-bold border-b border-luxury-border/20 pb-2 flex items-center justify-between select-none">
                  <span>Related Dossier References</span>
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-normal">Optional</span>
                </h3>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Link Related Properties
                  </label>
                  <div className="bg-[#1f232c] border border-luxury-border/30 rounded-xl p-3 h-36 overflow-y-auto space-y-1.5" data-lenis-prevent>
                    {properties.map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`rel-prop-${p.id}`}
                          checked={relatedProperties.includes(p.id)}
                          onChange={() => toggleRelation(p.id, relatedProperties, setRelatedProperties)}
                          className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-luxury-dark w-3.5 h-3.5 cursor-pointer"
                        />
                        <label htmlFor={`rel-prop-${p.id}`} className="text-[10px] text-gray-300 cursor-pointer font-light select-none">
                          {p.title} ({p.location})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Link Communities
                    </label>
                    <div className="bg-[#1f232c] border border-luxury-border/30 rounded-xl p-3 h-28 overflow-y-auto space-y-1.5" data-lenis-prevent>
                      {communities.map((c) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`rel-comm-${c.id}`}
                            checked={relatedCommunities.includes(c.id)}
                            onChange={() => toggleRelation(c.id, relatedCommunities, setRelatedCommunities)}
                            className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-luxury-dark w-3.5 h-3.5 cursor-pointer"
                          />
                          <label htmlFor={`rel-comm-${c.id}`} className="text-[10px] text-gray-300 cursor-pointer font-light select-none">
                            {c.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                      Link Developers
                    </label>
                    <div className="bg-[#1f232c] border border-luxury-border/30 rounded-xl p-3 h-28 overflow-y-auto space-y-1.5" data-lenis-prevent>
                      {developers.map((d) => (
                        <div key={d.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`rel-dev-${d.id}`}
                            checked={relatedDevelopers.includes(d.id)}
                            onChange={() => toggleRelation(d.id, relatedDevelopers, setRelatedDevelopers)}
                            className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-luxury-dark w-3.5 h-3.5 cursor-pointer"
                          />
                          <label htmlFor={`rel-dev-${d.id}`} className="text-[10px] text-gray-300 cursor-pointer font-light select-none">
                            {d.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Link Related Articles
                  </label>
                  <div className="bg-[#1f232c] border border-luxury-border/30 rounded-xl p-3 h-28 overflow-y-auto space-y-1.5" data-lenis-prevent>
                    {blogs.filter(b => b.id !== editingBlog?.id).map((b) => (
                      <div key={b.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`rel-blog-${b.id}`}
                          checked={relatedBlogs.includes(b.id)}
                          onChange={() => toggleRelation(b.id, relatedBlogs, setRelatedBlogs)}
                          className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-luxury-dark w-3.5 h-3.5 cursor-pointer"
                        />
                        <label htmlFor={`rel-blog-${b.id}`} className="text-[10px] text-gray-300 cursor-pointer font-light select-none">
                          {b.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            <div className="h-20 px-8 border-t border-luxury-border/20 flex items-center justify-end gap-4 shrink-0 bg-luxury-dark">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="text-xs text-gray-400 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSave}
                disabled={isSavingDossier}
                className="text-xs cursor-pointer"
              >
                {isSavingDossier ? "Saving..." : (editingBlog ? "Save Dossier" : "Publish Dossier")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal Overlay */}
      {previewPost && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-luxury-charcoal border border-luxury-border/30 rounded-3xl h-[85vh] flex flex-col justify-between shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="h-16 px-8 border-b border-luxury-border/20 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2 text-luxury-gold">
                <FileText className="w-5 h-5" />
                <span className="font-serif text-sm tracking-wide text-white">Live Publication Preview</span>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Render Body */}
            <div className="h-[calc(85vh-4rem)] overflow-y-auto p-8 sm:p-12 space-y-6" data-lenis-prevent>
              <div className="space-y-2 border-b border-luxury-border/10 pb-6">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
                  {previewPost.category || "Dubai Real Estate News"} &bull; {previewPost.readingTime || 5} min read
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif text-white font-medium">
                  {previewPost.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 italic leading-relaxed">
                  {previewPost.summary}
                </p>
              </div>

              {previewPost.coverImage && (
                <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-luxury-border/20 relative">
                  <img
                    src={previewPost.coverImage}
                    alt={previewPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Renders dynamic markdown content exactly as it will show up publicly */}
              <div className="prose prose-invert max-w-none pt-4 pb-12">
                {parseMarkdown(previewPost.content)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category CRUD Modal Overlay */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-luxury-charcoal border border-luxury-border/30 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="h-16 px-6 border-b border-luxury-border/20 flex items-center justify-between shrink-0 select-none">
              <span className="font-serif text-sm tracking-wide text-white">Manage Editorial Categories</span>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add category form */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block select-none">
                  Add New Category
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Waterfront Analytics"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-grow bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                  />
                  <Button
                    variant="primary"
                    onClick={handleCreateCategory}
                    className="text-xs cursor-pointer py-2 px-4"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Edit category block */}
              {editingCat && (
                <div className="space-y-2 bg-[#1f232c]/50 border border-luxury-gold/20 rounded-2xl p-4 animate-fade-in">
                  <label className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold block select-none">
                    Rename Category
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingCatName}
                      onChange={(e) => setEditingCatName(e.target.value)}
                      className="flex-grow bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    />
                    <Button
                      variant="primary"
                      onClick={handleUpdateCategory}
                      className="text-xs cursor-pointer py-2 px-4"
                    >
                      Save
                    </Button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="text-gray-400 hover:text-white transition-colors text-xs font-semibold px-2 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Categories list */}
              <div className="space-y-2 select-none">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Current Editorial Categories
                </label>
                <div className="bg-[#1f232c] border border-luxury-border/30 rounded-xl max-h-48 overflow-y-auto divide-y divide-luxury-border/20" data-lenis-prevent>
                  {(dbCategories.length > 0 ? dbCategories : categories.map((name, i) => ({ id: `s-${i}`, name, slug: name, createdAt: "" }))).map((cat) => (
                    <div key={cat.id} className="p-3 flex items-center justify-between text-xs text-gray-300">
                      <span>{cat.name}</span>
                      {/* Disable delete/edit for mock static templates to retain core schema fallback */}
                      {!cat.id.startsWith("s-") && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCat(cat);
                              setEditingCatName(cat.name);
                            }}
                            className="text-gray-400 hover:text-luxury-gold transition-colors font-semibold text-[10px] cursor-pointer"
                          >
                            Rename
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors font-semibold text-[10px] cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisor CRUD Modal Overlay */}
      {isAdvisorModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-luxury-charcoal border border-luxury-border/30 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="h-16 px-6 border-b border-luxury-border/20 flex items-center justify-between shrink-0 select-none">
              <span className="font-serif text-sm tracking-wide text-white">Manage Assigned Advisors</span>
              <button
                onClick={() => setIsAdvisorModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add advisor Form */}
              <div className="bg-[#1f232c]/30 border border-luxury-border/40 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold block select-none">
                  Register New Advisor (Author)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={newAdvName}
                      onChange={(e) => setNewAdvName(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold block">Advisor Title</label>
                    <input
                      type="text"
                      value={newAdvTitle}
                      onChange={(e) => setNewAdvTitle(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold block">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@luxespace.ae"
                      value={newAdvEmail}
                      onChange={(e) => setNewAdvEmail(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold block">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+971 50 123 4567"
                      value={newAdvPhone}
                      onChange={(e) => setNewAdvPhone(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleCreateAdvisor}
                    className="text-[10px] uppercase tracking-wider py-1.5 px-4 cursor-pointer"
                  >
                    Register Advisor
                  </Button>
                </div>
              </div>

              {/* Advisors List */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Registered Advisors
                </label>
                <div className="bg-[#1f232c] border border-luxury-border/30 rounded-xl max-h-48 overflow-y-auto divide-y divide-luxury-border/20 select-none" data-lenis-prevent>
                  {agents.map((ag) => (
                    <div key={ag.id} className="p-3 flex items-center justify-between text-xs text-gray-300">
                      <div>
                        <span className="font-semibold text-white block">{ag.name}</span>
                        <span className="text-[10px] text-gray-500 block">{ag.title} &bull; {ag.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAdvisor(ag.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors font-semibold text-[10px] cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
