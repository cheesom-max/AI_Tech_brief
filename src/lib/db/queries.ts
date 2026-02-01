import { getDbClient } from './client';
import type { News, NewsWithDetail, Briefing, NewsInput, BriefingInput } from '@/types';

const SOURCE_NAMES: Record<string, string> = {
  openai: 'OpenAI Blog',
  deepmind: 'Google DeepMind',
  anthropic: 'Anthropic',
  huggingface: 'Hugging Face',
  techcrunch: 'TechCrunch',
  verge: 'The Verge',
  venturebeat: 'VentureBeat',
  mit: 'MIT Tech Review',
};

export function getSourceName(sourceId: string): string {
  return SOURCE_NAMES[sourceId] || sourceId;
}

export async function getNewsByDate(
  date?: string,
  source?: string,
  limit: number = 20,
  offset: number = 0
): Promise<News[]> {
  const client = getDbClient();

  let query = client
    .from('news')
    .select('id, title, source, thumbnail_url, summary, published_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Only filter by date if provided
  if (date) {
    query = query
      .gte('published_at', `${date}T00:00:00`)
      .lt('published_at', `${date}T23:59:59`);
  }

  if (source) {
    query = query.eq('source', source);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    source: row.source as string,
    sourceName: getSourceName(row.source as string),
    publishedAt: row.published_at as string,
    thumbnailUrl: row.thumbnail_url as string | null,
    summary: typeof row.summary === 'string' ? JSON.parse(row.summary) : (row.summary || []),
  }));
}

export async function getNewsById(id: string): Promise<NewsWithDetail | null> {
  const client = getDbClient();

  const { data, error } = await client
    .from('news')
    .select('id, title, source, original_url, thumbnail_url, content, summary, insight, published_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching news by id:', error);
    return null;
  }

  return {
    id: data.id as string,
    title: data.title as string,
    source: data.source as string,
    sourceName: getSourceName(data.source as string),
    publishedAt: data.published_at as string,
    thumbnailUrl: data.thumbnail_url as string | null,
    summary: typeof data.summary === 'string' ? JSON.parse(data.summary) : (data.summary || []),
    originalUrl: data.original_url as string,
    content: data.content as string,
    insight: data.insight as string,
  };
}

export async function getBriefings(limit: number = 10, offset: number = 0): Promise<Briefing[]> {
  const client = getDbClient();

  const { data, error } = await client
    .from('briefings')
    .select(`
      id,
      date,
      news_count,
      top_news_id,
      news:top_news_id (title)
    `)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching briefings:', error);
    return [];
  }

  return (data || []).map((row) => {
    // Supabase returns joined data as an object or null
    const newsData = row.news as { title: string } | { title: string }[] | null;
    const title = Array.isArray(newsData)
      ? newsData[0]?.title || ''
      : newsData?.title || '';

    return {
      id: row.id as string,
      date: row.date as string,
      newsCount: row.news_count as number,
      topNews: {
        id: row.top_news_id as string,
        title,
      },
    };
  });
}

export async function saveNews(news: NewsInput): Promise<void> {
  const client = getDbClient();

  const { error } = await client.from('news').upsert({
    id: news.id,
    title: news.title,
    source: news.source,
    original_url: news.originalUrl,
    thumbnail_url: news.thumbnailUrl,
    content: news.content,
    summary: news.summary,
    insight: news.insight,
    published_at: news.publishedAt,
  });

  if (error) {
    console.error('Error saving news:', error);
    throw error;
  }
}

export async function saveBriefing(briefing: BriefingInput): Promise<void> {
  const client = getDbClient();

  const { error } = await client.from('briefings').upsert({
    id: briefing.id,
    date: briefing.date,
    news_count: briefing.newsCount,
    top_news_id: briefing.topNewsId,
  });

  if (error) {
    console.error('Error saving briefing:', error);
    throw error;
  }
}

export async function getTotalNewsCount(date?: string, source?: string): Promise<number> {
  const client = getDbClient();

  let query = client
    .from('news')
    .select('*', { count: 'exact', head: true });

  if (date) {
    query = query
      .gte('published_at', `${date}T00:00:00`)
      .lt('published_at', `${date}T23:59:59`);
  }

  if (source) {
    query = query.eq('source', source);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error getting news count:', error);
    return 0;
  }

  return count || 0;
}

export async function getTotalBriefingsCount(): Promise<number> {
  const client = getDbClient();

  const { count, error } = await client
    .from('briefings')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting briefings count:', error);
    return 0;
  }

  return count || 0;
}

export async function checkNewsExists(originalUrl: string): Promise<boolean> {
  const client = getDbClient();

  const { data, error } = await client
    .from('news')
    .select('id')
    .eq('original_url', originalUrl)
    .limit(1);

  if (error) {
    console.error('Error checking news exists:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}
