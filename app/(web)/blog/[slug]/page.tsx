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
  const res = await db.getBlogsByFilters({ slug });
  const post = res.blogs[0];
  if (!post) return {};
  return generateBlogMetadata(post);
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const currentBlogRes = await db.getBlogsByFilters({ slug });
  const post = currentBlogRes.blogs[0];
  if (!post) {
    notFound();
  }

  const [agentsList, propsRes, commsList, devsList, blogsRes] = await Promise.all([
    db.getAgents({ id: post.authorId }),
    post.relatedProperties && post.relatedProperties.length > 0
      ? db.getPropertiesByFilters({ ids: post.relatedProperties, isSummary: true })
      : Promise.resolve({ properties: [], totalCount: 0 }),
    post.relatedCommunities && post.relatedCommunities.length > 0
      ? db.getCommunities({ ids: post.relatedCommunities })
      : Promise.resolve([]),
    post.relatedDevelopers && post.relatedDevelopers.length > 0
      ? db.getDevelopers({ ids: post.relatedDevelopers })
      : Promise.resolve([]),
    db.getBlogsByFilters({ status: "published", limit: 10, isSummary: true }),
  ]);

  const author = agentsList[0] || null;
  const publishedBlogs = blogsRes.blogs;
  const relatedPropertiesData = propsRes.properties;
  const relatedCommunitiesData = commsList;
  const relatedDevelopersData = devsList;

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
