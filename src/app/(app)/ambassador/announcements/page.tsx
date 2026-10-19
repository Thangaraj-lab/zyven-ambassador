"use client";

import React, { useState, useMemo } from "react";
import {
  useAnnouncements,
  usePublishAnnouncement,
  useMyTeam,
  useSession,
} from "@/lib/data/hooks";
import { Button } from "@/components/ui/Button";
import {
  Megaphone,
  Pin,
  Plus,
  Send,
  Calendar,
  Users,
  Sparkles,
  Search,
  Bell,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AmbassadorAnnouncementsPage() {
  const { data: session } = useSession();
  const { data: myTeam } = useMyTeam();
  const { data: announcements = [], isLoading } = useAnnouncements();
  const { mutateAsync: publishAnnouncement, isPending: isPublishing } =
    usePublishAnnouncement();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);

  // Filter announcements for this team or global
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      // Show if global ("all"), or for team, or created by ambassador
      const matchesAudience =
        !a.audience ||
        a.audience === "all" ||
        a.audience === "ambassadors" ||
        a.audience === "team" ||
        (myTeam && a.teamId === myTeam.id);

      if (!matchesAudience) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          a.authorName?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [announcements, myTeam, searchQuery]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in both title and announcement body");
      return;
    }

    try {
      await publishAnnouncement({
        title: title.trim(),
        body: body.trim(),
        audience: "team",
        teamId: myTeam?.id,
        pinned,
      });

      toast.success("Broadcast dispatched to your campus squad!");
      setTitle("");
      setBody("");
      setPinned(false);
      setShowCreateModal(false);
    } catch {
      toast.error("Failed to broadcast announcement. Try again.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Megaphone className="w-3.5 h-3.5" />
              Broadcast Center
            </span>
            {myTeam && (
              <span className="text-xs text-text-muted font-medium">
                • {myTeam.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Squad Announcements
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Publish notices, event alerts, and mission briefs directly to your
            campus students.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="font-bold text-xs gap-1.5 shadow-soft-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search announcements..."
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
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border/60 bg-surface/30">
            <MessageSquare className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-60" />
            <h3 className="text-sm font-bold text-text">No announcements yet</h3>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              Keep your squad aligned and motivated. Post your first team notice
              above!
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
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
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Pin className="w-3 h-3 fill-amber-400" />
                      Pinned Notice
                    </span>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {item.audience === "team" ? "Campus Squad" : "Platform Wide"}
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

              {item.authorName && (
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-text-muted">
                  <span className="font-medium">
                    Posted by:{" "}
                    <strong className="text-text font-bold">
                      {item.authorName}
                    </strong>
                  </span>
                  <span className="text-[11px] text-text-muted/70">
                    Verified Broadcast
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Broadcast Composer Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-soft-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">
                      Broadcast to Squad
                    </h3>
                    <p className="text-xs text-text-muted">
                      Direct notification to all members of{" "}
                      {myTeam?.name || "your campus squad"}.
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

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Squad Sync: Meet at CS Lab 2 tomorrow at 4 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">
                    Message Body
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your squad notice, tips for the upcoming task, or campus registration targets..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated/40 border border-border text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/30 border border-border/40">
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-text">
                        Pin to Top of Squad Board
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Keeps this message visible at the very top for all students.
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
