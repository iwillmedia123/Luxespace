"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { Appointment, Lead, Agent, Property } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function AppointmentsCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // Drawer modal state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Form Fields
  const [leadId, setLeadId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [type, setType] = useState<"in-person" | "virtual" | "phone_call">("in-person");
  const [status, setStatus] = useState<"scheduled" | "completed" | "cancelled" | "no-show">("scheduled");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [data, lds, ags, props] = await Promise.all([
          db.getAppointments(),
          db.getLeads(),
          db.getAgents(),
          db.getProperties(),
        ]);
        setAppointments(data);
        setLeads(lds);
        setAgents(ags);
        setProperties(props);
        
        if (lds.length > 0) setLeadId(lds[0].id);
        if (ags.length > 0) setAgentId(ags[0].id);
        if (props.length > 0) setPropertyId(props[0].id);
      } catch (err) {
        console.error("Appointments load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingAppointment(null);
    if (leads.length > 0) setLeadId(leads[0].id);
    if (properties.length > 0) setPropertyId(properties[0].id);
    if (agents.length > 0) setAgentId(agents[0].id);
    setAppointmentDate(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
    setType("in-person");
    setStatus("scheduled");
    setNotes("");
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (app: Appointment) => {
    setEditingAppointment(app);
    setLeadId(app.leadId);
    setPropertyId(app.propertyId || "");
    setAgentId(app.agentId);
    setAppointmentDate(new Date(app.appointmentDate).toISOString().slice(0, 16));
    setType(app.type);
    setStatus(app.status);
    setNotes(app.notes || "");
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Omit<Appointment, "id" | "createdAt" | "updatedAt"> = {
      leadId,
      propertyId: propertyId || undefined,
      agentId,
      appointmentDate: new Date(appointmentDate).toISOString(),
      type,
      status,
      notes,
    };

    try {
      if (editingAppointment) {
        await db.updateAppointment(editingAppointment.id, payload);
      } else {
        await db.createAppointment(payload);
      }

      const updated = await db.getAppointments();
      setAppointments(updated);
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setLoading(true);
      await db.deleteAppointment(id);
      const updated = await db.getAppointments();
      setAppointments(updated);
      setLoading(false);
    }
  };

  const filtered = appointments.filter((a) =>
    statusFilter === "" || a.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Private Office Calendar
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Property Viewings</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Schedule viewings, assign advisors, coordinate luxury client visits.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Viewing</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-luxury-charcoal border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none appearance-none cursor-pointer"
        >
          <option value="">All Viewings</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
        </select>
      </div>

      {/* Table list */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-luxury-border/20 text-gray-500 text-[9px] uppercase tracking-wider font-semibold bg-luxury-charcoal/20">
                <th className="py-4 px-6">Viewing Schedule</th>
                <th className="py-4 px-6">Client Lead</th>
                <th className="py-4 px-6">Assigned Advisor</th>
                <th className="py-4 px-6">Property Residence</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No viewings scheduled yet.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const lead = leads.find((l) => l.id === app.leadId);
                  const agent = agents.find((a) => a.id === app.agentId);
                  const property = properties.find((p) => p.id === app.propertyId);

                  return (
                    <tr key={app.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                      <td className="py-4.5 px-6">
                        <div className="space-y-1">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-luxury-gold" />
                            {new Date(app.appointmentDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-light">
                            <Clock className="w-3 h-3 text-luxury-gold" />
                            {new Date(app.appointmentDate).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 font-serif text-sm text-white">
                        {lead ? `${lead.firstName} ${lead.lastName}` : "Unknown Client"}
                      </td>
                      <td className="py-4.5 px-6 text-gray-300 font-medium">
                        {agent ? agent.name : "Unassigned"}
                      </td>
                      <td className="py-4.5 px-6 text-gray-300">
                        {property ? property.title : "General Consultation"}
                      </td>
                      <td className="py-4.5 px-6">
                        <span className={`text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                          app.status === "scheduled"
                            ? "bg-blue-500/5 text-blue-400 border-blue-500/20"
                            : app.status === "completed"
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/5 text-red-400 border-red-500/20"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
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
              <h2 className="font-serif text-lg text-white">
                {editingAppointment ? "Modify viewing schedule" : "Log viewing schedule"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="h-[calc(100vh-9rem)] overflow-y-auto p-8 space-y-6">
              <div className="space-y-4">
                {/* Client Lead */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Client Lead File
                  </label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.firstName} {l.lastName} ({l.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property interest */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Property Selection
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (AED {Number(p.price).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Advisor */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Assigned Advisor
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

                {/* Viewing Date & Time */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Viewing Mode type */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Viewing Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "in-person" | "virtual" | "phone_call")}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="in-person">In-Person Tour</option>
                    <option value="virtual">Virtual Tour / Zoom</option>
                    <option value="phone_call">Phone Advisory Call</option>
                  </select>
                </div>

                {/* Viewing Status */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Viewing Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "scheduled" | "completed" | "cancelled" | "no-show")}
                    className="w-full bg-[#1f232c] border border-luxury-border/40 focus:border-luxury-gold/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">Client No-Show</option>
                  </select>
                </div>

                {/* Log Notes */}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">
                    Coordinator Notes
                  </label>
                  <textarea
                    rows={4}
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
                Save Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
