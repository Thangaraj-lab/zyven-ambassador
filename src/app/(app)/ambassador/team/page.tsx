"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AmbassadorTeamRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ambassador");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
      <Loader2 className="h-6 w-6 text-primary animate-spin" />
      <p className="text-xs text-text-muted">Redirecting to Ambassador Workspace...</p>
    </div>
  );
}
