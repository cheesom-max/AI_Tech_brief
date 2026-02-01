'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Briefing } from '@/types';

interface ArchiveTimelineProps {
  briefings: Briefing[];
}

export default function ArchiveTimeline({ briefings }: ArchiveTimelineProps) {
  if (briefings.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">
          archive
        </span>
        <p className="text-text-secondary">No briefings available yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-text-secondary/20" />

      {/* Briefing items */}
      <div className="space-y-6">
        {briefings.map((briefing) => (
          <div key={briefing.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-2.5 top-2 w-3 h-3 bg-primary rounded-full border-2 border-background" />

            <div className="bg-surface rounded-xl p-4 border border-text-secondary/10">
              {/* Date */}
              <div className="flex items-center justify-between mb-3">
                <time className="text-sm font-medium text-text-primary">
                  {format(new Date(briefing.date), 'PPP', { locale: ko })}
                </time>
                <span className="flex items-center gap-1 text-xs text-text-secondary">
                  <span className="material-symbols-outlined text-sm">article</span>
                  {briefing.newsCount} articles
                </span>
              </div>

              {/* Top News */}
              {briefing.topNews && (
                <Link
                  href={`/news/${briefing.topNews.id}`}
                  className="block group"
                >
                  <h3 className="text-sm text-text-secondary group-hover:text-primary transition-colors line-clamp-2">
                    <span className="text-primary font-medium">Top: </span>
                    {briefing.topNews.title}
                  </h3>
                </Link>
              )}

              {/* View All Link */}
              <Link
                href={`/?date=${briefing.date}`}
                className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
              >
                View all articles
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
