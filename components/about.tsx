"use client";

import { motion } from "framer-motion";
import { EASE, Letters, Lines, ParallaxImage, SectionHeader, useReady } from "./ui";
import { site } from "@/lib/data";

function DotList({ items }: { items: string[] }) {
  return (
    <motion.div
      className="ab_list"
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hide: {}, show: { transition: { staggerChildren: 0.05 } } }}
    >
      {items.map((it, i) => (
        <div key={it} className="ab_item">
          <p className="line">
            <motion.span
              variants={{ hide: { y: "105%" }, show: { y: 0, transition: { duration: 1, ease: EASE } } }}
            >
              {it}
            </motion.span>
          </p>
          {i < items.length - 1 && (
            <motion.i variants={{ hide: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }} />
          )}
        </div>
      ))}
    </motion.div>
  );
}

export default function About() {
  const ready = useReady();
  return (
    <>
      <section className="ab_hero">
        <motion.div
          className="ab_hero_img"
          initial={{ opacity: 0, scale: 0.85, y: 60 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
        >
          {/* plink = same scale-down / darken hover as the project images */}
          <div className="plink" data-h>
            <ParallaxImage src={site.aboutHeroImage} alt="Portrait of Akib Sayyad" sizes="93vw" priority />
          </div>
        </motion.div>
        <h2 className="ab_hero_title">
          <Letters text={site.name.split(" ")[0]} play={ready} delay={1.1} stagger={0.06} />
        </h2>
        <p className="ab_hero_desc">
          <Lines lines={site.aboutQuote} play={ready} delay={1.4} />
        </p>
      </section>

      <section className="ab_sec ab_bio_sec">
        <SectionHeader nbr="01/" total="/03" />
        <div className="ab_row">
          <h3 className="ab_label">About me</h3>
          <p className="ab_bio">
            <Lines lines={site.bio} />
          </p>
        </div>
      </section>

      <section className="ab_sec">
        <SectionHeader nbr="02/" total="/03" />
        <div className="ab_row">
          <h3 className="ab_label">
            Brands I&apos;ve
            <br />
            worked with
          </h3>
          <DotList items={site.brands} />
        </div>
      </section>

      <section className="ab_sec">
        <SectionHeader nbr="03/" total="/03" />
        <div className="ab_row">
          <h3 className="ab_label">Skills</h3>
          <DotList items={site.skills} />
        </div>
      </section>
    </>
  );
}
