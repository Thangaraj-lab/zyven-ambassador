"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ZyvenMark } from "@/components/brand/ZyvenMark";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useSession } from "@/lib/data/hooks";
import confetti from "canvas-confetti";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMotionOK, ease } from "@/lib/motion";

export default function WelcomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const motionOK = useMotionOK();

  const [canSkip, setCanSkip] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const userName = session?.user?.name || "Thangaraj";
  const cohortNumber = session?.profile?.cohortNumber || 37;

  useEffect(() => {
    // Confetti burst once
    if (motionOK) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#7C3AED", "#A78BFA", "#10B981"],
        disableForReducedMotion: true,
      });
    }

    const timer = setTimeout(() => {
      setCanSkip(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [motionOK]);

  const handleContinue = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 850);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-all duration-700 ${
        isTransitioning ? "scale-105 opacity-0" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(circle at center, #151A33 0%, #070A16 100%)",
        color: "#F3F4FA",
      }}
    >
      {/* Background glow orb */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={motionOK ? { scale: 0.8, opacity: 0 } : undefined}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: ease.out }}
        className="relative z-10 flex flex-col items-center max-w-lg space-y-6"
      >
        {/* Animated Mark */}
        <motion.div
          animate={motionOK ? { y: [0, -8, 0] } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
          <ZyvenMark size={96} className="relative drop-shadow-2xl" />
        </motion.div>

        {/* Cohort Badge Ring */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-[#A78BFA]" />
          <span className="text-xs font-bold tracking-wider uppercase text-white/90">
            Founding Ambassador #
            <AnimatedNumber value={Number(cohortNumber)} />
          </span>
        </div>

        {/* Headline Word-by-Word Reveal */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Welcome to Zyvex,{" "}
            <span className="brand-gradient-text">{userName}</span>
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed">
            You are officially inducted into the Founding Ambassador Cohort. Your campus journey begins now!
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 w-full max-w-xs">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className={`w-full font-extrabold shadow-soft-lg gap-2 text-base transition-opacity duration-300 ${
              canSkip ? "opacity-100" : "opacity-90"
            }`}
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
