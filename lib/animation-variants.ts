"use client";

import { Variants } from "motion/react";

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translateX(-100%)",
  },
  visible: () => ({
    opacity: 1,
    transform: "translateX(0)",
    transition: { duration: 0.8, delay: 0.5, ease: "easeIn" },
  }),
};

export const planeVariants: Variants = {
  hidden: {
    transform: "translateX(-100%)",
  },
  visible: () => ({
    transform: "translateX(0)",
    transition: { duration: 4, delay: 0.5, ease: "linear" },
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
