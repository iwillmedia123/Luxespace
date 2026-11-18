import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { 
  generateProjectMetadata, 
  generateProjectJsonLd, 
  generateBreadcrumbJsonLd, 
  generateFAQJsonLd 
} from "@/lib/seo";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await db.getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found | Luxespace Properties" };
  return generateProjectMetadata(project);
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await db.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Fetch assigned agent and related projects
  const [agentsList, allProjects] = await Promise.all([
    project.assignedAgentId 
      ? db.getAgents({ id: project.assignedAgentId }) 
      : db.getAgents(),
    db.getProjects(),
  ]);

  const assignedAgent = agentsList[0] || null;
  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  // Structured Data Schemas
  const projectSchema = generateProjectJsonLd(project);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: "Home", url: "https://luxespace.ae" },
    { name: "Projects", url: "https://luxespace.ae/projects" },
    { name: project.title, url: `https://luxespace.ae/projects/${project.slug}` },
  ]);
  const faqSchema = project.faqs && project.faqs.length > 0
    ? generateFAQJsonLd(project.faqs)
    : null;

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Main Client Presentation */}
      <ProjectDetailClient
        project={project}
        assignedAgent={assignedAgent}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
