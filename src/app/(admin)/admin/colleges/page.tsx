"use client";

import React, { useState } from "react";
import { useColleges, useAdminAmbassadors } from "@/lib/data/hooks";
import { Building2, Plus, Users, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminCollegesPage() {
  const { data: colleges = [] } = useColleges();
  const { data: ambassadors = [] } = useAdminAmbassadors();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Building2 className="w-3.5 h-3.5" />
              Institutional Network
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 30</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Colleges & Campuses
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            State-wide collegiate roster across Tamil Nadu engineering and
            technology colleges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((col) => {
          const matchingAmbassadors = ambassadors.filter(
            (a) => a.profile.college === col.name
          );

          return (
            <div
              key={col.id}
              className="p-5 rounded-2xl bg-surface/90 border border-border/60 space-y-4 shadow-soft-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-xs font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {col.shortName}
                  </span>
                </div>

                <h2 className="text-base font-bold text-text">{col.name}</h2>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1 font-semibold text-text">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  {matchingAmbassadors.length} Active Lead(s)
                </span>
                <span className="font-mono text-[11px] text-text-muted/80">
                  {col.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
