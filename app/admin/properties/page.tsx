"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Trash2,
  Copy,
  Edit,
  Download,
  Star,
  X,
  Upload,
  CheckCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { Property, Community, Developer, Agent, PropertyType } from "@/types";
import Button from "@/components/ui/Button";
import MediaUploadGrid from "@/components/admin/MediaUploadGrid";

export default function PropertiesManagerPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  
  // Selected items for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal Drawer form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState<PropertyType>("apartment");
  const [status, setStatus] = useState<"buy" | "rent" | "off-plan" | "sold" | "rented">("buy");
  const [completionStatus, setCompletionStatus] = useState<"ready" | "off-plan" | "under-construction">("ready");
  const [handoverDate, setHandoverDate] = useState("");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqft, setAreaSqft] = useState(1500);
  const [location, setLocation] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [developerId, setDeveloperId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [amenitiesText, setAmenitiesText] = useState("");
  const [latitude, setLatitude] = useState(25.2048);
  const [longitude, setLongitude] = useState(55.2708);
  
  // Media Uploads
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [propertyPlanUrl, setPropertyPlanUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [props, comms, devs, ags] = await Promise.all([
          db.getProperties(),
          db.getCommunities(),
          db.getDevelopers(),
          db.getAgents(),
        ]);
        setProperties(props);
        setCommunities(comms);
        setDevelopers(devs);
        setAgents(ags);
        
        if (comms.length > 0) setCommunityId(comms[0].id);
        if (devs.length > 0) setDeveloperId(devs[0].id);
        if (ags.length > 0) setAgentId(ags[0].id);
      } catch (err) {
        console.error("Properties manager load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync slug auto-generation on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setPrice(1200000);
    setType("apartment");
    setStatus("buy");
    setCompletionStatus("ready");
    setHandoverDate("");
    setBedrooms(2);
    setBathrooms(2);
    setAreaSqft(1200);
    setIsFeatured(false);
    setAmenitiesText("Infinity Pool, Gym, Concierge, Security");
    
    if (communities.length > 0) {
      const defaultComm = communities[0];
      setCommunityId(defaultComm.id);
      const coordsObj = (defaultComm.coordinates as any) || {};
      if (coordsObj.lat && coordsObj.lng) {
        setLatitude(coordsObj.lat);
        setLongitude(coordsObj.lng);
      } else {
        setLatitude(25.2048);
        setLongitude(55.2708);
      }
      setLocation(coordsObj.locationText || `${defaultComm.name}, Dubai, UAE`);
    } else {
      setCommunityId("");
      setLatitude(25.2048);
      setLongitude(55.2708);
      setLocation("Dubai Marina, Dubai");
    }

    if (developers.length > 0) setDeveloperId(developers[0].id);
    if (agents.length > 0) setAgentId(agents[0].id);
    setImages(["/assets/apartment_render.webp"]);
    setPropertyPlanUrl("");
    setIsDrawerOpen(true);
  };

  const handleCommunityChange = (id: string) => {
    setCommunityId(id);
    const selectedComm = communities.find((c) => c.id === id);
    if (selectedComm) {
      const coordsObj = (selectedComm.coordinates as any) || {};
      if (coordsObj.lat && coordsObj.lng) {
        setLatitude(coordsObj.lat);
        setLongitude(coordsObj.lng);
      }
      setLocation(coordsObj.locationText || `${selectedComm.name}, Dubai, UAE`);
    }
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setTitle(prop.title);
    setSlug(prop.slug);
    setDescription(prop.description);
    setPrice(Number(prop.price));
    setType(prop.type);
    setStatus(prop.status);
    setCompletionStatus(prop.completionStatus);
    setHandoverDate(prop.handoverDate || "");
    setBedrooms(prop.bedrooms);
    setBathrooms(Number(prop.bathrooms));
    setAreaSqft(Number(prop.areaSqft));
    setLocation(prop.location);
    setCommunityId(prop.communityId);
    setDeveloperId(prop.developerId || "");
    setAgentId(prop.agentId);
    setIsFeatured(prop.isFeatured);
    setAmenitiesText(prop.amenities ? prop.amenities.join(", ") : "");
    setLatitude(prop.latitude || 25.2048);
    setLongitude(prop.longitude || 55.2708);
    setImages(prop.images || []);
    setVideos(prop.videos || []);
    setPropertyPlanUrl(prop.propertyPlanUrl || "");
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
      title,
      slug,
      description,
      price,
      type,
      status,
      completionStatus,
      handoverDate,
      bedrooms,
      bathrooms,
      areaSqft,
      location,
      communityId,
      developerId,
      agentId,
      isFeatured,
      latitude,
      longitude,
      images,
      videos,
      propertyPlanUrl,
      amenities: amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingProperty) {
        await db.updateProperty(editingProperty.id, payload);
      } else {
        await db.createProperty(payload);
      }
      
      // Refresh list
      const updated = await db.getProperties();
      setProperties(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      setLoading(true);
      await db.deleteProperty(id);
      const updated = await db.getProperties();
      setProperties(updated);
      setLoading(false);
    }
  };

  const handleDuplicate = async (prop: Property) => {
    setLoading(true);
    const clone: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
      ...prop,
      title: `${prop.title} (Copy)`,
      slug: `${prop.slug}-copy`,
      isFeatured: false,
    };
    await db.createProperty(clone);
    const updated = await db.getProperties();
    setProperties(updated);
    setLoading(false);
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete the ${selectedIds.length} selected properties?`)) {
      setLoading(true);
      await Promise.all(selectedIds.map((id) => db.deleteProperty(id)));
      const updated = await db.getProperties();
      setProperties(updated);
      setSelectedIds([]);
      setLoading(false);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    await Promise.all(
      selectedIds.map((id) => db.updateProperty(id, { isFeatured: true }))
    );
    const updated = await db.getProperties();
    setProperties(updated);
    setSelectedIds([]);
    setLoading(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Title", "Slug", "Price", "Type", "Status", "Beds", "Baths", "Area", "Location"];
    const rows = properties.map((p) => [
      p.title,
      p.slug,
      p.price,
      p.type,
      p.status,
      p.bedrooms,
      p.bathrooms,
      p.areaSqft,
      p.location,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `luxespace_properties_catalog.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Select list checker
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProperties.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Filters application
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "" || p.type === typeFilter;
    const matchesPurpose = purposeFilter === "" || p.status === purposeFilter;
    return matchesSearch && matchesType && matchesPurpose;
  });

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Catalog Management
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Properties</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Create, duplicate, update, and manage your luxury real estate listings.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="flex items-center gap-2 border-white/20 hover:border-luxury-gold hover:text-luxury-gold text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 text-xs hover:shadow-[0_0_20px_rgba(241,217,155,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </Button>
        </div>
      </div>

      {/* Filter and search panel controls */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Type filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-40 bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="townhouse">Townhouse</option>
              <option value="mansion">Mansion</option>
            </select>
          </div>

          {/* Purpose filter */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="w-full md:w-40 bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">All Purposes</option>
              <option value="buy">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="off-plan">Off Plan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk actions deck */}
      {selectedIds.length > 0 && (
        <div className="bg-luxury-gold/5 border border-luxury-gold/30 rounded-xl px-6 py-3 flex items-center justify-between animate-fade-in">
          <span className="text-[10px] uppercase tracking-wider text-luxury-gold font-bold">
            {selectedIds.length} listings selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={handleBulkPublish}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Feature Selected</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 font-bold cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid List Table */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-luxury-border/20 text-gray-500 text-[9px] uppercase tracking-wider font-semibold bg-luxury-charcoal/20">
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredProperties.length && filteredProperties.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-6">Property Details</th>
                <th className="py-4 px-6">Price (AED)</th>
                <th className="py-4 px-6">Specs</th>
                <th className="py-4 px-6">Type / Purpose</th>
                <th className="py-4 px-6">Feature status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 text-xs">
                    No luxury properties matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-luxury-charcoal/10 transition-colors text-xs">
                    <td className="py-4.5 px-6">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(prop.id)}
                        onChange={(e) => handleSelectOne(prop.id, e.target.checked)}
                        className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-4.5 px-6">
                      <div className="space-y-1">
                        <span className="font-serif text-sm text-white block hover:text-luxury-gold transition-colors font-medium">
                          {prop.title}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-light">
                          {prop.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-luxury-gold font-bold">
                      AED {Number(prop.price).toLocaleString()}
                    </td>
                    <td className="py-4.5 px-6 text-gray-300 font-light">
                      {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.areaSqft} sqft
                    </td>
                    <td className="py-4.5 px-6 capitalize text-gray-400 font-light">
                      <span className="text-white font-semibold">{prop.type}</span> • {prop.status}
                    </td>
                    <td className="py-4.5 px-6">
                      {prop.isFeatured ? (
                        <span className="flex items-center gap-1.5 text-luxury-gold text-[9px] uppercase tracking-wider font-bold">
                          <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-gray-600 text-[9px] uppercase tracking-wider font-bold">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-3.5">
                        <button
                          onClick={() => handleDuplicate(prop)}
                          className="text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="Duplicate Listing"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(prop)}
                          className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Property"
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

      {/* Slide-out Drawer Modal Backdrop */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end">
          {/* Modal Panel drawer */}
          <div className="w-full max-w-2xl bg-luxury-dark border-l border-luxury-border/30 h-full flex flex-col justify-between shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="h-16 px-8 border-b border-luxury-border/20 flex items-center justify-between shrink-0">
              <h2 className="font-serif text-lg text-white">
                {editingProperty ? "Modify Luxury Listing" : "Log New Luxury Residence"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form fields */}
            <form onSubmit={handleSave} className="h-[calc(100vh-9rem)] overflow-y-auto p-8 space-y-6" data-lenis-prevent>
              <div className="grid grid-cols-2 gap-6">
                {/* Title */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Property Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Price (AED)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Property Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="mansion">Mansion</option>
                    <option value="duplex">Duplex</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                  </select>
                </div>

                {/* Purpose status */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Purpose / Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "buy" | "rent" | "off-plan" | "sold" | "rented")}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="buy">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="off-plan">Off Plan</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>

                {/* Beds */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Baths */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Area (SqFt)
                  </label>
                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(Number(e.target.value))}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Location text */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Location Address
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Community */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Community Node
                  </label>
                  <select
                    value={communityId}
                    onChange={(e) => handleCommunityChange(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Developer */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Developer Partner
                  </label>
                  <select
                    value={developerId}
                    onChange={(e) => setDeveloperId(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {developers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agent */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Assigned Advisory Agent
                  </label>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.title})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Completion Status */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Completion status
                  </label>
                  <select
                    value={completionStatus}
                    onChange={(e) => setCompletionStatus(e.target.value as "ready" | "off-plan" | "under-construction")}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="ready">Ready</option>
                    <option value="off-plan">Off-Plan</option>
                    <option value="under-construction">Under Construction</option>
                  </select>
                </div>

                {/* Handover Date */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Handover / Completion Date
                  </label>
                  <input
                    type="text"
                    value={handoverDate}
                    placeholder="e.g. Q4 2027"
                    onChange={(e) => setHandoverDate(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Feature Status */}
                <div className="flex items-center gap-2.5 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-luxury-border/40 text-luxury-gold focus:ring-0 bg-[#1f232c] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-gray-300 font-light cursor-pointer select-none">
                    Feature on Homepage slider
                  </label>
                </div>

                {/* Description */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Property Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-y"
                    required
                  />
                </div>

                {/* Amenities */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Amenities (comma separated)
                  </label>
                  <input
                    type="text"
                    value={amenitiesText}
                    onChange={(e) => setAmenitiesText(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    placeholder="Sky Pool, Chef Kitchen, Gym, Valet"
                  />
                </div>

                {/* Property Plan URL */}
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Property Plan File (PDF or Image)
                  </label>
                  <div className="flex gap-3">
                    {propertyPlanUrl && propertyPlanUrl.startsWith("data:") ? (
                      <div className="flex-grow bg-[#1f232c] border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-medium">✓ Property plan uploaded successfully</span>
                        <button
                          type="button"
                          onClick={() => setPropertyPlanUrl("")}
                          className="text-gray-400 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={propertyPlanUrl}
                        onChange={(e) => setPropertyPlanUrl(e.target.value)}
                        placeholder="e.g. /assets/downloads/sample_floorplan.pdf or paste a URL"
                        className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                      />
                    )}
                    <label className="bg-luxury-gold/10 hover:bg-luxury-gold/25 border border-luxury-gold/30 hover:border-luxury-gold/50 text-luxury-gold rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer shrink-0 transition-colors flex items-center gap-1.5 relative overflow-hidden">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Plan</span>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setPropertyPlanUrl(result);
                                alert(`File "${file.name}" uploaded successfully!`);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-500 font-light">
                    Upload a property plan or floorplan document (PDF or image). This field is optional.
                  </p>
                </div>

                {/* Media Upload — Images & Videos */}
                <MediaUploadGrid
                  images={images}
                  onChange={setImages}
                  videos={videos}
                  onVideosChange={setVideos}
                  maxImages={20}
                  maxVideos={5}
                />
              </div>
            </form>

            {/* Form Actions Footer */}
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
                {editingProperty ? "Save Changes" : "Create Listing"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
