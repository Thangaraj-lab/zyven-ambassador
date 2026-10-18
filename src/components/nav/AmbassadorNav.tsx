"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
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
  LogOut,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { mockRepository } from "@/lib/data/mock/mockRepository";
import { useRouter } from "next/navigation";

export function AmbassadorNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: notifications = [] } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/missions", label: t("missions"), icon: Sparkles },
    { href: "/leaderboard", label: t("leaderboard"), icon: Trophy },
    { href: "/rewards", label: t("rewards"), icon: Gift },
    { href: "/profile", label: t("profile"), icon: User },
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

  const user = session?.user;
  const userName = user?.name || "Ambassador";

  return (
    <>
      {/* Desktop Slim Sticky Top Nav */}
      <header className="sticky top-0 z-40 w-full glass-nav border-b border-border/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="md" href="/dashboard" showTagline />

          {/* Desktop 5 Nav Items with LayoutId Pill */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-colors text-text"
                >
                  {isActive && (
                    <motion.div
                      layoutId="ambassador-nav-pill"
                      className="absolute inset-0 rounded-full brand-gradient-bg opacity-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-2 ${
                      isActive ? "text-primary font-bold" : "text-text-muted hover:text-text"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="ambassador-nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 brand-gradient-bg rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Locale + Theme + Bell + User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleToggle />
            <ThemeToggle />
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={(id) => markRead(id)}
            />

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-surface-2 border border-border hover:border-primary/40 transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <Avatar name={userName} src={user?.avatarUrl} size="sm" />
                <span className="hidden sm:inline text-xs font-bold text-text truncate max-w-[100px]">
                  {userName.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted pr-1" />
              </button>

              <AnimatePresence>
                {avatarMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAvatarMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface border border-border shadow-soft-lg z-50 p-2"
                    >
                      <div className="p-2 border-b border-border/80">
                        <p className="text-xs font-bold text-text truncate">
                          {userName}
                        </p>
                        <p className="text-[11px] text-text-muted truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-text hover:bg-surface-2 rounded-xl transition-colors"
                        >
                          <User className="h-3.5 w-3.5 text-text-muted" />
                          <span>{t("profile")}</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-border/80">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>{t("logout")}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
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
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

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
