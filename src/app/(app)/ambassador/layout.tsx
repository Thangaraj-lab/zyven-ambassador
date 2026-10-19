"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AmbassadorSidebar } from "@/components/nav/AmbassadorSidebar";
import { useSession } from "@/lib/data/hooks";
import { Loader2 } from "lucide-react";
import { RouteProgressBar } from "@/components/nav/RouteProgressBar";

export default function AmbassadorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!session || !session.user) {
      router.push("/login?next=/ambassador");
      return;
    }

    // Role-based route protection: Only ambassador and admin may enter
    if (session.user.role !== "ambassador" && session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [session, isLoading, router]);

  if (isLoading || !session?.user || (session.user.role !== "ambassador" && session.user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bg text-text">
      <RouteProgressBar />
      {/* Dedicated Section 8 Ambassador Sidebar */}
      <AmbassadorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
