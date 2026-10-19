"use client";

import type { Submission } from "@/lib/data/types";
import { ExternalLink, FileText, Image as ImageIcon, Link2 } from "lucide-react";

type ProofItem = NonNullable<Submission["proofItems"]>[number];

function isImageUrl(value: string) {
  return value.startsWith("data:image/") || /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value);
}

function displayName(path: string) {
  const clean = path.split("?")[0].split("/").pop();
  return clean || "Submitted file";
}

export function SubmissionEvidence({ items }: { items?: Submission["proofItems"] }) {
  if (!items?.length) return null;

  return (
    <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/60 space-y-3">
      <div className="text-[11px] font-semibold text-text-muted">
        Original submitted evidence ({items.length} item{items.length === 1 ? "" : "s"})
      </div>
      {items.map((item: ProofItem, index) => {
        const metadata = item.metadata ?? {};
        const screenshot = typeof metadata.screenshotDataUrl === "string" ? metadata.screenshotDataUrl : null;
        const signedUrl = typeof metadata.signedUrl === "string" ? metadata.signedUrl : null;
        const fileUrl = typeof metadata.fileUrl === "string" ? metadata.fileUrl : null;
        const openUrl = signedUrl || fileUrl || (item.filePath?.startsWith("http") ? item.filePath : null);
        const previewUrl = screenshot || (openUrl && isImageUrl(openUrl) ? openUrl : null);
        const metadataEntries = Object.entries(metadata).filter(([key]) => !["screenshotDataUrl", "signedUrl", "fileUrl"].includes(key));

        return (
          <div key={item.id || index} className="rounded-lg border border-border/50 bg-surface/60 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-text">
              {previewUrl ? <ImageIcon className="h-3.5 w-3.5 text-primary" /> : openUrl ? <FileText className="h-3.5 w-3.5 text-primary" /> : <Link2 className="h-3.5 w-3.5 text-primary" />}
              Evidence {index + 1}
            </div>
            {item.urlValue && (
              <a href={item.urlValue} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 break-all text-primary hover:underline">
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />{item.urlValue}
              </a>
            )}
            {item.textValue && <div className="whitespace-pre-wrap rounded-lg bg-bg/60 p-2.5 text-text-muted">{item.textValue}</div>}
            {previewUrl && (
              <div className="overflow-hidden rounded-lg border border-border/60 bg-black/30 p-2">
                {/* Evidence can be a data URL or a signed Supabase Storage URL. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={`Evidence ${index + 1} preview`} className="max-h-72 w-full object-contain" />
              </div>
            )}
            {openUrl && (
              <a href={openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 font-semibold text-primary hover:bg-primary/20">
                <FileText className="h-3.5 w-3.5" />Open {previewUrl ? "image" : displayName(item.filePath || openUrl)} <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {item.filePath && !openUrl && <div className="break-all text-text-muted">File awaiting secure preview: {item.filePath}</div>}
            {metadataEntries.length > 0 && <pre className="overflow-x-auto whitespace-pre-wrap text-[10px] text-text-muted">{JSON.stringify(Object.fromEntries(metadataEntries), null, 2)}</pre>}
          </div>
        );
      })}
    </div>
  );
}
