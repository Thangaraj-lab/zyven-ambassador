"use client";

import React from "react";
import Link from "next/link";
import { useMySubmissions, useMissions } from "@/lib/data/hooks";
import { StatusBadge, type MissionState } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function MySubmissionsPage() {
  const { data: submissions = [] } = useMySubmissions();
  const { data: missions = [] } = useMissions();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
          My Submissions Timeline
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Review your submitted tasks, verification statuses, and admin feedback.
        </p>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="No Submissions Found"
          description="You haven't submitted proof for any tasks yet. Explore active missions and start earning points today!"
          actionLabel="Explore Live Missions"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const mission = missions.find((m) => m.id === sub.missionId);
            const isApproved = sub.state === "APPROVED";
            const isRejected = sub.state === "REJECTED";

            return (
              <div
                key={sub.id}
                className="p-5 sm:p-6 rounded-[20px] bg-surface border border-border shadow-soft-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-text">
                      {mission?.title || "Campus Mission"}
                    </h3>
                    <span className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {sub.submittedAt
                        ? `Submitted on ${new Date(sub.submittedAt).toLocaleDateString()}`
                        : "Draft in progress"}
                    </span>
                  </div>
                  <StatusBadge state={sub.state as MissionState} />
                </div>

                {/* Proof preview */}
                <div className="p-3.5 rounded-xl bg-surface-2 border border-border/80 space-y-2 text-xs">
                  {sub.proofUrl && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-text-muted truncate">
                        Link: {sub.proofUrl}
                      </span>
                      <a
                        href={sub.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary font-bold hover:underline shrink-0"
                      >
                        <span>Open Proof</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {sub.screenshotDataUrl && (
                    <div className="pt-2">
                      <span className="font-semibold text-text-muted block mb-1.5">
                        Screenshot Proof:
                      </span>
                      <div className="relative h-32 w-48 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={sub.screenshotDataUrl}
                          alt="Screenshot Proof"
                          fill
                          sizes="192px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {sub.reviewReason && (
                    <div className="pt-2 border-t border-border/80">
                      <span className="font-bold text-text block mb-0.5">
                        Admin Note:
                      </span>
                      <p className="text-text-muted">{sub.reviewReason}</p>
                    </div>
                  )}
                </div>

                {/* Action CTA */}
                {isRejected && mission && (
                  <div className="flex justify-end">
                    <Link href={`/missions/${mission.slug}`}>
                      <Button variant="danger" size="sm">
                        Fix & Resubmit
                      </Button>
                    </Link>
                  </div>
                )}

                {isApproved && mission && (
                  <div className="flex items-center justify-between text-xs text-success font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Awarded +{mission.points} Points
                    </span>
                    <Link
                      href={`/missions/${mission.slug}`}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View Mission</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
