"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Download, MailOpen, UserCheck } from "lucide-react";
import { db } from "@/lib/db";
import { NewsletterSubscriber } from "@/types";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

export default function NewsletterManagerPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSubscribers() {
      try {
        const data = await db.getNewsletterSubscribers();
        setSubscribers(data);
      } catch (err) {
        console.error("Newsletter load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      setLoading(true);
      try {
        await db.deleteNewsletterSubscriber(id);
        const updated = await db.getNewsletterSubscribers();
        setSubscribers(updated);
      } catch (err) {
        console.error("Delete subscriber error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export.");
      return;
    }

    const headers = ["ID", "Email Address", "Status", "Subscribed At"];
    const rows = subscribers.map((sub) => [
      sub.id,
      sub.email,
      sub.status,
      new Date(sub.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `luxespace_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-border/20 pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">
            Audience Management
          </span>
          <h1 className="text-3xl font-serif text-white mt-1">Newsletter Subscribers</h1>
          <p className="text-xs text-gray-400 mt-1.5 font-light">
            Manage your off-market private catalog newsletter registry and export subscriber profiles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 text-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Registry</span>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 select-none">
        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/20 shrink-0">
            <MailOpen className="w-5 h-5 text-luxury-gold" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Total Subscribers</span>
            <Typography variant="section" className="text-xl font-serif text-white mt-0.5 leading-none">
              {subscribers.length}
            </Typography>
          </div>
        </div>

        <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold block">Active Registry Status</span>
            <Typography variant="section" className="text-xl font-serif text-emerald-400 mt-0.5 leading-none">
              Healthy
            </Typography>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-luxury-dark border border-luxury-border/30 rounded-2xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
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
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Subscribed At</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border/20 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-5 h-5 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] uppercase tracking-wider">Loading subscribers...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-luxury-charcoal/10 transition-colors">
                    <td className="py-4.5 px-6 font-medium text-white">
                      {sub.email}
                    </td>
                    <td className="py-4.5 px-6 text-gray-400 font-light">
                      {new Date(sub.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer p-1"
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
    </div>
  );
}
