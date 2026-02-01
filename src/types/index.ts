// News Types
export interface News {
  id: string;
  title: string;
  source: string;
  sourceName: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  summary: string[];
}

export interface NewsWithDetail extends News {
  originalUrl: string;
  content: string;
  insight: string;
}

// Briefing Types
export interface Briefing {
  id: string;
  date: string;
  newsCount: number;
  topNews: {
    id: string;
    title: string;
  };
}

// RSS Types
export interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: 'company' | 'media';
  icon: string;
}

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
}

// API Response Types
export interface NewsListResponse {
  news: News[];
  total: number;
}

export interface ArchiveResponse {
  briefings: Briefing[];
  total: number;
}

// Database Input Types
export interface NewsInput {
  id: string;
  title: string;
  source: string;
  originalUrl: string;
  thumbnailUrl: string | null;
  content: string;
  summary: string[];
  insight: string;
  publishedAt: string;
}

export interface BriefingInput {
  id: string;
  date: string;
  newsCount: number;
  topNewsId: string;
}
