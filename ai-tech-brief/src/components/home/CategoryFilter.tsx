'use client';

import { RSS_SOURCES } from '@/lib/rss/sources';

interface CategoryFilterProps {
  selected: string[];
  onChange: (sources: string[]) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const toggleSource = (sourceId: string) => {
    if (selected.includes(sourceId) && selected.length === 1) {
      // 이미 선택된 유일한 항목을 다시 클릭하면 All로 돌아감
      onChange([]);
    } else {
      // 다른 항목 클릭하면 그것만 선택 (단일 선택)
      onChange([sourceId]);
    }
  };

  const isAllSelected = selected.length === 0;

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        <button
          onClick={() => onChange([])}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            isAllSelected
              ? 'bg-primary text-white'
              : 'bg-surface text-text-secondary border border-text-secondary/20 hover:border-primary/50'
          }`}
        >
          All
        </button>
        {RSS_SOURCES.map((source) => (
          <button
            key={source.id}
            onClick={() => toggleSource(source.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              selected.includes(source.id)
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary border border-text-secondary/20 hover:border-primary/50'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {source.icon}
            </span>
            {source.name}
          </button>
        ))}
      </div>
    </div>
  );
}
