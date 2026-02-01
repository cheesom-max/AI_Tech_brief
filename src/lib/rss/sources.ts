import type { RSSSource } from '@/types';

export const RSS_SOURCES: RSSSource[] = [
  // Big Tech Engineering Blogs
  {
    id: 'netflix',
    name: 'Netflix Tech',
    url: 'https://netflixtechblog.com/feed',
    category: 'company',
    icon: 'play_circle',
  },
  {
    id: 'uber',
    name: 'Uber Engineering',
    url: 'https://www.uber.com/en-US/blog/engineering/rss/',
    category: 'company',
    icon: 'local_taxi',
  },
  {
    id: 'google',
    name: 'Google Research',
    url: 'https://research.google/blog/rss',
    category: 'company',
    icon: 'science',
  },
  {
    id: 'meta',
    name: 'Meta Engineering',
    url: 'https://engineering.fb.com/feed/',
    category: 'company',
    icon: 'code',
  },
  // AI & ML Implementation
  {
    id: 'huggingface',
    name: 'Hugging Face',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'company',
    icon: 'sentiment_satisfied',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com/blog/rss.xml',
    category: 'company',
    icon: 'smart_toy',
  },
  {
    id: 'mlmastery',
    name: 'ML Mastery',
    url: 'https://machinelearningmastery.com/feed/',
    category: 'media',
    icon: 'school',
  },
  {
    id: 'gradient',
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    category: 'media',
    icon: 'insights',
  },
  // Developer Community
  {
    id: 'hackernews',
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
    category: 'media',
    icon: 'trending_up',
  },
  {
    id: 'github',
    name: 'GitHub Blog',
    url: 'https://github.blog/feed/',
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
