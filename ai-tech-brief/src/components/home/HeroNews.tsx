'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { News } from '@/types';

interface HeroNewsProps {
  news: News;
}

// Source-specific styles
const sourceStyles: Record<string, { gradient: string; icon: string }> = {
  openai: { gradient: 'from-emerald-500/30 to-teal-500/10', icon: '🤖' },
  google: { gradient: 'from-blue-500/30 to-indigo-500/10', icon: '🔍' },
  deepmind: { gradient: 'from-purple-500/30 to-pink-500/10', icon: '🧠' },
  anthropic: { gradient: 'from-orange-500/30 to-amber-500/10', icon: '🔶' },
  meta: { gradient: 'from-blue-600/30 to-cyan-500/10', icon: '🌐' },
  nvidia: { gradient: 'from-green-500/30 to-lime-500/10', icon: '💻' },
  microsoft: { gradient: 'from-sky-500/30 to-blue-500/10', icon: '📊' },
  techcrunch: { gradient: 'from-green-600/30 to-emerald-500/10', icon: '📰' },
  theverge: { gradient: 'from-pink-500/30 to-rose-500/10', icon: '⚡' },
  wired: { gradient: 'from-gray-500/30 to-slate-500/10', icon: '🔌' },
  arstechnica: { gradient: 'from-orange-600/30 to-red-500/10', icon: '🚀' },
  venturebeat: { gradient: 'from-red-500/30 to-orange-500/10', icon: '📈' },
  default: { gradient: 'from-primary/30 to-primary/5', icon: '📄' },
};

function getSourceStyle(source: string) {
  const key = source.toLowerCase();
  return sourceStyles[key] || sourceStyles.default;
}

export default function HeroNews({ news }: HeroNewsProps) {
  const style = getSourceStyle(news.source);

  return (
    <Link href={`/news/${news.id}`}>
      <article className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} border border-text-secondary/20`}>
        {news.thumbnailUrl ? (
          <div className="absolute inset-0">
            <img
              src={news.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        ) : (
          <div className="absolute top-4 right-4 text-6xl opacity-20">
            {style.icon}
          </div>
        )}
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 text-xs font-medium bg-background/50 text-primary rounded-full flex items-center gap-1">
              <span>🔥</span> 오늘의 뉴스
            </span>
            <span className="text-xs text-text-secondary">
              {news.sourceName}
            </span>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">
            {news.title}
          </h2>
          {news.summary.length > 0 && (
            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {news.summary[0]}
            </p>
          )}
          <div className="flex items-center justify-between">
            <time className="text-xs text-text-secondary">
              {format(new Date(news.publishedAt), 'PPP', { locale: ko })}
            </time>
            <span className="flex items-center gap-1 text-sm text-primary">
              자세히 보기
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
