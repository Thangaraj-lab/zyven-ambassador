import React from "react";
import { RouteProgressBar } from "@/components/nav/RouteProgressBar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { Logo } from "@/components/brand/Logo";
import { BackButton } from "@/components/ui/BackButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text bg-radial-wash">
      <RouteProgressBar />

      {/* Top minimalistic header */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <BackButton fallbackHref="/" label="Home" />
          <Logo size="md" href="/" />
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
