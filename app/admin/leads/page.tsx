"use client";

import { useState, useEffect } from "react";
import { Search, Download, Trash2, Edit, X, MessageCircle, Phone, Mail } from "lucide-react";
import { db } from "@/lib/db";
import { Lead, Agent, Property } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Editing lead state drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"new" | "contacted" | "qualified" | "lost" | "won">("new");
  const [propertyInterestId, setPropertyInterestId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [data, ags, props] = await Promise.all([
          db.getLeads(),
          db.getAgents(),
          db.getProperties(),
        ]);
        setLeads(data);
        setAgents(ags);
        setProperties(props);
      } catch (err) {
        console.error("Leads load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFirstName(lead.firstName);
    setLastName(lead.lastName);
    setEmail(lead.email);
    setPhone(lead.phone);
    setStatus(lead.status);
    setPropertyInterestId(lead.propertyInterestId || "");
    setNotes(lead.notes || "");
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Partial<Lead> = {
      firstName,
      lastName,
      email,
      phone,
      status,
      propertyInterestId: propertyInterestId || undefined,
      notes,
    };

    try {
      if (editingLead) {
        await db.updateLead(editingLead.id, payload);
      }
      const updated = await db.getLeads();
      setLeads(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      setLoading(true);
      await db.deleteLead(id);
      const updated = await db.getLeads();
      setLeads(updated);
      setLoading(false);
    }
  };

  // Export Leads to CSV
  const handleExportCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Status", "Date", "Notes"];
    const rows = leads.map((l) => [
      l.firstName,
      l.lastName,
      l.email,
      l.phone,
      l.status,
      l.createdAt,
      l.notes || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `luxespace_leads_crm.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = leads.filter((l) => {
    const fullName = `${l.firstName} ${l.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Private Office CRM
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Client Enquiries</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Manage inbound leads, property requests, agent assignments, and customer profiles.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="flex items-center gap-2 border-white/20 hover:border-luxury-gold hover:text-luxury-gold text-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export CRM CSV</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="new">New Enquiry</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won (Deal Closed)</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Table list */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-luxury-border/20 text-gray-500 text-[9px] uppercase tracking-wider font-semibold bg-luxury-charcoal/20">
                <th className="py-4 px-6">Client Profile</th>
                <th className="py-4 px-6">Contact Channels</th>
                <th className="py-4 px-6">Property Interest</th>
                <th className="py-4 px-6">Lead Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No client enquiries registered.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => {
                  const property = properties.find((p) => p.id === lead.propertyInterestId);
                  
                  return (
                    <tr key={lead.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                      <td className="py-4.5 px-6">
                        <span className="font-serif text-sm text-white block">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="text-[9px] text-gray-400 block truncate max-w-xs font-light mt-0.5">
                          {lead.notes}
                        </span>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex gap-3 text-gray-400">
                          <a href={`mailto:${lead.email}`} title="Email Client" className="hover:text-white transition-colors">
                            <Mail className="w-4 h-4 text-luxury-gold" />
                          </a>
                          <a href={`tel:${lead.phone}`} title="Call Client" className="hover:text-white transition-colors">
                            <Phone className="w-4 h-4 text-luxury-gold" />
                          </a>
                          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" title="WhatsApp Client" className="hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                          </a>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 font-medium text-gray-300">
                        {property ? property.title : "General Enquiry"}
                      </td>
                      <td className="py-4.5 px-6 text-gray-400 font-light">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                          lead.status === "new"
                            ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                            : lead.status === "won"
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                            : "bg-orange-500/5 text-orange-400 border-orange-500/20"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              <h2 className="font-serif text-lg text-white">Modify Client Lead</h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
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

                {/* Lead Status */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Lead Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "new" | "contacted" | "qualified" | "won" | "lost")}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="new">New Enquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="won">Won (Deal Closed)</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {/* Property Interest */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Property Interest
                  </label>
                  <select
                    value={propertyInterestId}
                    onChange={(e) => setPropertyInterestId(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="">General Enquiry</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (AED {Number(p.price).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* CRM Notes */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    CRM Log Notes / History
                  </label>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
                  />
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
                Save Client File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
