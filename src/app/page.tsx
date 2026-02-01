import { Metadata } from 'next';
import { getNewsByDate } from '@/lib/db/queries';
import HomeContent from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'AI Tech Brief - Daily AI News Briefing',
  description: 'Get daily AI and tech news briefings with Gemini AI summaries. Stay updated with the latest from OpenAI, Google, Meta, and more.',
  openGraph: {
    title: 'AI Tech Brief - Daily AI News Briefing',
    description: 'Get daily AI and tech news briefings with Gemini AI summaries.',
    type: 'website',
    siteName: 'AI Tech Brief',
  },
};

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

// Server Component - initial data fetched at request time
export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dateParam = params.date || null;

  // Fetch initial news data server-side
  const initialNews = await getNewsByDate(
    dateParam || undefined,
    undefined,
    20,
    0
  );

  return <HomeContent initialNews={initialNews} dateParam={dateParam} />;
}
