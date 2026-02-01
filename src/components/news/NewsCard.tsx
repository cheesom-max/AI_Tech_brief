'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { News } from '@/types';

interface NewsCardProps {
  news: News;
}

// Source-specific styles with gradients and icons
const sourceStyles: Record<string, { gradient: string; icon: string; iconBg: string }> = {
  // Big Tech Engineering
  spotify: {
    gradient: 'from-green-500/20 to-green-400/10',
    icon: '🎵',
    iconBg: 'bg-green-500/20',
  },
  uber: {
    gradient: 'from-gray-800/20 to-gray-600/10',
    icon: '🚗',
    iconBg: 'bg-gray-800/20',
  },
  google: {
    gradient: 'from-blue-500/20 to-indigo-500/10',
    icon: '🔬',
    iconBg: 'bg-blue-500/20',
  },
  meta: {
    gradient: 'from-blue-600/20 to-cyan-500/10',
    icon: '👨‍💻',
    iconBg: 'bg-blue-600/20',
  },
  // AI & ML
  huggingface: {
    gradient: 'from-yellow-500/20 to-orange-500/10',
    icon: '🤗',
    iconBg: 'bg-yellow-500/20',
  },
  openai: {
    gradient: 'from-emerald-500/20 to-teal-500/10',
    icon: '🤖',
    iconBg: 'bg-emerald-500/20',
  },
  mlmastery: {
    gradient: 'from-purple-500/20 to-pink-500/10',
    icon: '🎓',
    iconBg: 'bg-purple-500/20',
  },
  aws: {
    gradient: 'from-orange-500/20 to-yellow-500/10',
    icon: '☁️',
    iconBg: 'bg-orange-500/20',
  },
  // Developer Community
  hackernews: {
    gradient: 'from-orange-500/20 to-amber-500/10',
    icon: '🔥',
    iconBg: 'bg-orange-500/20',
  },
  github: {
    gradient: 'from-gray-600/20 to-gray-500/10',
    icon: '🐙',
    iconBg: 'bg-gray-600/20',
  },
  // Legacy sources (for existing news data)
  anthropic: {
    gradient: 'from-orange-500/20 to-amber-500/10',
    icon: '🔶',
    iconBg: 'bg-orange-500/20',
  },
  deepmind: {
    gradient: 'from-purple-500/20 to-pink-500/10',
    icon: '🧠',
    iconBg: 'bg-purple-500/20',
  },
  nvidia: {
    gradient: 'from-green-500/20 to-lime-500/10',
    icon: '💻',
    iconBg: 'bg-green-500/20',
  },
  techcrunch: {
    gradient: 'from-green-600/20 to-emerald-500/10',
    icon: '📰',
    iconBg: 'bg-green-600/20',
  },
  verge: {
    gradient: 'from-pink-500/20 to-rose-500/10',
    icon: '⚡',
    iconBg: 'bg-pink-500/20',
  },
  mit: {
    gradient: 'from-red-600/20 to-rose-500/10',
    icon: '🎓',
    iconBg: 'bg-red-600/20',
  },
  wired: {
    gradient: 'from-gray-500/20 to-slate-500/10',
    icon: '🔌',
    iconBg: 'bg-gray-500/20',
  },
  bair: {
    gradient: 'from-blue-600/20 to-cyan-500/10',
    icon: '🔬',
    iconBg: 'bg-blue-600/20',
  },
  aheadofai: {
    gradient: 'from-purple-500/20 to-pink-500/10',
    icon: '🧠',
    iconBg: 'bg-purple-500/20',
  },
  ainews: {
    gradient: 'from-sky-500/20 to-blue-500/10',
    icon: '📰',
    iconBg: 'bg-sky-500/20',
  },
  kdnuggets: {
    gradient: 'from-indigo-500/20 to-violet-500/10',
    icon: '📊',
    iconBg: 'bg-indigo-500/20',
  },
  tds: {
    gradient: 'from-teal-500/20 to-emerald-500/10',
    icon: '📈',
    iconBg: 'bg-teal-500/20',
  },
  venturebeat: {
    gradient: 'from-red-500/20 to-orange-500/10',
    icon: '🚀',
    iconBg: 'bg-red-500/20',
  },
  default: {
    gradient: 'from-primary/20 to-primary/5',
    icon: '📄',
    iconBg: 'bg-primary/20',
  },
};

function getSourceStyle(source: string) {
  const key = source.toLowerCase();
  return sourceStyles[key] || sourceStyles.default;
}

export default function NewsCard({ news }: NewsCardProps) {
  const style = getSourceStyle(news.source);

  return (
    <Link href={`/news/${news.id}`}>
      <article className="bg-surface rounded-xl p-4 hover:bg-surface/80 transition-colors border border-text-secondary/10">
        <div className="flex gap-4">
          {news.thumbnailUrl ? (
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-text-secondary/10">
              <img
                src={news.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-24 h-24 flex-shrink-0 rounded-lg bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
              <span className="text-4xl">{style.icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.iconBg} text-text-primary`}>
                {news.sourceName}
              </span>
              <span className="text-xs text-text-secondary">
                {format(new Date(news.publishedAt), 'PP', { locale: ko })}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-text-primary line-clamp-2 mb-2">
              {news.title}
            </h3>
            {news.summary.length > 0 && (
              <p className="text-xs text-text-secondary line-clamp-2">
                {news.summary[0]}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
