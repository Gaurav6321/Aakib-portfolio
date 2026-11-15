import type { Metadata } from "next";
import ProjectsSlider from "@/components/projects-slider";

export const metadata: Metadata = { title: "Projects — Akib Sayyad" };

export default function Projects() {
  return <ProjectsSlider />;
}
