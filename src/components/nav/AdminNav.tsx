"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Target,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/reviews", label: "Verification Queue", icon: CheckSquare },
    { href: "/admin/ambassadors", label: "Ambassadors", icon: Users },
    { href: "/admin/missions", label: "Manage Missions", icon: Target },
  ];

  const handleLogout = async () => {
    await mockRepository.logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r border-border bg-surface shrink-0 flex flex-col justify-between p-4 hidden md:flex h-screen sticky top-0">
      <div>
        {/* Brand header */}
        <div className="pb-6 pt-2 border-b border-border/80 px-2">
          <Logo size="md" href="/admin" showTagline />
          <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider">
            Admin Console
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {links.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors",
                  isActive
                    ? "brand-gradient-bg text-white shadow-soft-sm"
                    : "text-text-muted hover:text-text hover:bg-surface-2"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer actions */}
      <div className="pt-4 border-t border-border/80 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-muted hover:text-primary hover:bg-surface-2 rounded-xl transition-colors"
        >
          <span>View Ambassador App</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <div className="flex items-center justify-between px-2 pt-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
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
