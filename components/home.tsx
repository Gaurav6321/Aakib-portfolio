"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CircleButton, EASE, Letters, Lines, Marquee, ParallaxImage, ScrollWords, SectionHeader, useReady } from "./ui";
import { featured, fmtDate, projects, site, type Project } from "@/lib/data";

/** Moving the mouse across the hero leaves a trail of project covers that pop in and fade. */
function HeroTrail() {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...el.children] as HTMLElement[];
    let last = { x: 0, y: 0 };
    let n = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - last.x;
      if (e.clientY < r.top || e.clientY > r.bottom || Math.hypot(dx, e.clientY - last.y) < 120) return;
      last = { x: e.clientX, y: e.clientY };
      const it = items[n % items.length];
      it.style.left = `${e.clientX - r.left}px`;
      it.style.top = `${e.clientY - r.top}px`;
      it.style.zIndex = String(++n);
      const c = "translate(-50%, -50%)";
      it.animate(
        [
          { opacity: 1, transform: `${c} scale(0.35) rotate(${dx > 0 ? -8 : 8}deg)` },
          { opacity: 1, transform: `${c} scale(1) rotate(0deg)`, offset: 0.25 },
          { opacity: 1, transform: `${c} scale(1) rotate(0deg)`, offset: 0.65 },
          { opacity: 0, transform: `translate(-50%, -30%) scale(0.8) rotate(0deg)` },
        ],
        { duration: 1200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
      );
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={box} className="hero_trail" aria-hidden>
      {projects.slice(0, 8).map((p) => (
        <div key={p.id}>
          <Image src={p.image} alt="" fill sizes="(max-width: 768px) 1px, 14vw" quality={95} />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const ready = useReady();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, -160]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0]);

  // the arrow turns to point at the cursor when it comes near, and back down when it leaves
  const btn = useRef<HTMLDivElement>(null);
  const rotate = useSpring(0, { stiffness: 140, damping: 14 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = btn.current?.getBoundingClientRect();
      if (!r || e.pointerType !== "mouse") return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < r.width * 2.5;
      const target = near ? (Math.atan2(dy, dx) * 180) / Math.PI - 90 : 0;
      const cur = rotate.get();
      rotate.set(cur + ((((target - cur) % 360) + 540) % 360) - 180); // shortest way round
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [rotate]);

  return (
    <section className="hero">
      <HeroTrail />
      <motion.p
        className="hero_scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.6 }}
      >
        01 // 04 <i /> Scroll <ArrowDown />
      </motion.p>
      <div className="hero_center">
        <motion.div style={{ y, opacity }}>
          <h2 className="hero_title">
            <Letters className="hero_l1" text="MULTI-" play={ready} delay={0.7} />
            <Letters className="hero_l2" text="DISCIPLINARY" play={ready} delay={0.82} />
            <span className="hero_l3">
              <Letters text="ARTIST" play={ready} delay={0.94} />
              <Lines className="hero_desc" lines={site.heroDescription} play={ready} delay={1.5} />
            </span>
          </h2>
          <motion.div
            ref={btn}
            className="hero_btn"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={ready ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 1.5 }}
          >
            <CircleButton onClick={() => lenis?.scrollTo("#about")} label="Scroll to about">
              <motion.span style={{ rotate, display: "flex" }}>
                <ArrowDown className="arrow" />
              </motion.span>
            </CircleButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function HomeAbout() {
  return (
    <section id="about" className="h_about">
      <SectionHeader nbr="02/" label="about" total="/04" links={site.socials} />
      <div className="h_about_row">
        <p className="h_about_desc">
          <Lines lines={site.homeAbout} />
        </p>
        <motion.div
          className="h_about_img"
          initial={{ clipPath: "inset(100% 0% 0% 0%)", y: 80 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <Link href="/about" className="plink" aria-label="About Aakib" data-h>
            <ParallaxImage src={site.homeAboutImage} alt="Portrait of Aakib Sayyad" sizes="(max-width: 768px) 90vw, 40vw" />
          </Link>
        </motion.div>
        <div className="h_about_btn">
          <CircleButton href="/about">
            <span>Learn</span>
            <span className="ind">More</span>
          </CircleButton>
        </div>
      </div>
      <div className="h_about_marquee">
        <Marquee text={`${site.name} - `} />
      </div>
    </section>
  );
}

function FeaturedCard({
  p,
  i,
  onHover,
}: {
  p: Project;
  i: number;
  onHover: (p: Project | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // each column travels at its own speed
  const y = useTransform(scrollYProgress, [0, 1], [`${4 + i * 5}rem`, `${-4 - i * 5}rem`]);
  return (
    <motion.div ref={ref} className="feat_card" style={{ y }}>
      <motion.div
        initial={{ clipPath: "inset(100% 0% 0% 0%)", y: 120 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.4, ease: EASE, delay: i * 0.12 }}
      >
        <a
          className="plink feat_img"
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          data-h
          onMouseEnter={() => onHover(p)}
          onMouseLeave={() => onHover(null)}
        >
          <ParallaxImage src={p.image} alt={p.title} sizes="(max-width: 768px) 90vw, 32vw" />
        </a>
        <p className="feat_card_title" aria-hidden>
          <Letters text={p.short} stagger={0.025} delay={0.3} />
        </p>
        <div className="feat_text">
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
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Featured() {
  const [hovered, setHovered] = useState<Project | null>(null);
  return (
    <section className={`featured ${hovered ? "is-hover" : ""}`}>
      <SectionHeader nbr="03/" label="projects" total="/04" />
      <div className="feat_btn">
        <CircleButton href="/projects">
          <span>View All</span>
          <span className="ind">Projects</span>
        </CircleButton>
      </div>
      <ScrollWords
        className="feat_intro"
        text="Here are some select projects that showcase my passion for bringing memorable campaigns, artworks, and brands to life."
      />
      <div className="feat_row">
        {featured.map((p, i) => (
          <FeaturedCard key={p.id} p={p} i={i} onHover={setHovered} />
        ))}
        <div className="feat_title" aria-hidden>
          <AnimatePresence mode="wait">
            {hovered && (
              <motion.div key={hovered.id} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <p className="feat_title_nbr">Featured Project</p>
                <p className="feat_title_big">
                  <Letters text={hovered.short} play stagger={0.02} />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ponytail: framer-motion drag with momentum instead of a physics engine —
// pills don't collide with each other. Swap in matter-js if that matters.
// [left %, top %, rotation deg, phone left %, phone top %]
const SPOTS = [
  [6, 14, -12, 2, 3],
  [27, 5, 7, 40, 12],
  [50, 13, -5, 6, 22],
  [68, 24, 12, 44, 32],
  [8, 62, 9, 4, 62],
  [31, 74, -8, 52, 71],
  [54, 66, 5, 10, 81],
  [70, 56, -12, 46, 90],
];

export function Capabilities() {
  const area = useRef<HTMLDivElement>(null);
  // 0 = pills piled in the centre, 1 = fully scattered. Driven by scroll through a
  // springy follower so they burst outwards (and gather again when scrolling back).
  const { scrollYProgress } = useScroll({ target: area, offset: ["start 90%", "start 20%"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 11, mass: 0.9 });
  return (
    <section className="caps">
      <SectionHeader nbr="04/" label="capabilities" total="/04" />
      <motion.div className="caps_area" ref={area} style={{ "--p": p } as unknown as React.CSSProperties}>
        {/* decorative bubbles drifting up behind the pills */}
        {Array.from({ length: 12 }, (_, i) => (
          <i
            key={i}
            className="bubble"
            style={
              {
                "--x": (i * 37 + 5) % 96,
                "--s": 1.2 + ((i * 7) % 5) * 0.9,
                "--dur": `${9 + ((i * 5) % 7)}s`,
                "--delay": `${-i * 1.7}s`,
              } as React.CSSProperties
            }
          />
        ))}
        {site.capabilities.map((c, i) => {
          const [left, top, rotate, mLeft, mTop] = SPOTS[i % SPOTS.length];
          return (
            // position + scroll scatter live in CSS (see .caps_pos), drag and float sit inside
            <div
              key={c}
              className="caps_pos"
              style={
                { "--l": left, "--t": top, "--lm": mLeft, "--tm": mTop, "--r": rotate, "--d": i * 0.04 } as React.CSSProperties
              }
            >
              <motion.div
                className="caps_drag"
                data-cursor="Drag"
                drag
                dragConstraints={area}
                dragElastic={0.25}
                dragTransition={{ bounceStiffness: 180, bounceDamping: 14, power: 0.35 }}
                whileDrag={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                data-h
              >
                <span
                  className="caps_pill"
                  style={{ animationDuration: `${4 + (i % 4) * 0.7}s`, animationDelay: `${-i * 0.9}s` }}
                >
                  {c}
                </span>
              </motion.div>
            </div>
          );
        })}
        <div className="caps_headline">
          <Lines className="caps_eyebrow" lines={["Click & Drag"]} />
          <Lines lines={["Project types I", "specialize in"]} delay={0.1} />
        </div>
      </motion.div>
    </section>
  );
}
