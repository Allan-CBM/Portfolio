"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
};

export function Reveal({ children, delay = 0, y = 40, once = true, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger } }),
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

type StaggerProps = HTMLMotionProps<"div"> & { children: ReactNode; stagger?: number };

export function Stagger({ children, stagger = 0.08, ...props }: StaggerProps) {
  return (
    <motion.div
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div"> & { children: ReactNode }) {
  return (
    <motion.div variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}

type StaggerListProps = HTMLMotionProps<"ul"> & { children: ReactNode; stagger?: number; ordered?: boolean };

/** Semantic list version of <Stagger> (renders <ul>/<ol> with <StaggerListItem> children). */
export function StaggerList({ children, stagger = 0.08, ordered = false, ...props }: StaggerListProps) {
  const Component = ordered ? motion.ol : motion.ul;
  return (
    <Component
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      {...(props as HTMLMotionProps<"ol">)}
    >
      {children}
    </Component>
  );
}

export function StaggerListItem({ children, ...props }: HTMLMotionProps<"li"> & { children: ReactNode }) {
  return (
    <motion.li variants={staggerItem} {...props}>
      {children}
    </motion.li>
  );
}
