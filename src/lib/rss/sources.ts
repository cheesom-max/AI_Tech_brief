import type { RSSSource } from '@/types';

export const RSS_SOURCES: RSSSource[] = [
  // AI Company Blogs
  {
    id: 'anthropic',
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/rss/news.xml',
    category: 'company',
    icon: 'auto_awesome',
  },
  {
    id: 'openai',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'company',
    icon: 'smart_toy',
  },
  {
    id: 'deepmind',
    name: 'Google DeepMind',
    url: 'https://deepmind.google/blog/rss.xml',
    category: 'company',
    icon: 'psychology',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'company',
    icon: 'sentiment_satisfied',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA Blog',
    url: 'https://blogs.nvidia.com/feed/',
    category: 'company',
    icon: 'memory',
  },
  // Tech Media
  {
    id: 'techcrunch',
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'media',
    icon: 'newspaper',
  },
  {
    id: 'verge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'media',
    icon: 'public',
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'media',
    icon: 'trending_up',
  },
  {
    id: 'mit',
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'media',
    icon: 'school',
  },
  {
    id: 'wired',
    name: 'WIRED AI',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    category: 'media',
    icon: 'hub',
  },
];

export function getSourceById(id: string): RSSSource | undefined {
  return RSS_SOURCES.find((source) => source.id === id);
}

export function getSourcesByCategory(category: 'company' | 'media'): RSSSource[] {
  return RSS_SOURCES.filter((source) => source.category === category);
}
