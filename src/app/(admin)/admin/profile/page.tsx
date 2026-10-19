"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/data/hooks";
import { getRepository } from "@/lib/data/repository";
import { Button } from "@/components/ui/Button";
import {
  User,
  ShieldAlert,
  Mail,
  Key,
  LogOut,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const repo = await getRepository();
      await repo.logout();
      toast.success("Admin signed out");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              Platform Superuser
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Admin Profile & Access Key
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Platform root operations account credentials and active session control.
          </p>
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="font-bold text-xs gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </Button>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-surface/90 border border-border/60 space-y-6 shadow-soft-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-soft-md">
            A
          </div>
          <div>
            <h2 className="text-xl font-black text-text">
              {session?.user?.name || "Zyven Operations Admin"}
            </h2>
            <div className="text-xs text-text-muted mt-0.5 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{session?.user?.email || "admin@zyven.network"}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                Root Authority
              </span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> System Operational
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border/40 space-y-2 text-xs">
          <div className="font-bold text-text flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Security & Session Rules
          </div>
          <p className="text-text-muted leading-relaxed">
            Admin sessions require strict origin verification and enforce
            immutable audit logs for all mutations to user roles, point
            allocations, and task publishing.
          </p>
        </div>
      </div>
    </div>
  );
}
