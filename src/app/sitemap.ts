import { MetadataRoute } from 'next';
import { getDbClient } from '@/lib/db/client';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-tech-brief.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all news IDs for dynamic routes
  const client = getDbClient();
  const { data: newsData } = await client
    .from('news')
    .select('id, published_at')
    .order('published_at', { ascending: false })
    .limit(1000); // Limit to most recent 1000 articles

  const newsEntries: MetadataRoute.Sitemap = (newsData || []).map((news) => ({
    url: `${BASE_URL}/news/${news.id}`,
    lastModified: new Date(news.published_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Fetch unique dates for archive pages
  const { data: briefingsData } = await client
    .from('briefings')
    .select('date')
    .order('date', { ascending: false })
    .limit(100);

  const archiveEntries: MetadataRoute.Sitemap = (briefingsData || []).map((briefing) => ({
    url: `${BASE_URL}/archive?date=${briefing.date}`,
    lastModified: new Date(briefing.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...newsEntries,
    ...archiveEntries,
  ];
}
