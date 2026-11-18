import type { Metadata } from "next";
import { db } from "@/lib/db";
import ProjectsCatalogClient from "@/components/projects/ProjectsCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dubai Off-Plan Projects & Pre-Launches | Luxespace Properties",
  description:
    "Explore exclusive Dubai off-plan developments, master communities, and waterfront villas. Review structured pricing tables, payment plans, and download official brochures.",
  keywords: [
    "Dubai Off-Plan Projects",
    "Pre-Launch Villas Dubai",
    "Palm Springs Nakheel",
    "Palm Jebel Ali",
    "Dubai luxury real estate launches",
    "Off-plan payment plans",
    "Luxespace Projects",
  ],
  openGraph: {
    title: "Dubai Off-Plan Projects & Pre-Launches | Luxespace Properties",
    description:
      "Explore exclusive Dubai off-plan developments, master communities, and waterfront villas.",
    type: "website",
    url: "https://luxespace.ae/projects",
  },
};

export default async function ProjectsPage() {
  const projects = await db.getProjects();
  return <ProjectsCatalogClient initialProjects={projects} />;
}
