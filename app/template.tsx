"use client";

import { motion } from "framer-motion";

// Remounts on every route change: a white curtain lifts off the incoming page.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        className="wipe"
        aria-hidden
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      />
      <main>{children}</main>
    </>
  );
}
