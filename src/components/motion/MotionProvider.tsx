"use client";

import React from "react";
import { LivingInterfaceProvider } from "./LivingInterface";
import { MissionPortal } from "./MissionPortal";
import { GravityField } from "./GravityField";
import { LogoutModal } from "./LogoutModal";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LivingInterfaceProvider>
      {children}
      <MissionPortal />
      <GravityField />
      <LogoutModal />
    </LivingInterfaceProvider>
  );
}
