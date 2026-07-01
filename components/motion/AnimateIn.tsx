"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps, Variant } from "framer-motion";

export type AnimationPreset =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "zoom-reveal";

export interface AnimateInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  preset?: AnimationPreset;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const presets: Record<AnimationPreset, { hidden: Variant; visible: Variant }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  "zoom-reveal": {
    hidden: { opacity: 0, scale: 1.08 },
    visible: { opacity: 1, scale: 1 },
  },
};

export default function AnimateIn({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.85,
  threshold = 0.1,
  className,
  ...props
}: AnimateInProps) {
  const selectedPreset = presets[preset];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={{
        hidden: selectedPreset.hidden,
        visible: {
          ...selectedPreset.visible,
          transition: {
            duration,
            delay,
            ease: [0.16, 1, 0.3, 1], // Custom premium ease-out bezier curve
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
