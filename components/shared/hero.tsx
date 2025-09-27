"use client";

import { useInView } from "react-intersection-observer";
import * as motion from "motion/react-client";

import { fromBottomVariants } from "@/lib/animation-variants";
import { ReactNode } from "react";

export function Hero({children}: {children: ReactNode}) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-[100svh] overflow-hidden select-none"
    >
      <video
        src="/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover "
      />

      <div className="absolute top-0 left-0 w-full h-full bg-primary/50 z-10" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fromBottomVariants}
        className="relative z-20 max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 text-center text-white h-full px-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
