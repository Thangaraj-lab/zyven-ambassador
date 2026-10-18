"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Bell, Clock, Sparkles, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications, useMarkNotificationRead } from "@/lib/data/hooks";
import type { Notification } from "@/lib/data/types";

export default function NotificationsPage() {
  const router = useRouter();
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const handleMarkAllRead = () => {
    notifications
      .filter((n: Notification) => !n.readAt)
      .forEach((n: Notification) => markRead(n.id));
  };

  const handleItemClick = (id: string, href?: string) => {
    markRead(id);
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Activity Feed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <span>Notifications</span>
          </h1>
        </div>

        {notifications.some((n) => !n.readAt) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-1.5 font-bold"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 rounded-2xl bg-surface border border-border text-center text-xs text-text-muted">
            No notifications in your activity feed.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif.id, notif.href)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                !notif.readAt
                  ? "bg-surface border-primary/40 shadow-soft-sm ring-1 ring-primary/20"
                  : "bg-surface border-border/70 hover:bg-surface-2/60 opacity-80"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !notif.readAt
                    ? "brand-gradient-bg text-white"
                    : "bg-surface-2 text-text-muted border border-border"
                }`}
              >
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs sm:text-sm font-bold text-text truncate ${
                      !notif.readAt ? "text-primary" : ""
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-text-muted flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {notif.body}
                </p>
              </div>

              {!notif.readAt && (
                <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
