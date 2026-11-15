import type { Metadata } from "next";
import ProjectsSlider from "@/components/projects-slider";

export const metadata: Metadata = { title: "Projects — Aakib Sayyad" };

export default function Projects() {
  return <ProjectsSlider />;
}
