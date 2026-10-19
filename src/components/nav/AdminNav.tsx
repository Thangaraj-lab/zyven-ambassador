"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Target,
  UserCheck,
  Shield,
  Megaphone,
  Gift,
  Building2,
  BarChart3,
  FileText,
  Settings,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerLogoutDialog } from "@/components/motion/LogoutModal";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/reviews", label: "Reviews", icon: CheckSquare },
    { href: "/admin/tasks", label: "Tasks", icon: Target },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/ambassadors", label: "Ambassadors", icon: UserCheck },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/rewards", label: "Rewards", icon: Gift },
    { href: "/admin/colleges", label: "Colleges", icon: Building2 },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/audit-log", label: "Audit Log", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface shrink-0 flex flex-col justify-between p-4 hidden md:flex h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand header */}
        <div className="pb-4 pt-2 border-b border-border/80 px-2">
          <Logo size="md" href="/admin" showTagline />
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider">
            Admin Operations Center
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1">
          {links.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href) ||
                  (link.href === "/admin/tasks" && pathname.startsWith("/admin/missions"));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs transition-colors",
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

      {/* Footer actions */}
      <div className="pt-4 border-t border-border/80 space-y-2 mt-4">
        <Link
          href="/dashboard"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-muted hover:text-primary hover:bg-surface-2 rounded-xl transition-colors"
        >
          <span>View Student Portal</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <div className="flex items-center justify-between px-2 pt-1">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <button
          onClick={() => triggerLogoutDialog()}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer mt-1"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
}

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 w-full glass-nav border-b border-border/80 px-4 py-3 flex md:hidden items-center justify-between">
      <Logo size="sm" href="/admin" />
      <div className="flex items-center gap-2">
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
