'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import HeroNews from '@/components/home/HeroNews';
import CategoryFilter from '@/components/home/CategoryFilter';
import NewsList from '@/components/home/NewsList';
import type { News } from '@/types';

function HomeContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        // Only add date filter if explicitly provided in URL
        if (dateParam) {
          params.set('date', dateParam);
        }
        if (selectedSources.length > 0) {
          params.set('source', selectedSources[0]); // For now, single source filter
        }
        params.set('limit', '20');

        const response = await fetch(`/api/news?${params}`);
        const data = await response.json();
        setNews(data.news || []);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, [dateParam, selectedSources]);

  const heroNews = news[0];
  const restNews = news.slice(1);

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Today&apos;s Briefing
        </h2>
        <span className="text-sm text-text-secondary">{today}</span>
      </div>

      {/* Hero News */}
      {heroNews && !isLoading && <HeroNews news={heroNews} />}

      {/* Category Filter */}
      <CategoryFilter
        selected={selectedSources}
        onChange={setSelectedSources}
      />

      {/* News List */}
      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-4">
          Latest News
        </h3>
        <NewsList news={restNews} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
