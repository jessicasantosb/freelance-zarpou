'use client'

import { Easing, Variants } from "motion/react";

export type FadeInVariantsType = {
  duration?: number;
  delay?: number;
  ease?: Easing;
};

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translateY(100%)",
  },
  visible: () => ({
    opacity: 1,
    transform: "translateY(0)",
    transition: { duration: 0.8, delay: 0.5, ease: 'easeIn' },
  }),
};

export const accordionVariants: Variants = {
  hidden: {
    opacity: 0,
    x: "-100%",
  },
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: (custom + 1) / 5,
      duration: 0.5,
    },
  }),
};