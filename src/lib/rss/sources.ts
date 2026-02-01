import type { RSSSource } from '@/types';

export const RSS_SOURCES: RSSSource[] = [
  // 1. Developer Trends
  {
    id: 'hackernews',
    name: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'media',
    icon: 'trending_up',
  },
  // 2. AI Frontier
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com/blog/rss.xml',
    category: 'company',
    icon: 'smart_toy',
  },
  // 3. Research
  {
    id: 'google',
    name: 'Google Research',
    url: 'https://research.google/blog/rss',
    category: 'company',
    icon: 'science',
  },
  // 4. ML Papers (arXiv)
  {
    id: 'arxiv-ml',
    name: 'arXiv ML',
    url: 'http://export.arxiv.org/rss/cs.LG',
    category: 'media',
    icon: 'description',
  },
  // 5. LLM Papers (arXiv)
  {
    id: 'arxiv-nlp',
    name: 'arXiv NLP',
    url: 'http://export.arxiv.org/rss/cs.CL',
    category: 'media',
    icon: 'article',
  },
  // 6. Core Frameworks
  {
    id: 'meta',
    name: 'Meta Engineering',
    url: 'https://engineering.fb.com/feed/',
    category: 'company',
    icon: 'code',
  },
  // 5. Open Source AI/ML
  {
    id: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'company',
    icon: 'sentiment_satisfied',
  },
  // 6. Open Source Ecosystem
  {
    id: 'github',
    name: 'GitHub Blog',
    url: 'https://github.blog/feed/',
    category: 'media',
    icon: 'hub',
  },
  // 7. System Architecture
  {
    id: 'spotify',
    name: 'Spotify Engineering',
    url: 'https://engineering.atspotify.com/feed/',
    category: 'company',
    icon: 'music_note',
  },
  // 8. Real-time Data
  {
    id: 'uber',
    name: 'Uber Engineering',
    url: 'https://www.uber.com/en-US/blog/engineering/rss/',
    category: 'company',
    icon: 'local_taxi',
  },
  // 9. Cloud ML
  {
    id: 'aws',
    name: 'AWS ML Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    category: 'media',
    icon: 'cloud',
  },
  // 10. Tutorials
  {
    id: 'mlmastery',
    name: 'ML Mastery',
    url: 'https://machinelearningmastery.com/feed/',
    category: 'media',
    icon: 'school',
  },
];

export function getSourceById(id: string): RSSSource | undefined {
  return RSS_SOURCES.find((source) => source.id === id);
}

export function getSourcesByCategory(category: 'company' | 'media'): RSSSource[] {
  return RSS_SOURCES.filter((source) => source.category === category);
}
