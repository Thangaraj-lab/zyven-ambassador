import React from "react";
import { cn } from "@/lib/utils";
import { Award, Shield, Crown, Sparkles } from "lucide-react";

export type TierType = "bronze" | "silver" | "gold" | "champion";

interface TierBadgeProps {
  tier: TierType;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function TierBadge({
  tier,
  size = "md",
  className = "",
  showIcon = true,
}: TierBadgeProps) {
  const configs: Record<
    TierType,
    { label: string; icon: React.ReactNode; style: string; textStyle: string }
  > = {
    bronze: {
      label: "Bronze",
      icon: <Shield className="h-3.5 w-3.5" />,
      style: "bg-[#C8864B]/10 text-[#C8864B] border-[#C8864B]/30",
      textStyle: "text-[#C8864B]",
    },
    silver: {
      label: "Silver",
      icon: <Award className="h-3.5 w-3.5" />,
      style: "bg-[#9CA3AF]/15 text-[#6B7280] dark:text-[#D1D5DB] border-[#9CA3AF]/30",
      textStyle: "text-[#6B7280] dark:text-[#D1D5DB]",
    },
    gold: {
      label: "Gold",
      icon: <Sparkles className="h-3.5 w-3.5" />,
      style: "bg-[#E5B53A]/15 text-[#B45309] dark:text-[#FBBF24] border-[#E5B53A]/30",
      textStyle: "text-[#B45309] dark:text-[#FBBF24]",
    },
    champion: {
      label: "Champion",
      icon: <Crown className="h-3.5 w-3.5" />,
      style: "brand-gradient-bg text-white border-transparent shadow-soft-sm",
      textStyle: "text-white",
    },
  };

  const config = configs[tier] || configs.bronze;
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs gap-1 font-semibold",
    md: "px-2.5 py-1 text-xs gap-1.5 font-bold",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-extrabold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border select-none tracking-wide",
        config.style,
        sizeStyles[size],
        className
      )}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}
