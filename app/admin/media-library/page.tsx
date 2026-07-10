"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Search, ImageIcon, Video, FolderOpen, Eye, X } from "lucide-react";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  size: string;
  type: "image" | "video";
  mime: string;
  createdAt: string;
}

const DEFAULT_ASSETS: MediaAsset[] = [
  { id: "m1", filename: "villa_render.webp", url: "/assets/villa_render.webp", size: "4.2 MB", type: "image", mime: "image/png", createdAt: new Date().toISOString() },
  { id: "m2", filename: "penthouse_render.webp", url: "/assets/penthouse_render.webp", size: "6.8 MB", type: "image", mime: "image/png", createdAt: new Date().toISOString() },
  { id: "m3", filename: "apartment_render.webp", url: "/assets/apartment_render.webp", size: "3.1 MB", type: "image", mime: "image/png", createdAt: new Date().toISOString() },
  { id: "m4", filename: "palm_jumeirah_render.webp", url: "/assets/palm_jumeirah_render.webp", size: "5.5 MB", type: "image", mime: "image/png", createdAt: new Date().toISOString() },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("luxespace_media_assets");
      if (stored) {
        setAssets(JSON.parse(stored));
      } else {
        localStorage.setItem("luxespace_media_assets", JSON.stringify(DEFAULT_ASSETS));
        setAssets(DEFAULT_ASSETS);
      }
    }
  }, []);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const newAsset: MediaAsset = {
      id: crypto.randomUUID(),
      filename: file.name,
      url: "/assets/apartment_render.webp", // simulate upload URL
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type.startsWith("video") ? "video" : "image",
      mime: file.type || "image/png",
      createdAt: new Date().toISOString(),
    };

    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem("luxespace_media_assets", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this media asset?")) {
      const updated = assets.filter((a) => a.id !== id);
      setAssets(updated);
      localStorage.setItem("luxespace_media_assets", JSON.stringify(updated));
      if (previewAsset?.id === id) setPreviewAsset(null);
    }
  };

  const filtered = assets.filter((a) => {
    const matchesSearch = a.filename.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Asset Vault
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Media Library</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Upload, store, and manage images and cinematic video clips for property sliders.
          </p>
        </div>

        {/* Upload Trigger Input */}
        <label className="flex items-center gap-2 bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-charcoal text-xs font-semibold px-5 py-3 rounded-lg cursor-pointer transition-all duration-300 shadow-md shadow-luxury-gold/5 shrink-0 select-none">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleSimulatedUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filters */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {["all", "image", "video"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold border transition-all duration-300 cursor-pointer ${
                typeFilter === type
                  ? "bg-luxury-gold border-luxury-gold text-luxury-charcoal font-bold"
                  : "border-luxury-border/40 text-gray-400 hover:text-white hover:bg-luxury-charcoal"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="bg-luxury-dark border border-luxury-border/30 hover:border-luxury-gold/30 rounded-2xl p-3 flex flex-col justify-between h-48 group relative overflow-hidden transition-all duration-300"
          >
            {/* Background Thumbnail Image Preview */}
            <div className="relative h-28 rounded-lg overflow-hidden bg-luxury-charcoal flex items-center justify-center border border-luxury-border/10 shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${asset.url})` }}
              />
              
              {/* Media Type Icon Overlay */}
              <div className="absolute top-2 left-2 bg-black/60 rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-luxury-gold font-bold flex items-center gap-1">
                {asset.type === "video" ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                <span>{asset.type}</span>
              </div>
            </div>

            {/* Title Metadata Footer */}
            <div className="min-w-0 pt-2 space-y-0.5">
              <span className="text-[10px] text-white font-medium block truncate">
                {asset.filename}
              </span>
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-semibold block leading-none">
                {asset.size} • {asset.mime.split("/")[1]}
              </span>
            </div>

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button
                onClick={() => setPreviewAsset(asset)}
                className="w-9 h-9 rounded-full bg-luxury-charcoal border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(asset.id)}
                className="w-9 h-9 rounded-full bg-luxury-charcoal border border-luxury-border/40 hover:border-red-400 hover:text-red-400 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                title="Delete Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Preview Modal overlay */}
      {previewAsset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl overflow-hidden max-w-3xl w-full relative shadow-2xl animate-scale-in">
            <button
              onClick={() => setPreviewAsset(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-black">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${previewAsset.url})` }}
              />
            </div>
            
            <div className="p-6 border-t border-luxury-border/20 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base text-white">{previewAsset.filename}</h3>
                <p className="text-[10px] text-gray-400 font-light mt-1 uppercase tracking-wider">
                  MIME: {previewAsset.mime} • Size: {previewAsset.size} • Created: {new Date(previewAsset.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = previewAsset.url;
                  link.download = previewAsset.filename;
                  link.click();
                }}
                className="text-xs border-white/20 hover:border-luxury-gold"
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
