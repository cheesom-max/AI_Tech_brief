'use client';

import { useState, useCallback } from 'react';
import ArchiveTimeline from './ArchiveTimeline';
import type { Briefing } from '@/types';

interface ArchiveContentProps {
  initialBriefings: Briefing[];
  initialTotal: number;
}

const LIMIT = 10;

export default function ArchiveContent({ initialBriefings, initialTotal }: ArchiveContentProps) {
  const [briefings, setBriefings] = useState<Briefing[]>(initialBriefings);
  const [hasMore, setHasMore] = useState(initialBriefings.length < initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const response = await fetch(`/api/archive?limit=${LIMIT}&offset=${briefings.length}`);
      const data = await response.json();

      setBriefings((prev) => [...prev, ...(data.briefings || [])]);
      setHasMore(briefings.length + (data.briefings?.length || 0) < data.total);
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [briefings.length]);

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
          disabled={isLoadingMore}
          className="w-full py-3 text-sm text-primary hover:underline disabled:opacity-50"
        >
          {isLoadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
