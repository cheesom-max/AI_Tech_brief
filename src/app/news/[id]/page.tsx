import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNewsById } from '@/lib/db/queries';
import NewsDetail from '@/components/news/NewsDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    return {
      title: 'News Not Found | AI Tech Brief',
    };
  }

  const description = news.summary?.[0] || `${news.title} - AI Tech Brief`;

  return {
    title: `${news.title} | AI Tech Brief`,
    description,
    openGraph: {
      title: news.title,
      description,
      type: 'article',
      publishedTime: news.publishedAt,
      siteName: 'AI Tech Brief',
      images: news.thumbnailUrl ? [{ url: news.thumbnailUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description,
      images: news.thumbnailUrl ? [news.thumbnailUrl] : [],
    },
  };
}

// Server Component - data fetched at request time
export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    notFound();
  }

  return <NewsDetail news={news} />;
}
