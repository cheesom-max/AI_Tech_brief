'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { NewsWithDetail } from '@/types';
import AISummary from './AISummary';
import AIInsight from './AIInsight';

interface NewsDetailProps {
  news: NewsWithDetail;
}

export default function NewsDetail({ news }: NewsDetailProps) {
  return (
    <article className="pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
            {news.sourceName}
          </span>
          <time className="text-xs text-text-secondary">
            {format(new Date(news.publishedAt), 'PPP', { locale: ko })}
          </time>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          {news.title}
        </h1>
      </div>

      {/* Thumbnail */}
      {news.thumbnailUrl && (
        <div className="mb-6 rounded-xl overflow-hidden">
          <img
            src={news.thumbnailUrl}
            alt=""
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      {/* AI Summary */}
      <AISummary summary={news.summary} />

      {/* AI Insight */}
      <AIInsight insight={news.insight} />

      {/* Content */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">article</span>
          Original Content
        </h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-text-secondary whitespace-pre-wrap">{news.content}</p>
        </div>
      </div>

      {/* Original Link */}
      <a
        href={news.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-alt transition-colors"
      >
        <span className="material-symbols-outlined">open_in_new</span>
        Read Original Article
      </a>
    </article>
  );
}
