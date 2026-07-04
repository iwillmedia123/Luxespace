import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { generateBlogMetadata, generateBlogJsonLd } from "@/lib/seo";
import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blogs = await db.getBlogs();
  const post = blogs.find((b) => b.slug === slug);
  if (!post) return {};
  return generateBlogMetadata(post);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [blogsList, agentsList, propsList, commsList, devsList] = await Promise.all([
    db.getBlogs(),
    db.getAgents(),
    db.getProperties(),
    db.getCommunities(),
    db.getDevelopers(),
  ]);

  const post = blogsList.find((b) => b.slug === slug);
  if (!post) {
    notFound();
  }

  const author = agentsList.find((a) => a.id === post.authorId) || null;
  const publishedBlogs = blogsList.filter(b => b.status === "published" || b.isPublished);

  const relatedPropertiesData = post.relatedProperties
    ? propsList.filter((p) => post.relatedProperties!.includes(p.id))
    : [];

  const relatedCommunitiesData = post.relatedCommunities
    ? commsList.filter((c) => post.relatedCommunities!.includes(c.id))
    : [];

  const relatedDevelopersData = post.relatedDevelopers
    ? devsList.filter((d) => post.relatedDevelopers!.includes(d.id))
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogJsonLd(post)),
        }}
      />
      <BlogDetailClient
        post={post}
        author={author}
        allBlogs={publishedBlogs}
        relatedPropertiesData={relatedPropertiesData}
        relatedCommunitiesData={relatedCommunitiesData}
        relatedDevelopersData={relatedDevelopersData}
      />
    </>
  );
}
