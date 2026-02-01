'use client';

interface AIInsightProps {
  insight: string;
}

interface InsightSection {
  emoji: string;
  title: string;
  content: string;
}

function parseInsight(insight: string): InsightSection[] {
  const sections: InsightSection[] = [];

  // Split by emoji headers (💡, 🔮, 📌)
  const lines = insight.split('\n').filter(line => line.trim());

  let currentSection: InsightSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this is a section header with emoji
    if (trimmed.match(/^(💡|🔮|📌)\s*\*?\*?(.+?)\*?\*?\s*$/)) {
      if (currentSection && currentSection.content) {
        sections.push(currentSection);
      }
      const emoji = trimmed.match(/^(💡|🔮|📌)/)?.[1] || '';
      const title = trimmed.replace(/^(💡|🔮|📌)\s*\*?\*?/, '').replace(/\*?\*?\s*$/, '').trim();
      currentSection = { emoji, title, content: '' };
    } else if (currentSection) {
      // Add content to current section
      if (currentSection.content) {
        currentSection.content += ' ' + trimmed;
      } else {
        currentSection.content = trimmed;
      }
    }
  }

  // Don't forget the last section
  if (currentSection && currentSection.content) {
    sections.push(currentSection);
  }

  return sections;
}

export default function AIInsight({ insight }: AIInsightProps) {
  if (!insight) {
    return null;
  }

  const sections = parseInsight(insight);

  // If parsing failed, show as plain text
  if (sections.length === 0) {
    return (
      <div className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
        <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">psychology</span>
          AI 인사이트
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
          {insight}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20">
      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">psychology</span>
        AI 인사이트
      </h2>
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="bg-background/50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-text-primary mb-2 flex items-center gap-2">
              <span className="text-lg">{section.emoji}</span>
              {section.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed pl-7">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
