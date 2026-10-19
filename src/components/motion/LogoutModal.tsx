"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "@/lib/data/hooks";
import { getRepository } from "@/lib/data/repository";
import { Avatar } from "@/components/ui/Avatar";
import { LogOut, ShieldCheck, X, ArrowRight, UserCheck } from "lucide-react";
import { useMotionOK } from "@/lib/motion";

export function triggerLogoutDialog() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("zyven-open-logout-modal"));
}

export function LogoutModal() {
  const router = useRouter();
  const motionOK = useMotionOK();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("zyven-open-logout-modal", handleOpen);
    return () => window.removeEventListener("zyven-open-logout-modal", handleOpen);
  }, []);

  const handleConfirmLogout = async () => {
    setIsSigningOut(true);
    const repository = await getRepository();
    await repository.logout();

    setTimeout(() => {
      setIsOpen(false);
      setIsSigningOut(false);
      router.push("/login");
    }, motionOK ? 450 : 50);
  };

  if (!isOpen) return null;

  const user = session?.user;
  const userName = user?.name || "Thangaraj";
  const userRole = user?.role || "ambassador";
  const userEmail = user?.email || "ambassador@mec.edu";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4">
        {/* Spatial Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSigningOut && setIsOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window with Clean Motion Graphics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md w-full rounded-[24px] bg-surface p-6 sm:p-7 border border-border shadow-2xl z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Session Security</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              disabled={isSigningOut}
              className="p-1 rounded-full text-text-muted hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* User Identity Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-border">
            <Avatar name={userName} src={user?.avatarUrl} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-text truncate">{userName}</h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {userRole}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate">{userEmail}</p>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text tracking-tight">Sign out of Zyven?</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Your points and task ledger will be securely saved. You can sign back in anytime.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isSigningOut}
              className="py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-surface-2 text-xs font-bold text-text transition-colors cursor-pointer disabled:opacity-50"
            >
              Stay Signed In
            </button>

            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={isSigningOut}
              className="py-2.5 px-4 rounded-xl bg-danger text-white hover:bg-danger/90 text-xs font-bold shadow-soft-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSigningOut ? (
                <span>Signing out...</span>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Confirm Sign Out</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
