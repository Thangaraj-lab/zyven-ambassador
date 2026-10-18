"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, CheckCircle, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onImageSelected: (dataUrl: string | null) => void;
  className?: string;
  label?: string;
  subtext?: string;
}

export function FileDropzone({
  onImageSelected,
  className = "",
  label = "Upload Screenshot Proof",
  subtext = "PNG, JPG up to 10MB (auto-compressed <1MB)",
}: FileDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG)");
      return;
    }

    try {
      setIsCompressing(true);
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
        setIsCompressing(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch {
      // Fallback without compression
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
        setIsCompressing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border border-border bg-surface p-3 flex items-center gap-4 group"
          >
            <div className="relative h-20 w-28 rounded-xl overflow-hidden border border-border/60 shrink-0">
              <Image
                src={preview}
                alt="Uploaded proof"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-success text-xs font-bold">
                <CheckCircle className="h-4 w-4" />
                <span>Screenshot Ready</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5 truncate">
                Optimized and compressed
              </p>
            </div>

            <button
              onClick={handleRemove}
              className="h-8 w-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer mr-1"
              title="Remove screenshot"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-surface-2/50 bg-surface"
            )}
          >
            {isCompressing ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-xs font-semibold text-text">
                  Compressing image...
                </span>
              </div>
            ) : (
              <>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-text mb-1">{label}</h4>
                <p className="text-xs text-text-muted max-w-xs">{subtext}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-primary px-3 py-1 rounded-full bg-primary/10">
                    Browse File
                  </span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
