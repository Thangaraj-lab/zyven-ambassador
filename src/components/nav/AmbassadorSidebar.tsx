"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { triggerLogoutDialog } from "@/components/motion/LogoutModal";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  Users,
  Megaphone,
  Trophy,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AmbassadorSidebar() {
  const pathname = usePathname();

  const primaryLinks = [
    { href: "/ambassador", label: "Overview", icon: LayoutDashboard },
    { href: "/ambassador/tasks", label: "Tasks", icon: ClipboardList },
    { href: "/ambassador/reviews", label: "Reviews", icon: CheckCircle2 },
    { href: "/ambassador/team", label: "Team", icon: Users },
    { href: "/ambassador/announcements", label: "Announcements", icon: Megaphone },
  ];

  const secondaryLinks = [
    { href: "/ambassador/team#leaderboard", label: "Team Leaderboard", icon: Trophy },
    { href: "/ambassador/profile", label: "Profile", icon: User },
    { href: "/ambassador/profile#settings", label: "Settings", icon: Settings },
  ];

  const supportLinks = [
    { href: "/ambassador/help", label: "Help & Guide", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface shrink-0 flex flex-col justify-between p-4 hidden md:flex h-screen sticky top-0 overflow-y-auto z-20">
      <div className="space-y-6">
        {/* Brand header */}
        <div className="pb-4 pt-2 border-b border-border/80 px-2">
          <Logo size="md" href="/ambassador" showTagline={false} />
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider">
            Ambassador Portal
          </span>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Workspace
          </span>
          <nav className="space-y-1 pt-1">
            {primaryLinks.map((link) => {
              const isActive =
                link.href === "/ambassador"
                  ? pathname === "/ambassador"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-colors",
                    isActive
                      ? "brand-gradient-bg text-white shadow-soft-sm"
                      : "text-text-muted hover:text-text hover:bg-surface-2"
                  )}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-2 border-t border-border/60">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Leadership & Account
          </span>
          <nav className="space-y-1 pt-1">
            {secondaryLinks.map((link) => {
              const isActive = pathname === link.href.split("#")[0];

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs transition-colors",
                    isActive && !link.href.includes("#")
                      ? "bg-surface-2 text-text font-black"
                      : "text-text-muted hover:text-text hover:bg-surface-2"
                  )}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Help & Support */}
        <div className="space-y-1 pt-2 border-t border-border/60">
          <nav className="space-y-1">
            {supportLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer controls & Logout */}
      <div className="pt-4 border-t border-border/80 space-y-2 mt-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-muted hover:text-primary hover:bg-surface-2 rounded-xl transition-colors"
        >
          <span>Student View</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <div className="flex items-center justify-between px-2 pt-1">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <button
          onClick={() => triggerLogoutDialog()}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer mt-1"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
