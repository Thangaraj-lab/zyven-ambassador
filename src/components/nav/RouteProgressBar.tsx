"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const anim = requestAnimationFrame(() => {
      setLoading(true);
      timer = setTimeout(() => {
        setLoading(false);
      }, 250);
    });

    return () => {
      cancelAnimationFrame(anim);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none overflow-hidden">
      <div className="h-full brand-gradient-bg animate-pulse w-full" />
    </div>
  );
}
