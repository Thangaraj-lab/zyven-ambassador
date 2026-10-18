import React from "react";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import { Crown, Medal } from "lucide-react";

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  college: string;
  points: number;
  avatarUrl?: string | null;
  isYou?: boolean;
}

interface LeaderboardRowProps {
  user: LeaderboardUser;
  className?: string;
  onClick?: () => void;
}

export function LeaderboardRow({
  user,
  className = "",
  onClick,
}: LeaderboardRowProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="h-7 w-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
          <Crown className="h-4 w-4 fill-amber-950 stroke-1" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="h-7 w-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center">
          <Medal className="h-3.5 w-3.5 fill-slate-800 stroke-1" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="h-7 w-7 rounded-full bg-amber-700/80 text-amber-100 font-black text-xs flex items-center justify-center">
          <Medal className="h-3.5 w-3.5 fill-amber-100 stroke-1" />
        </div>
      );
    }
    return (
      <span className="text-xs font-bold text-text-muted tabular-nums w-7 text-center">
        #{rank}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-3.5 sm:px-4 rounded-2xl border transition-all select-none",
        user.isYou
          ? "border-primary bg-primary/5 shadow-soft-sm ring-1 ring-primary/30"
          : "border-border bg-surface hover:bg-surface-2/60",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0 flex items-center justify-center">
          {getRankBadge(user.rank)}
        </div>

        <Avatar name={user.name} src={user.avatarUrl} size="md" />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-text truncate">{user.name}</h4>
            {user.isYou && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold brand-gradient-bg text-white">
                YOU
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted truncate mt-0.5">
            {user.college}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0 pl-3">
        <span className="text-sm sm:text-base font-extrabold text-text tabular-nums">
          {user.points.toLocaleString()}
        </span>
        <span className="text-xs text-text-muted ml-1">pts</span>
      </div>
    </div>
  );
}
