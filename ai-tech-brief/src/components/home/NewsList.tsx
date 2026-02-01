'use client';

import type { News } from '@/types';
import NewsCard from '../news/NewsCard';

interface NewsListProps {
  news: News[];
  isLoading?: boolean;
}

export default function NewsList({ news, isLoading = false }: NewsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-surface rounded-xl p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-text-secondary/20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-text-secondary/20 rounded w-1/4" />
                  <div className="h-5 bg-text-secondary/20 rounded w-3/4" />
                  <div className="h-4 bg-text-secondary/20 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">
          inbox
        </span>
        <p className="text-text-secondary">No news available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
