import type { RSSSource } from '@/types';

export const RSS_SOURCES: RSSSource[] = [
  // AI Company Blogs
  {
    id: 'anthropic',
    name: 'Anthropic',
    url: 'https://raw.githubusercontent.com/conoro/anthropic-engineering-rss-feed/main/anthropic_engineering_rss.xml',
    category: 'company',
    icon: 'auto_awesome',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com/blog/rss.xml',
    category: 'company',
    icon: 'smart_toy',
  },
  {
    id: 'google',
    name: 'Google AI',
    url: 'https://blog.google/technology/ai/rss/',
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
    id: 'bair',
    name: 'BAIR Blog',
    url: 'https://bair.berkeley.edu/blog/feed.xml',
    category: 'company',
    icon: 'science',
  },
  // AI Research & Analysis
  {
    id: 'aheadofai',
    name: 'Ahead of AI',
    url: 'https://magazine.sebastianraschka.com/feed',
    category: 'media',
    icon: 'insights',
  },
  {
    id: 'ainews',
    name: 'AI News',
    url: 'https://www.artificialintelligence-news.com/feed/',
    category: 'media',
    icon: 'newspaper',
  },
  {
    id: 'kdnuggets',
    name: 'KDnuggets',
    url: 'https://www.kdnuggets.com/feed',
    category: 'media',
    icon: 'analytics',
  },
  {
    id: 'tds',
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    category: 'media',
    icon: 'data_usage',
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'media',
    icon: 'trending_up',
  },
];

export function getSourceById(id: string): RSSSource | undefined {
  return RSS_SOURCES.find((source) => source.id === id);
}

export function getSourcesByCategory(category: 'company' | 'media'): RSSSource[] {
  return RSS_SOURCES.filter((source) => source.category === category);
}
