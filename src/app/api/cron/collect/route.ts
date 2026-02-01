import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fetchAllFeeds } from '@/lib/rss/parser';
import { generateSummary, generateInsight, translateTitle } from '@/lib/ai/summarizer';
import { saveNews, saveBriefing, checkNewsExists } from '@/lib/db/queries';
import { initializeDatabase } from '@/lib/db/client';
import type { FeedItem } from '@/types';

// Maximum items to process per source per run
const MAX_ITEMS_PER_SOURCE = 10;

// Distribute items evenly across sources
function distributeItemsBySource(items: FeedItem[]): FeedItem[] {
  // Group items by source
  const bySource: Record<string, FeedItem[]> = {};
  for (const item of items) {
    if (!bySource[item.source]) {
      bySource[item.source] = [];
    }
    bySource[item.source].push(item);
  }

  // Sort each source by date (newest first)
  for (const source of Object.keys(bySource)) {
    bySource[source].sort((a, b) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    // Limit items per source
    bySource[source] = bySource[source].slice(0, MAX_ITEMS_PER_SOURCE);
  }

  // Interleave items from different sources (round-robin)
  const result: FeedItem[] = [];
  const sources = Object.keys(bySource);
  let hasMore = true;
  let index = 0;

  while (hasMore) {
    hasMore = false;
    for (const source of sources) {
      if (index < bySource[source].length) {
        result.push(bySource[source][index]);
        hasMore = true;
      }
    }
    index++;
  }

  return result;
}

export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production') {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    // Initialize database tables if needed
    await initializeDatabase();

    // Fetch all RSS feeds
    const feedItems = await fetchAllFeeds();
    console.log(`Fetched ${feedItems.length} items from RSS feeds`);

    // Distribute items evenly across sources
    const distributedItems = distributeItemsBySource(feedItems);
    console.log(`Processing ${distributedItems.length} items (max ${MAX_ITEMS_PER_SOURCE} per source)`);

    // Log items by source
    const sourceCount: Record<string, number> = {};
    for (const item of distributedItems) {
      sourceCount[item.source] = (sourceCount[item.source] || 0) + 1;
    }
    console.log('Items by source:', sourceCount);

    // Process each feed item
    let processedCount = 0;
    let skippedCount = 0;
    let firstNewsId: string | null = null;
    const processedBySource: Record<string, number> = {};

    for (const item of distributedItems) {
      // Check if news already exists
      const exists = await checkNewsExists(item.link);
      if (exists) {
        skippedCount++;
        continue;
      }

      // Generate AI translation, summary and insight
      const [translatedTitle, summary, insight] = await Promise.all([
        translateTitle(item.title),
        generateSummary(item.content),
        generateInsight(item.content),
      ]);

      const newsId = uuidv4();
      if (!firstNewsId) {
        firstNewsId = newsId;
      }

      // Save news to database
      await saveNews({
        id: newsId,
        title: translatedTitle,
        source: item.source,
        originalUrl: item.link,
        thumbnailUrl: null, // RSS feeds typically don't provide thumbnails
        content: item.content,
        summary,
        insight,
        publishedAt: item.pubDate,
      });

      processedCount++;
      processedBySource[item.source] = (processedBySource[item.source] || 0) + 1;
      console.log(`Processed: ${item.source} - ${item.title.substring(0, 50)}...`);
    }

    // Create today's briefing if we processed any news
    if (processedCount > 0 && firstNewsId) {
      const today = format(new Date(), 'yyyy-MM-dd');
      await saveBriefing({
        id: uuidv4(),
        date: today,
        newsCount: processedCount,
        topNewsId: firstNewsId,
      });
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      skipped: skippedCount,
      total: feedItems.length,
      bySource: processedBySource,
    });
  } catch (error) {
    console.error('Error in cron collect:', error);
    return NextResponse.json(
      { error: 'Failed to collect news' },
      { status: 500 }
    );
  }
}
