"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, UploadCloud, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;

export function EvidenceFileDropzone({
  file,
  onFileSelected,
  className = "",
}: {
  file: File | null;
  onFileSelected: (file: File | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const choose = async (candidate: File | undefined) => {
    if (!candidate) return;
    if (candidate.size > MAX_BYTES) {
      alert("Please choose a file smaller than 10MB.");
      return;
    }
    setIsChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 80));
    setIsChecking(false);
    onFileSelected(candidate);
  };
  return (
    <div className={cn("w-full", className)}>
      <input ref={inputRef} type="file" accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt" className="hidden" onChange={(e) => void choose(e.target.files?.[0])} />
      {file ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <FileText className="h-6 w-6 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-success"><CheckCircle className="h-4 w-4" />File ready</div>
            <p className="truncate text-xs text-text-muted">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button type="button" onClick={() => { onFileSelected(null); if (inputRef.current) inputRef.current.value = ""; }} className="rounded-full border border-border p-2 text-text-muted hover:text-danger" aria-label="Remove file"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); void choose(e.dataTransfer.files?.[0]); }} className={cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors", isDragging ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-primary/50")}>
          {isChecking ? <Loader2 className="h-7 w-7 animate-spin text-primary" /> : <UploadCloud className="mb-2 h-7 w-7 text-primary" />}
          <span className="text-xs font-bold text-text">Upload supporting file</span>
          <span className="mt-1 text-[11px] text-text-muted">Image, PDF, DOC, PPT or TXT · max 10MB</span>
        </div>
      )}
    </div>
  );
}
