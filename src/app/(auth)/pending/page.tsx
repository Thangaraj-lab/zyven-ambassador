"use client";

import React from "react";
import Link from "next/link";
import { Hourglass, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-md rounded-[24px] bg-surface p-8 border border-border shadow-soft-lg text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-warning/15 border border-warning/30 text-warning flex items-center justify-center mx-auto">
        <Hourglass className="h-8 w-8 animate-spin-slow" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-text tracking-tight">
          Application Under Review
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Thank you for applying to the Zyven Student Ambassador Program. Our campus team is reviewing your profile.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface-2 border border-border text-left space-y-2 text-xs">
        <p className="font-bold text-text">What happens next?</p>
        <ul className="list-disc list-inside space-y-1 text-text-muted text-[11px]">
          <li>Verification typically completes within 24 hours.</li>
          <li>You will receive an alert once approved.</li>
          <li>You can immediately take on campus missions.</li>
        </ul>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          variant="secondary"
          size="md"
          className="w-full font-bold gap-2"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Check Status</span>
        </Button>

        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
