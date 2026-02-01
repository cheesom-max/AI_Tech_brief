import Parser from 'rss-parser';
import { RSS_SOURCES } from './sources';
import type { FeedItem } from '@/types';

// Create parser instance lazily to support mocking
let parserInstance: Parser | null = null;

function getParser(): Parser {
  if (!parserInstance) {
    parserInstance = new Parser();
  }
  return parserInstance;
}

// For testing purposes
export function resetParser(): void {
  parserInstance = null;
}

export async function fetchFeed(url: string, sourceId: string): Promise<FeedItem[]> {
  try {
    const parser = getParser();
    const feed = await parser.parseURL(url);

    return feed.items.map((item) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      content: item.content || item.contentSnippet || '',
      source: sourceId,
    }));
  } catch (error) {
    console.error(`Error fetching feed from ${url}:`, error);
    return [];
  }
}

export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const results = await Promise.all(
    RSS_SOURCES.map((source) => fetchFeed(source.url, source.id))
  );

  const allItems = results.flat();
  return deduplicateByUrl(allItems);
}

export function deduplicateByUrl(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.link)) {
      return false;
    }
    seen.add(item.link);
    return true;
  });
}
