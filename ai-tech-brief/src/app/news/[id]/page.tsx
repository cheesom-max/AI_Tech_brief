'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NewsDetail from '@/components/news/NewsDetail';
import type { NewsWithDetail } from '@/types';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsWithDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsDetail() {
      if (!params.id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/news/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('News not found');
          } else {
            setError('Failed to load news');
          }
          return;
        }
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news detail:', error);
        setError('Failed to load news');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNewsDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-text-secondary/20 rounded w-1/4" />
        <div className="h-8 bg-text-secondary/20 rounded w-3/4" />
        <div className="h-48 bg-text-secondary/20 rounded" />
        <div className="h-32 bg-text-secondary/20 rounded" />
        <div className="h-32 bg-text-secondary/20 rounded" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">
          error
        </span>
        <p className="text-text-secondary mb-4">{error || 'News not found'}</p>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return <NewsDetail news={news} />;
}
