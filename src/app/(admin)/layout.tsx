"use client";

import React, { useEffect } from "react";
import { AdminSidebar, AdminHeader } from "@/components/nav/AdminNav";
import { RouteProgressBar } from "@/components/nav/RouteProgressBar";
import { useSession } from "@/lib/data/hooks";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!session || !session.user) {
      router.push("/login?next=/admin");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
  }, [session, isLoading, router]);

  if (isLoading || !session?.user || session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-bg text-text">
      <RouteProgressBar />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
