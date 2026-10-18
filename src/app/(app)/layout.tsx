"use client";

import React, { useEffect } from "react";
import { AmbassadorNav } from "@/components/nav/AmbassadorNav";
import { RouteProgressBar } from "@/components/nav/RouteProgressBar";
import { useSession } from "@/lib/data/hooks";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!session || !session.user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (session.user.role === "admin") {
      router.push("/admin");
      return;
    }

    if (!session.profile) {
      router.push("/register/profile");
      return;
    }

    if (session.profile.status === "pending") {
      router.push("/pending");
      return;
    }
  }, [session, isLoading, router, pathname]);

  if (isLoading || !session?.user || session.user.role === "admin") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text pb-20 md:pb-8">
      <RouteProgressBar />
      <AmbassadorNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
