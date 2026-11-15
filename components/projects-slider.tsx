"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { EASE, useReady } from "./ui";
import { fmtDate, projects } from "@/lib/data";

const STEP = 0.7; // viewport heights of scroll per project
const pad = (n: number) => String(n).padStart(2, "0");
const titleSize = (s: string) => (s.length <= 9 ? "16rem" : s.length <= 14 ? "11rem" : "8rem");

/** Fullscreen pinned slider: scrolling moves the image stack, title rolls over. */
export default function ProjectsSlider() {
  const n = projects.length;
  const ready = useReady();
  const lenis = useLenis();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const pos = useTransform(scrollYProgress, (v) => v * (n - 1));
  const y = useTransform(pos, (v) => `calc(${-v} * var(--step))`);
  const skewY = useSpring(useTransform(useVelocity(pos), [-6, 6], [-5, 5], { clamp: true }), {
    stiffness: 120,
    damping: 20,
  });

  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const snap = useRef<ReturnType<typeof setTimeout>>(undefined);
  const go = (i: number) =>
    lenis?.scrollTo((ref.current?.offsetTop ?? 0) + i * STEP * window.innerHeight, { duration: 1.4 });

  useMotionValueEvent(pos, "change", (v) => {
    const i = Math.round(v);
    if (i !== active) {
      setDir(i > active ? 1 : -1);
      setActive(i);
    }
    // settle on the nearest project once scrolling goes quiet
    clearTimeout(snap.current);
    snap.current = setTimeout(() => Math.abs(v - i) > 0.01 && go(i), 220);
  });
  useEffect(() => () => clearTimeout(snap.current), []);

  const p = projects[active];
  return (
    <div ref={ref} className="pj" style={{ height: `calc(${(n - 1) * STEP * 100}vh + 100vh)` }}>
      <div className="pj_sticky">
        <motion.div
          className="pj_stage"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
        >
          <motion.div className="pj_track" style={{ y, skewY }}>
            {projects.map((pr, i) => (
              <a
                key={pr.id}
                className="plink pj_img"
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${pr.title} on Behance`}
                tabIndex={i === active ? 0 : -1}
                data-h
                data-cursor="View"
              >
                <div className="pimg">
                  <div className="pimg_inner">
                    <Image
                      src={pr.image}
                      alt={pr.title}
                      fill
                      quality={95}
                      sizes="(max-width: 768px) 90vw, 86vw"
                      priority={i === 0}
                    />
                  </div>
                  <div className="img_overlay" />
                </div>
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="pj_ui"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="pj_count">00.{pad(active + 1)}</p>
          <div className="pj_underline" />

          <div className="pj_title" style={{ "--fs": titleSize(p.short) } as React.CSSProperties}>
            <AnimatePresence initial={false} custom={dir}>
              <motion.h2
                key={p.id}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ y: `${d * 105}%` }),
                  center: { y: 0 },
                  exit: (d: number) => ({ y: `${d * -105}%` }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.8, ease: EASE }}
              >
                {p.short}
              </motion.h2>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              className="pj_desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p>
                {p.title}
                <br />
                {p.kind}
              </p>
              <p>
                Art + Design
                <br />
                {fmtDate(p.published)}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="pj_bullets">
            {projects.map((pr, i) => (
              <button
                key={pr.id}
                type="button"
                className={i === active ? "on" : ""}
                onClick={() => go(i)}
                aria-label={`Go to ${pr.title}`}
                data-h
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
