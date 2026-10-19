"use client";

import React, { useState, useMemo } from "react";
import { useAnnouncements, usePublishAnnouncement } from "@/lib/data/hooks";
import { Button } from "@/components/ui/Button";
import {
  Megaphone,
  Pin,
  Plus,
  Send,
  Calendar,
  Users,
  Search,
  Globe,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AdminAnnouncementsPage() {
  const { data: announcements = [], isLoading } = useAnnouncements();
  const { mutateAsync: publishAnnouncement, isPending: isPublishing } =
    usePublishAnnouncement();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "team" | "ambassadors">("all");
  const [pinned, setPinned] = useState(false);

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const q = searchQuery.toLowerCase();
    return announcements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.authorName?.toLowerCase().includes(q)
    );
  }, [announcements, searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in both title and announcement body");
      return;
    }

    try {
      await publishAnnouncement({
        title: title.trim(),
        body: body.trim(),
        audience,
        pinned,
      });

      toast.success("Broadcast published successfully across network!");
      setTitle("");
      setBody("");
      setPinned(false);
      setShowCreateModal(false);
    } catch {
      toast.error("Failed to publish announcement");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Megaphone className="w-3.5 h-3.5" />
              Network Communications
            </span>
            <span className="text-xs text-text-muted font-medium">• Section 29</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Platform Announcements
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Publish systemic updates, hackathon launches, and policy notices to
            all participants.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="font-bold text-xs gap-1.5 shadow-soft-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Network Broadcast</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search broadcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border/60 rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="text-xs font-semibold text-text-muted">
          Showing {filteredAnnouncements.length} broadcasts
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {filteredAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-2xl border transition-all ${
              item.pinned
                ? "bg-gradient-to-r from-primary/5 via-surface to-surface border-primary/40 shadow-soft-sm ring-1 ring-primary/20"
                : "bg-surface/90 border-border/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                {item.pinned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Pin className="w-3 h-3 fill-amber-400" />
                    Pinned
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                  {item.audience === "all" ? (
                    <>
                      <Globe className="w-3 h-3" />
                      All Users
                    </>
                  ) : item.audience === "ambassadors" ? (
                    <>
                      <Shield className="w-3 h-3" />
                      Ambassadors Only
                    </>
                  ) : (
                    <>
                      <Users className="w-3 h-3" />
                      Campus Teams
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(item.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-text mb-2">
              {item.title}
            </h2>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line">
              {item.body}
            </p>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-muted">
              <span>
                Broadcast by:{" "}
                <strong className="text-text font-bold">
                  {item.authorName || "Zyvex Operations Admin"}
                </strong>
              </span>
              <span className="font-mono text-[11px] text-text-muted/70">
                {item.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Composer Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-soft-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">
                      New Network Broadcast
                    </h3>
                    <p className="text-xs text-text-muted">
                      Dispatch official platform notifications.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-text-muted hover:text-text text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. State-wide Hackathon Registrations Are Now Live!"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) =>
                      setAudience(e.target.value as typeof audience)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Platform Users (Students + Ambassadors)</option>
                    <option value="ambassadors">Ambassadors Only</option>
                    <option value="team">Campus Squads Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Message Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write detailed announcements, timelines, and registration instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/30 border border-border/40">
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-text">
                        Pin to Platform Feed
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Pins to the top of all user dashboards.
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                    className="font-semibold text-xs text-text-muted hover:text-text"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isPublishing}
                    className="font-bold text-xs gap-1.5 shadow-soft-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Broadcast</span>
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
