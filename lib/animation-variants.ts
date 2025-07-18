"use client";

import { Variants } from "motion/react";

export const fromBottomVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translateY(30%)",
  },
  visible: () => ({
    opacity: 1,
     transform: "translateY(0)",
    transition: { duration: 0.5, delay: 0.2, ease: "easeIn" },
  }),
};

export const fromRightVariants: Variants = {
  hidden: {
    transform: "translateX(100%)",
  },
  visible: () => ({
    transform: "translateX(0)",
    transition: { duration: 0.6, delay: 0.5, ease: "linear" },
  }),
};

export const fadeInCardVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translateY(100%)",
  },
  visible: (custom) => ({
    opacity: 1,
    transform: "translateY(0)",
    transition: {
      delay: (custom + 1) / 5,
      duration: 0.5,
    },
  }),
};

export const fadeInTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    transform: "translateY(-30%)",
  },
  visible: () => ({
    opacity: 1,
    transform: "translateY(0)",
    transition: { duration: 0.5, delay: 0.2, ease: "easeIn" },
  }),
};

export const planeVariants: Variants = {
  hidden: {
    transform: "translateX(-100%)",
  },
  visible: () => ({
    transform: "translateX(0)",
    transition: { duration: 2, delay: 0.5, ease: "linear" },
  }),
};

export const listVariants: Variants = {
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
