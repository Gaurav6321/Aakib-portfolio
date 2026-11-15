"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
  type Variants,
} from "framer-motion";
import { site } from "@/lib/data";

export const EASE = [0.16, 1, 0.3, 1] as const;

// true once the preloader has finished; gates above-the-fold animations
export const ReadyCtx = createContext(false);
export const useReady = () => useContext(ReadyCtx);

const rise: Variants = {
  hide: { y: "105%" },
  show: { y: 0, transition: { duration: 1.1, ease: EASE } },
};
const group = (stagger: number, delay: number): Variants => ({
  hide: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// `play` undefined = animate when scrolled into view; boolean = controlled.
// The trigger lives on the parent because the children start clipped
// (overflow hidden) and would never intersect the viewport themselves.
const trigger = (play?: boolean) =>
  play === undefined
    ? { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
    : { animate: play ? "show" : "hide" };

/** Letter-by-letter slide-up for oversized headings. */
export function Letters({
  text,
  className = "",
  play,
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  play?: boolean;
  delay?: number;
  stagger?: number;
}) {
  return (
    <motion.span
      className={`letters ${className}`}
      aria-label={text}
      initial="hide"
      variants={group(stagger, delay)}
      {...trigger(play)}
    >
      {[...text].map((c, i) => (
        <motion.span key={i} aria-hidden variants={rise}>
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** Line-by-line masked slide-up for copy. */
export function Lines({
  lines,
  className = "",
  play,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  play?: boolean;
  delay?: number;
}) {
  return (
    <motion.span
      className={`lines ${className}`}
      initial="hide"
      variants={group(0.08, delay)}
      {...trigger(play)}
    >
      {lines.map((l, i) => (
        <span key={i} className="line">
          <motion.span variants={rise}>{l || " "}</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Nav / footer pill: white disc rises from below, label swaps to black. */
export function Pill({
  href,
  children,
  active,
  external,
}: {
  href: string;
  children: string;
  active?: boolean;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="cta" />
      <span className="t">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
    </>
  );
  const cls = `pill ${active ? "active" : ""}`;
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer" data-h>
      {inner}
    </a>
  ) : (
    <Link className={cls} href={href} data-h>
      {inner}
    </Link>
  );
}

/** 10rem outlined circle: stroke draws in, magnetic pull, fills white on hover. */
export function CircleButton({
  href,
  external,
  onClick,
  children,
  label,
}: {
  href?: string;
  external?: boolean;
  onClick?: () => void;
  children: ReactNode;
  label?: string;
}) {
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  const body = (
    <motion.span
      className="circle_btn"
      style={{ x, y }}
      data-h
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <svg viewBox="0 0 100 100" aria-hidden>
        <motion.circle
          cx="50"
          cy="50"
          r="49.5"
          fill="none"
          stroke="#fff"
          strokeWidth="0.6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <span className="circle_fill" />
      <span className="circle_label">{children}</span>
    </motion.span>
  );
  if (href && external)
    return (
      <a className="circle_wrap" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {body}
      </a>
    );
  if (href)
    return (
      <Link className="circle_wrap" href={href} aria-label={label}>
        {body}
      </Link>
    );
  return (
    <button className="circle_wrap" type="button" onClick={onClick} aria-label={label}>
      {body}
    </button>
  );
}

/** Endless giant text; speeds up with, and reverses on, scroll direction. */
export function Marquee({ text }: { text: string }) {
  const pos = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const dir = useRef(-1);
  useAnimationFrame((_, dt) => {
    const v = vel.get();
    if (v > 0) dir.current = -1;
    else if (v < 0) dir.current = 1;
    const step = dir.current * (0.0025 + Math.abs(v) * 0.000012) * Math.min(dt, 50);
    pos.set(wrap(-33.3333, 0, pos.get() + step));
  });
  const x = useTransform(pos, (v) => `${v}%`);
  return (
    <div className="marquee" aria-hidden>
      <motion.div className="marquee_track" style={{ x }}>
        {[0, 1, 2].map((i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}

/** Image that drifts slower than its frame while scrolling. */
export function ParallaxImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} className="pimg">
      <motion.div className="pimg_inner" style={{ y }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={95} />
      </motion.div>
      <div className="img_overlay" />
    </div>
  );
}

/** Hairline + "02/  label  …  /04" row that opens every section. */
export function SectionHeader({
  nbr,
  label,
  total,
  links,
}: {
  nbr: string;
  label?: string;
  total: string;
  links?: { label: string; href: string }[];
}) {
  return (
    <>
      <motion.div
        className="sec_line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <div className="sec_header">
        <Lines lines={[nbr]} />
        {label && <Lines className="sec_label" lines={[label]} delay={0.1} />}
        {links && (
          <nav className="sec_nav">
            {links.map((l, i) => (
              <a key={l.href} className="swap" href={l.href} target="_blank" rel="noopener noreferrer" data-h>
                <span className="t">
                  <span>{l.label}</span>
                  <span aria-hidden>{l.label}</span>
                </span>
                {i < links.length - 1 && <i>/</i>}
              </a>
            ))}
          </nav>
        )}
        <Lines className="sec_total" lines={[total]} delay={0.2} />
      </div>
    </>
  );
}

export function Contact() {
  return (
    <section className="contact">
      <motion.div
        className="contact_bg"
        initial={{ scale: 0.86, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <div className="contact_text">
        <p className="contact_mail">
          <Lines lines={["Got a project in mind?"]} />
        </p>
        <h2 className="contact_connect">
          {["Let's", "Connect"].map((w, i) => (
            <span key={w} className="roll">
              <Letters text={w} delay={0.15 + i * 0.15} />
              <span className="roll_2" aria-hidden>
                {[...w].map((c, j) => (
                  <span key={j} style={{ transitionDelay: `${j * 25}ms`, animationDelay: `${j * 25}ms` }}>
                    {c}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h2>
        <div className="contact_circle">
          <CircleButton href={site.behance} external label="Write a message on Behance">
            <span>Write a</span>
            <span className="ind">Message</span>
          </CircleButton>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: EASE }}
    >
      <p>Feel free to connect with me on social</p>
      <nav>
        {site.socials.map((s) => (
          <Pill key={s.href} href={s.href} external>
            {s.label}
          </Pill>
        ))}
      </nav>
    </motion.footer>
  );
}
