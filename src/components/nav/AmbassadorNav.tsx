"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { useSession, useNotifications, useMarkNotificationRead } from "@/lib/data/hooks";
import {
  LayoutDashboard,
  Sparkles,
  Trophy,
  Gift,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { motion } from "motion/react";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { useRouter } from "next/navigation";

export function AmbassadorNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const user = session?.user;
  const userName = user?.name || "Thangaraj";

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      activeMatcher: (p: string) => p === "/dashboard" || p === "/ambassador",
    },
    {
      href: "/missions",
      label: "My Tasks",
      icon: Sparkles,
      activeMatcher: (p: string) => p.startsWith("/missions"),
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      activeMatcher: (p: string) => p.startsWith("/leaderboard"),
    },
    {
      href: "/rewards",
      label: "Rewards",
      icon: Gift,
      activeMatcher: (p: string) => p.startsWith("/rewards"),
    },
    {
      href: "/missions/join-whatsapp-community",
      label: "Community",
      icon: Users,
      activeMatcher: (p: string) => p.includes("whatsapp"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      activeMatcher: (p: string) => p.startsWith("/profile"),
    },
  ];

  // Mobile scroll hide/show behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowMobileNav(false);
      } else {
        setShowMobileNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await mockRepository.logout();
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Left Sidebar matching Lovable Mockup */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-surface/90 backdrop-blur-md sticky top-0 h-screen p-6 justify-between z-30">
        <div className="space-y-8">
          {/* Brand Logo with 3D Crystal Icon */}
          <div className="px-2">
            <Logo size="md" href="/dashboard" showTagline={false} />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.activeMatcher(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "brand-gradient-bg text-white shadow-soft-sm font-bold"
                      : "text-text-muted hover:text-text hover:bg-surface-2"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-white" : "text-text-muted"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-border/80 space-y-3">
          <div className="flex items-center justify-between px-2">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-danger hover:bg-danger/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 w-full glass-nav border-b border-border/80 px-4 h-16 flex items-center justify-between">
        <Logo size="sm" href="/dashboard" showTagline={false} />
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
          <NotificationBell
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkRead={(id) => markRead(id)}
          />
          <Link
            href="/profile"
            className="grid h-8 w-8 place-items-center rounded-full bg-brand font-bold text-white text-xs"
          >
            {userName.charAt(0).toUpperCase()}
          </Link>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-border/80 px-2 py-2 transition-transform duration-300 ${
          showMobileNav ? "translate-y-0" : "translate-y-24"
        }`}
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.slice(0, 5).map((item) => {
            const isActive = item.activeMatcher(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors select-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-pill"
                    className="absolute inset-0 rounded-xl brand-gradient-bg opacity-15"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`h-5 w-5 transition-transform ${
                    isActive
                      ? "text-primary scale-110"
                      : "text-text-muted hover:text-text"
                  }`}
                />
                <span
                  className={`text-[10px] mt-1 font-semibold ${
                    isActive ? "text-primary font-bold" : "text-text-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
