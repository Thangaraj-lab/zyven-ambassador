import React from "react";

interface ZyvenMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function ZyvenMark({
  size = 32,
  className = "",
  ...props
}: ZyvenMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Zyvex Mark"
      {...props}
    >
      <defs>
        <linearGradient id="zyven-grad-top" x1="6" y1="8" x2="42" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="zyven-grad-diag" x1="42" y1="12" x2="6" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="zyven-grad-bot" x1="6" y1="36" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* Top ribbon bar */}
      <path
        d="M8 10C8 7.79086 9.79086 6 12 6H38C40.2091 6 42 7.79086 42 10V14C42 16.2091 40.2091 18 38 18H18L8 10Z"
        fill="url(#zyven-grad-top)"
      />

      {/* Diagonal dynamic ribbon */}
      <path
        d="M38 12L14 36H24L42 18V12H38Z"
        fill="url(#zyven-grad-diag)"
        opacity="0.95"
      />

      {/* Bottom ribbon bar */}
      <path
        d="M10 32H36C38.2091 32 40 33.7909 40 36V40C40 42.2091 38.2091 44 36 44H10C7.79086 44 6 42.2091 6 40V36C6 33.7909 7.79086 32 10 32Z"
        fill="url(#zyven-grad-bot)"
      />
    </svg>
  );
}
