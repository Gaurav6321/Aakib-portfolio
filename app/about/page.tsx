import type { Metadata } from "next";
import About from "@/components/about";
import { Contact, Footer } from "@/components/ui";

export const metadata: Metadata = { title: "About — Aakib Sayyad" };

export default function AboutPage() {
  return (
    <>
      <About />
      <Contact />
      <Footer />
    </>
  );
}
