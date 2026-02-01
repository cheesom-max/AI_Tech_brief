'use client';

interface AISummaryProps {
  summary: string[];
}

export default function AISummary({ summary }: AISummaryProps) {
  if (summary.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-surface rounded-xl p-4 border border-primary/20">
      <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        AI 3-Line Summary
      </h2>
      <ul className="space-y-2">
        {summary.map((line, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm text-text-secondary"
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/20 text-primary rounded-full text-xs font-medium">
              {index + 1}
            </span>
            <span className="pt-0.5">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
