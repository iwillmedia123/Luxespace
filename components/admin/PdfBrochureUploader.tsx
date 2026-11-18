"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, X, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/db";

interface PdfBrochureUploaderProps {
  url?: string;
  fileName?: string;
  fileSize?: string;
  onChange: (data: { url: string; name: string; size: string } | null) => void;
  maxSizeMb?: number;
}

export default function PdfBrochureUploader({
  url,
  fileName,
  fileSize,
  onChange,
  maxSizeMb = 20,
}: PdfBrochureUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
    return (bytes / 1024).toFixed(0) + " KB";
  };

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      // Strict validation: PDF only
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        setError("Invalid file format. Only official PDF documents are supported.");
        return;
      }

      // Strict validation: Max 20MB
      const maxSizeBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const actualMb = (file.size / (1024 * 1024)).toFixed(1);
        setError(`File size (${actualMb} MB) exceeds the maximum allowed limit of ${maxSizeMb}MB.`);
        return;
      }

      setUploading(true);
      const isDb = isSupabaseConfigured();
      const formattedSize = formatFileSize(file.size);

      try {
        if (isDb) {
          const supabase = createClient();
          const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
          const storagePath = `brochures/${crypto.randomUUID()}-${cleanName}`;
          const { error: uploadErr } = await supabase.storage.from("luxespace").upload(storagePath, file, {
            contentType: "application/pdf",
            upsert: true,
          });

          if (uploadErr) {
            console.error("Supabase PDF upload error:", uploadErr.message);
            // Fallback to base64 data URL if storage upload failed
            const base64Url = await fileToDataUrl(file);
            onChange({
              url: base64Url,
              name: file.name,
              size: formattedSize,
            });
          } else {
            const { data: { publicUrl } } = supabase.storage.from("luxespace").getPublicUrl(storagePath);
            onChange({
              url: publicUrl,
              name: file.name,
              size: formattedSize,
            });
          }
        } else {
          // Local sandbox mode: Convert to base64 Data URL
          const base64Url = await fileToDataUrl(file);
          onChange({
            url: base64Url,
            name: file.name,
            size: formattedSize,
          });
        }
      } catch (err) {
        console.error("PDF upload failure:", err);
        setError("Failed to process brochure file. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [maxSizeMb, onChange]
  );

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    setError(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Error Alert Banner */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between gap-2 text-xs text-red-300 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active File Preview Card */}
      {url ? (
        <div className="bg-[#191d25] border border-luxury-border/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg group hover:border-luxury-gold/50 transition-all duration-300">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex flex-col items-center justify-center shrink-0 text-red-400 font-bold">
              <FileText className="w-5 h-5 mb-0.5" />
              <span className="text-[8px] tracking-wider uppercase font-mono">PDF</span>
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white truncate max-w-[280px] sm:max-w-[340px]" title={fileName || "Project_Brochure.pdf"}>
                  {fileName || "Project_Brochure.pdf"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Validated</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5">
                <span>Size: <strong className="text-gray-300 font-mono">{fileSize || "PDF Document"}</strong></span>
                <span>•</span>
                <span>Max: {maxSizeMb}MB</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-luxury-border/20">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-luxury-dark border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              title="Preview / Download PDF in browser"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Preview</span>
            </a>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-luxury-dark border border-luxury-border/40 hover:border-luxury-gold hover:text-white text-gray-300 text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              title="Upload a new PDF to replace this one"
            >
              <RefreshCw className="w-3 h-3 text-luxury-gold" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Remove brochure file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Drag & Drop Upload Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
            dragOver
              ? "border-luxury-gold bg-luxury-gold/10 scale-[1.01]"
              : "border-luxury-border/40 hover:border-luxury-gold/60 bg-[#161a22] hover:bg-[#191d26]"
          } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold flex items-center justify-center mb-3 shadow-inner">
            {uploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-semibold text-white">
              {uploading ? "Processing & Uploading PDF..." : "Drag & Drop Project Brochure (PDF Only)"}
            </h4>
            <p className="text-[10px] sm:text-xs text-gray-400 font-light">
              Click to browse your device or drag file here
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#c5a880] font-mono font-bold bg-[#c5a880]/10 px-3 py-1 rounded-full border border-[#c5a880]/20">
            <span>PDF Format Only</span>
            <span>•</span>
            <span>Max Size {maxSizeMb}MB</span>
          </div>
        </div>
      )}
    </div>
  );
}
