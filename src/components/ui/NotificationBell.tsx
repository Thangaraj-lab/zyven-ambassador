"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/data/types";

interface NotificationBellProps {
  notifications?: Notification[];
  unreadCount?: number;
  onMarkRead?: (id: string) => void;
  className?: string;
}

export function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  className = "",
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-9 w-9 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text hover:text-primary hover:border-primary/40 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface border border-border shadow-soft-lg z-50 p-4 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-text">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="mt-2 divide-y divide-border/60 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-text-muted text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "py-3 px-2 flex items-start gap-2.5 hover:bg-surface-2/60 rounded-xl transition-colors cursor-pointer",
                        !notif.readAt && "bg-primary/5"
                      )}
                      onClick={() => onMarkRead?.(notif.id)}
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                          {notif.body}
                        </p>
                      </div>
                      {!notif.readAt && (
                        <button
                          title="Mark read"
                          className="text-text-muted hover:text-success p-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
