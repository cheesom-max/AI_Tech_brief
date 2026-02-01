'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import HeroNews from '@/components/home/HeroNews';
import CategoryFilter from '@/components/home/CategoryFilter';
import NewsList from '@/components/home/NewsList';
import type { News } from '@/types';

interface HomeContentProps {
  initialNews: News[];
  dateParam?: string | null;
}

export default function HomeContent({ initialNews, dateParam }: HomeContentProps) {
  const [news, setNews] = useState<News[]>(initialNews);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const today = format(new Date(), 'yyyy-MM-dd');

  // Fetch news when filter changes (client-side only for interactivity)
  const handleFilterChange = useCallback(async (sources: string[]) => {
    setSelectedSources(sources);
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (dateParam) {
        params.set('date', dateParam);
      }
      if (sources.length > 0) {
        params.set('source', sources[0]);
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
  }, [dateParam]);

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
        onChange={handleFilterChange}
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
