import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://luxespace.ae';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/properties',
    '/buy',
    '/rent',
    '/developers',
    '/communities',
    '/agents',
    '/faqs',
    '/testimonials',
    '/awards',
    '/partners',
    '/downloads',
    '/lifestyle',
    '/blog',
    '/market-insights',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Routes
  try {
    const [properties, blogs, communities, developers, agents] = await Promise.all([
      db.getProperties(),
      db.getBlogs(),
      db.getCommunities(),
      db.getDevelopers(),
      db.getAgents(),
    ]);

    const propertyRoutes = properties.map((p) => ({
      url: `${baseUrl}/properties/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const blogRoutes = blogs.filter(b => b.status === 'published' || b.isPublished).map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(b.updatedAt || b.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const communityRoutes = communities.map((c) => ({
      url: `${baseUrl}/communities/${c.slug}`,
      lastModified: new Date(c.updatedAt || c.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const developerRoutes = developers.map((d) => ({
      url: `${baseUrl}/developers/${d.slug}`,
      lastModified: new Date(d.updatedAt || d.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const agentRoutes = agents.map((a) => ({
      url: `${baseUrl}/agents/${a.slug}`,
      lastModified: new Date(a.updatedAt || a.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [
      ...staticRoutes,
      ...propertyRoutes,
      ...blogRoutes,
      ...communityRoutes,
      ...developerRoutes,
      ...agentRoutes,
    ];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticRoutes;
  }
}
