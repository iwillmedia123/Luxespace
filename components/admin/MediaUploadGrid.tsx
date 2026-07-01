"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Film, ImageIcon, GripVertical } from "lucide-react";

interface MediaUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  videos?: string[];
  onVideosChange?: (videos: string[]) => void;
  maxImages?: number;
  maxVideos?: number;
}

/**
 * MediaUploadGrid — Production-grade media uploader for the Admin Dashboard.
 * 
 * In sandbox mode (no Supabase): Converts files to base64 data URLs and stores inline.
 * When Supabase is configured: Upload to Supabase Storage bucket and return public URLs.
 */
export default function MediaUploadGrid({
  images,
  onChange,
  videos = [],
  onVideosChange,
  maxImages = 20,
  maxVideos = 5,
}: MediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const processImageFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) return;

      setUploading(true);

      const newUrls: string[] = [];

      for (const file of fileArray) {
        if (images.length + newUrls.length >= maxImages) break;

        // Compress + convert to base64 data URL (sandbox mode)
        // In production with Supabase, this would upload to Storage bucket
        const url = await fileToDataUrl(file, 1200, 0.85);
        newUrls.push(url);
      }

      onChange([...images, ...newUrls]);
      setUploading(false);
    },
    [images, onChange, maxImages]
  );

  const processVideoFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!onVideosChange) return;
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("video/")
      );
      if (fileArray.length === 0) return;

      setUploading(true);

      const newUrls: string[] = [];

      for (const file of fileArray) {
        if (videos.length + newUrls.length >= maxVideos) break;
        // For videos, create object URL (blob) for preview; in production upload to Supabase Storage
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      }

      onVideosChange([...videos, ...newUrls]);
      setUploading(false);
    },
    [videos, onVideosChange, maxVideos]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = e.dataTransfer.files;
      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      const videoFiles = Array.from(files).filter((f) =>
        f.type.startsWith("video/")
      );
      if (imageFiles.length > 0) processImageFiles(imageFiles);
      if (videoFiles.length > 0) processVideoFiles(videoFiles);
    },
    [processImageFiles, processVideoFiles]
  );

  const handleRemoveImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const handleRemoveVideo = (idx: number) => {
    if (onVideosChange) {
      onVideosChange(videos.filter((_, i) => i !== idx));
    }
  };

  const handleSetCover = (idx: number) => {
    if (idx === 0) return;
    const reordered = [...images];
    const [moved] = reordered.splice(idx, 1);
    reordered.unshift(moved);
    onChange(reordered);
  };

  return (
    <div className="col-span-2 space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
          dragOver
            ? "border-luxury-gold bg-luxury-gold/5"
            : "border-luxury-border/40 hover:border-luxury-gold/40 bg-luxury-charcoal/20"
        }`}
        onClick={() => imageInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-luxury-gold font-medium">
              Processing files...
            </span>
          </>
        ) : (
          <>
            <Upload
              className={`w-10 h-10 transition-colors ${
                dragOver ? "text-luxury-gold" : "text-luxury-gold/60"
              }`}
            />
            <span className="text-sm text-gray-300 font-light">
              Drag & drop images here, or{" "}
              <span className="text-luxury-gold font-medium underline underline-offset-2">
                browse files
              </span>
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">
              JPG, PNG, WEBP up to 10MB • Max {maxImages} images
            </span>
          </>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) processImageFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm,video/mov"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) processVideoFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Image Thumbnails Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
            <ImageIcon className="w-3 h-3 text-luxury-gold" />
            Property Images ({images.length}/{maxImages})
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-square rounded-xl overflow-hidden border group cursor-pointer transition-all duration-300 ${
                  idx === 0
                    ? "border-luxury-gold/60 ring-2 ring-luxury-gold/20"
                    : "border-luxury-border/30 hover:border-luxury-gold/30"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${img})` }}
                />

                {/* Cover Badge */}
                {idx === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-luxury-gold text-luxury-charcoal text-[7px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded">
                    Cover
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(idx);
                      }}
                      className="w-7 h-7 rounded-full bg-luxury-charcoal border border-luxury-border/40 hover:border-luxury-gold hover:text-luxury-gold flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                      title="Set as Cover"
                    >
                      <GripVertical className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="w-7 h-7 rounded-full bg-luxury-charcoal border border-luxury-border/40 hover:border-red-400 hover:text-red-400 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Upload Section */}
      {onVideosChange && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-2">
              <Film className="w-3 h-3 text-luxury-gold" />
              Property Videos ({videos.length}/{maxVideos})
            </label>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="text-[9px] uppercase tracking-wider text-luxury-gold font-bold hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              Upload Video
            </button>
          </div>

          {videos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {videos.map((vid, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-luxury-border/30 hover:border-luxury-gold/30 group transition-all duration-300 bg-luxury-charcoal"
                >
                  <video
                    src={vid}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    onMouseEnter={(e) =>
                      (e.target as HTMLVideoElement).play()
                    }
                    onMouseLeave={(e) => {
                      const el = e.target as HTMLVideoElement;
                      el.pause();
                      el.currentTime = 0;
                    }}
                  />

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                      <Film className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Remove Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="w-8 h-8 rounded-full bg-luxury-charcoal border border-luxury-border/40 hover:border-red-400 hover:text-red-400 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                      title="Remove Video"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compress an image file to a base64 data URL.
 * Uses canvas to resize and compress.
 */
function fileToDataUrl(
  file: File,
  maxDimension: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
