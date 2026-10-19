"use client";

import React, { useState, useMemo } from "react";
import { useAuditLogs } from "@/lib/data/hooks";
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Terminal,
} from "lucide-react";

export default function AdminAuditLogPage() {
  const { data: logs = [], isLoading } = useAuditLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedAction !== "ALL" && log.action !== selectedAction) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.actorName?.toLowerCase().includes(q) ||
          log.entity.toLowerCase().includes(q) ||
          log.entityId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, selectedAction, searchQuery]);

  // Unique actions for filter
  const actionTypes = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.action));
    return Array.from(set);
  }, [logs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Security & Compliance
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 31</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Immutable Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Realtime cryptographic ledger tracking role elevations, point approvals,
            and task lifecycle mutations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface border border-border/60 text-xs text-text focus:outline-none focus:border-primary font-semibold"
          >
            <option value="ALL">All Actions ({logs.length})</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search action, actor, or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface/90 border border-border/60 rounded-2xl overflow-hidden shadow-soft-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-surface-elevated/40 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4 text-right">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-surface-elevated/20 transition-colors font-mono"
                >
                  <td className="py-3 px-4 text-[11px] text-text-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-primary">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans font-semibold text-text">
                    {log.actorName || log.actorId}
                  </td>

                  <td className="py-3 px-4 text-text-muted">
                    <span className="font-sans font-medium text-text">
                      {log.entity}
                    </span>{" "}
                    ({log.entityId})
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.result || "SUCCESS"}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right text-[11px] text-text-muted max-w-xs truncate">
                    {log.metadata
                      ? JSON.stringify(log.metadata)
                      : log.target || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
