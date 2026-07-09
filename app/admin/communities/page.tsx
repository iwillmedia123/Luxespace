"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Upload } from "lucide-react";
import { db, isSupabaseConfigured } from "@/lib/db";
import { Community } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";

function extractCoordinatesFromGoogleMapsLink(link: string): { lat: number; lng: number } | null {
  try {
    const decoded = decodeURIComponent(link);
    
    // 1. Check for @lat,lng pattern (e.g. /@25.1124,55.1390)
    const atMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }
    
    // 2. Check for q=lat,lng pattern (e.g. ?q=25.1124,55.1390 or &q=25.1124,55.1390)
    const qMatch = decoded.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // 3. Check for general lat/lng numbers separated by comma
    const llMatch = decoded.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (llMatch) {
      const lat = parseFloat(llMatch[1]);
      const lng = parseFloat(llMatch[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return { lat, lng };
      }
    }
  } catch (e) {
    console.error("Error parsing maps link:", e);
  }
  return null;
}

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
  const [bannerUrl, setBannerUrl] = useState("");
  const [mapInput, setMapInput] = useState("");
  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");
  const [isDragging, setIsDragging] = useState(false);

  // New location/distance/amenities states
  const [locationText, setLocationText] = useState("");
  const [concentricDistances, setConcentricDistances] = useState<Array<{ name: string; distance: string }>>([]);
  const [newDistanceName, setNewDistanceName] = useState("");
  const [newDistanceValue, setNewDistanceValue] = useState("");

  const [neighborhoodAmenities, setNeighborhoodAmenities] = useState<Array<{ name: string; value: string }>>([]);
  const [newAmenityName, setNewAmenityName] = useState("");
  const [newAmenityValue, setNewAmenityValue] = useState("");

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

  const handleMapInputChange = (value: string) => {
    setMapInput(value);
    
    // Parse coordinates
    const coords = extractCoordinatesFromGoogleMapsLink(value);
    if (coords) {
      setLat(coords.lat);
      setLng(coords.lng);
    } else {
      // Also check if they just pasted a plain "lat, lng" string
      const parts = value.split(",");
      if (parts.length === 2) {
        const l1 = parseFloat(parts[0].trim());
        const l2 = parseFloat(parts[1].trim());
        if (!isNaN(l1) && !isNaN(l2) && Math.abs(l1) <= 90 && Math.abs(l2) <= 180) {
          setLat(l1);
          setLng(l2);
          return;
        }
      }
      setLat("");
      setLng("");
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    const isDb = isSupabaseConfigured();
    if (isDb) {
      try {
        const supabase = createClient();
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `communities/${fileName}`;
        
        // Show a temporary indicator
        setBannerUrl("Uploading...");
        
        const { error } = await supabase.storage.from("luxespace").upload(filePath, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from("luxespace").getPublicUrl(filePath);
        setBannerUrl(publicUrl);
      } catch (err: any) {
        console.error("Storage upload error:", err.message);
        alert("Failed to upload image to storage: " + err.message);
        setBannerUrl("");
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setBannerUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const addDistance = () => {
    if (!newDistanceName || !newDistanceValue) return;
    setConcentricDistances([...concentricDistances, { name: newDistanceName, distance: newDistanceValue }]);
    setNewDistanceName("");
    setNewDistanceValue("");
  };

  const removeDistance = (index: number) => {
    setConcentricDistances(concentricDistances.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (!newAmenityName || !newAmenityValue) return;
    setNeighborhoodAmenities([...neighborhoodAmenities, { name: newAmenityName, value: newAmenityValue }]);
    setNewAmenityName("");
    setNewAmenityValue("");
  };

  const removeAmenity = (index: number) => {
    setNeighborhoodAmenities(neighborhoodAmenities.filter((_, i) => i !== index));
  };

  const handleOpenAdd = () => {
    setEditingCommunity(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsFeatured(false);
    setBannerUrl("");
    setMapInput("");
    setLat("");
    setLng("");
    setLocationText("");
    setConcentricDistances([]);
    setNewDistanceName("");
    setNewDistanceValue("");
    setNeighborhoodAmenities([]);
    setNewAmenityName("");
    setNewAmenityValue("");
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (comm: Community) => {
    setEditingCommunity(comm);
    setName(comm.name);
    setSlug(comm.slug);
    setDescription(comm.description || "");
    setIsFeatured(comm.isFeatured);
    setBannerUrl(comm.bannerUrl || "");
    
    // Parse coordinates and load location fields
    const coordsObj: any = comm.coordinates || {};
    setLocationText(coordsObj.locationText || "");
    setConcentricDistances(coordsObj.concentricDistances || []);
    setNeighborhoodAmenities(coordsObj.neighborhoodAmenities || []);

    if (coordsObj.lat !== undefined && coordsObj.lng !== undefined) {
      setLat(coordsObj.lat);
      setLng(coordsObj.lng);
      setMapInput(`https://www.google.com/maps?q=${coordsObj.lat},${coordsObj.lng}`);
    } else {
      setLat("");
      setLng("");
      setMapInput("");
    }
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
      bannerUrl: bannerUrl || "/assets/palm_jumeirah_render.png",
      coordinates: {
        lat: lat !== "" ? Number(lat) : 25.1124,
        lng: lng !== "" ? Number(lng) : 55.1390,
        locationText: locationText || undefined,
        concentricDistances: concentricDistances.length > 0 ? concentricDistances : undefined,
        neighborhoodAmenities: neighborhoodAmenities.length > 0 ? neighborhoodAmenities : undefined,
      } as any,
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

            <form onSubmit={handleSave} className="h-[calc(100vh-9rem)] overflow-y-auto p-8 space-y-6" data-lenis-prevent>
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

                {/* Banner Upload Drag & Drop */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Community Banner Image
                  </label>
                  
                  {bannerUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-luxury-border/30 aspect-[2/1] bg-luxury-charcoal flex items-center justify-center group">
                      <img src={bannerUrl} alt="Preview" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <label className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors">
                          Change
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFile(file);
                            }}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setBannerUrl("")}
                          className="bg-red-500/80 hover:bg-red-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative cursor-pointer ${
                        isDragging
                          ? "border-luxury-gold bg-luxury-gold/5"
                          : "border-luxury-border/40 hover:border-luxury-gold/30 bg-[#1f232c]"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFile(file);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className={`w-8 h-8 mb-3 transition-colors duration-300 ${isDragging ? "text-luxury-gold" : "text-gray-500"}`} />
                      <span className="text-xs text-gray-300 font-semibold mb-1">
                        Drag and drop community banner
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Supports PNG, JPG, WEBP (Max 5MB)
                      </span>
                    </div>
                  )}
                </div>

                {/* Google Maps Location Link / Coordinates */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Google Maps Link or Coordinates
                  </label>
                  <input
                    type="text"
                    value={mapInput}
                    onChange={(e) => handleMapInputChange(e.target.value)}
                    placeholder="Paste Google Maps URL or coordinates (e.g. 25.1124, 55.1390)"
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder-gray-600 transition-colors"
                  />
                  
                  {lat !== "" && lng !== "" ? (
                    <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <span>✓ Detected Coordinates:</span>
                      <span className="font-sans font-semibold">{Number(lat).toFixed(4)}° N, {Number(lng).toFixed(4)}° E</span>
                    </p>
                  ) : mapInput !== "" ? (
                    <p className="text-[10px] text-orange-400 font-medium leading-relaxed">
                      {mapInput.includes("maps.app.goo.gl") ? (
                        <span>ℹ Short links (maps.app.goo.gl) require loading. Please use a full maps.google.com URL, or enter latitude and longitude directly.</span>
                      ) : (
                        <span>Coordinates not detected. Please verify the URL or type coordinates directly.</span>
                      )}
                    </p>
                  ) : null}
                </div>

                {/* Location Address Text */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Location Address
                  </label>
                  <input
                    type="text"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="e.g. Freehold Zone, Dubai, UAE"
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none placeholder-gray-600 transition-colors"
                  />
                </div>

                {/* Concentric Distances Section */}
                <div className="space-y-3 pt-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Concentric Distances
                  </label>
                  
                  {concentricDistances.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {concentricDistances.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-luxury-charcoal/50 border border-luxury-border/20 rounded-xl px-3 py-2 text-xs">
                          <div className="min-w-0">
                            <span className="text-white block font-medium truncate text-xs">{item.name}</span>
                            <span className="text-[9px] text-gray-400 block">{item.distance}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDistance(idx)}
                            className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Nearest Metro"
                      value={newDistanceName}
                      onChange={(e) => setNewDistanceName(e.target.value)}
                      className="bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 5 mins drive"
                      value={newDistanceValue}
                      onChange={(e) => setNewDistanceValue(e.target.value)}
                      className="bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDistance}
                    className="w-full text-[10px] py-2 border-luxury-border/30 hover:border-luxury-gold hover:text-luxury-gold"
                  >
                    + Add Distance Item
                  </Button>
                </div>

                {/* Neighborhood Amenities Section */}
                <div className="space-y-3 pt-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Neighborhood Amenities (Infrastructure)
                  </label>
                  
                  {neighborhoodAmenities.length > 0 && (
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {neighborhoodAmenities.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-luxury-charcoal/50 border border-luxury-border/20 rounded-xl px-3 py-2 text-xs">
                          <div className="min-w-0">
                            <span className="text-white block font-medium truncate text-xs">{item.name}</span>
                            <span className="text-[9px] text-gray-400 block">{item.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAmenity(idx)}
                            className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Premium Gym"
                      value={newAmenityName}
                      onChange={(e) => setNewAmenityName(e.target.value)}
                      className="bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="e.g. State of the art"
                      value={newAmenityValue}
                      onChange={(e) => setNewAmenityValue(e.target.value)}
                      className="bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none placeholder-gray-600"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAmenity}
                    className="w-full text-[10px] py-2 border-luxury-border/30 hover:border-luxury-gold hover:text-luxury-gold"
                  >
                    + Add Amenity Item
                  </Button>
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
