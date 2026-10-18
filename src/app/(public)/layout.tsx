import React from "react";
import { PublicNav } from "@/components/nav/PublicNav";
import { RouteProgressBar } from "@/components/nav/RouteProgressBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <RouteProgressBar />
      <PublicNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
