"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE, Letters, Pill, ReadyCtx, useReady } from "./ui";
import { site } from "@/lib/data";

/** Root shell: heavy smooth scroll + preloader + header + cursor + grain. */
export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <ReactLenis root options={{ lerp: 0.07, wheelMultiplier: 0.9, smoothWheel: true }}>
      <MotionConfig reducedMotion="user">
        <ReadyCtx.Provider value={ready}>
          <div className="bg" aria-hidden />
          <Progress />
          <ScrollReset />
          <Header />
          {children}
          <Cursor />
          <Preloader onDone={() => setReady(true)} />
        </ReadyCtx.Provider>
      </MotionConfig>
    </ReactLenis>
  );
}

/** Hairline along the top edge that fills as the page is scrolled. */
function Progress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden />;
}

function ScrollReset() {
  const lenis = useLenis();
  const pathname = usePathname();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}

function Header() {
  const ready = useReady();
  const pathname = usePathname();
  const tag = "Available for freelance — ";
  // phone menu: locks scrolling while open, closes when a link is tapped
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const toggle = (next: boolean) => {
    setOpen(next);
    if (next) lenis?.stop();
    else lenis?.start();
  };
  return (
    <>
    <motion.header
      className="header"
      initial={{ y: "-100%" }}
      animate={{ y: ready ? 0 : "-100%" }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
    >
      <h1 className="header_logo">
        <Link href="/" data-h>
          {site.name}
        </Link>
      </h1>
      <nav className="nav">
        <Pill href="/projects" active={pathname === "/projects"}>
          Projects
        </Pill>
        <Pill href="/about" active={pathname === "/about"}>
          About
        </Pill>
      </nav>
      <a
        className="header_marquee"
        href={site.behance}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Available for freelance — contact on Behance"
        data-h
      >
        <span className="cta" />
        <span className="header_marquee_track" aria-hidden>
          <span>{tag}</span>
          <span>{tag}</span>
        </span>
      </a>
      <button
        type="button"
        className={`burger ${open ? "open" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => toggle(!open)}
      >
        <span />
        <span />
      </button>
    </motion.header>
    <AnimatePresence>
      {open && (
        <motion.div
          className="menu"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav>
            {[
              ["/", "Home"],
              ["/projects", "Projects"],
              ["/about", "About"],
            ].map(([href, label], i) => (
              <Link key={href} href={href} className={pathname === href ? "on" : ""} onClick={() => toggle(false)}>
                <Letters text={label} play delay={0.4 + i * 0.1} />
              </Link>
            ))}
          </nav>
          <a className="menu_marquee" href={site.behance} target="_blank" rel="noopener noreferrer">
            <span className="header_marquee_track" aria-hidden>
              <span>{tag.repeat(3)}</span>
              <span>{tag.repeat(3)}</span>
            </span>
          </a>
          <motion.div
            className="menu_foot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <span>Pune, India</span>
            {site.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

/** Four-tick crosshair that trails the pointer and opens up over links. */
function Cursor() {
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.6 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40, mass: 0.6 });
  const [hover, setHover] = useState(false);
  // elements with data-cursor="View" turn the cursor into a labelled disc
  const [label, setLabel] = useState("");
  const [labelOn, setLabelOn] = useState(false);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element;
      setHover(!!t.closest?.("[data-h]"));
      const text = t.closest?.<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (text) setLabel(text);
      setLabelOn(!!text);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  return (
    <>
      <motion.div className="cursor" style={{ x, y }} aria-hidden>
        <motion.div
          className="cursor_ticks"
          animate={{ rotate: hover ? 45 : 0, scale: labelOn ? 0 : hover ? 2.2 : 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <i />
          <i />
          <i />
          <i />
        </motion.div>
      </motion.div>
      <motion.div className="cursor cursor_label" style={{ x, y }} aria-hidden>
        <motion.span animate={{ scale: labelOn ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
          {label}
        </motion.span>
      </motion.div>
    </>
  );
}

/** White curtain: name rises in, counter runs 000→100%, everything lifts away. */
function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const count = useMotionValue(0);
  const pct = useTransform(count, (v) => `${String(Math.round(v)).padStart(3, "0")}%`);

  useEffect(() => {
    const a = animate(count, 100, {
      duration: 2.4,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        setPhase("out");
        onDone();
      },
    });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;
  const [first, last] = site.name.toUpperCase().split(" ");
  const word = (w: string, offset: number) =>
    [...w].map((c, i) => (
      <motion.span
        key={i}
        initial={{ y: "105%" }}
        animate={{ y: phase === "in" ? 0 : "-105%" }}
        transition={{ duration: 0.9, ease: EASE, delay: (phase === "in" ? 0.15 : 0) + (i + offset) * 0.04 }}
      >
        {c}
      </motion.span>
    ));
  return (
    <motion.div
      className="preloader"
      animate={{ y: phase === "out" ? "-100%" : 0 }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.45 }}
      onAnimationComplete={() => phase === "out" && setPhase("gone")}
    >
      <div className="preloader_word preloader_first">{word(first, 0)}</div>
      <div className="preloader_word preloader_last">{word(`${last}.`, first.length)}</div>
      <p className="preloader_count">
        <motion.span>{pct}</motion.span>
      </p>
    </motion.div>
  );
}
