'use client';

import { useEffect, useState } from 'react';
import ArchiveTimeline from '@/components/archive/ArchiveTimeline';
import type { Briefing } from '@/types';

export default function ArchivePage() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = 10;

  useEffect(() => {
    async function fetchBriefings() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/archive?limit=${limit}&offset=0`);
        const data = await response.json();
        setBriefings(data.briefings || []);
        setHasMore((data.briefings?.length || 0) < data.total);
        setOffset(data.briefings?.length || 0);
      } catch (error) {
        console.error('Error fetching archive:', error);
        setBriefings([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBriefings();
  }, []);

  const loadMore = async () => {
    try {
      const response = await fetch(`/api/archive?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      setBriefings((prev) => [...prev, ...(data.briefings || [])]);
      setHasMore(briefings.length + (data.briefings?.length || 0) < data.total);
      setOffset((prev) => prev + (data.briefings?.length || 0));
    } catch (error) {
      console.error('Error loading more:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Briefing Archive
        </h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="pl-10">
              <div className="bg-surface rounded-xl p-4 space-y-2">
                <div className="h-5 bg-text-secondary/20 rounded w-1/3" />
                <div className="h-4 bg-text-secondary/20 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Briefing Archive
        </h2>
        <span className="text-sm text-text-secondary">
          {briefings.length} briefings
        </span>
      </div>

      <ArchiveTimeline briefings={briefings} />

      {hasMore && briefings.length > 0 && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-sm text-primary hover:underline"
        >
          Load more
        </button>
      )}
    </div>
  );
}
