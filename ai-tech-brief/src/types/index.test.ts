import {
  News,
  NewsWithDetail,
  Briefing,
  RSSSource,
  FeedItem,
  NewsListResponse,
  ArchiveResponse,
} from './index';

describe('Type Definitions', () => {
  describe('News', () => {
    it('should have correct structure', () => {
      const news: News = {
        id: 'test-id',
        title: 'Test Title',
        source: 'openai',
        sourceName: 'OpenAI Blog',
        publishedAt: '2024-01-15T09:00:00Z',
        thumbnailUrl: 'https://example.com/image.jpg',
        summary: ['Summary 1', 'Summary 2', 'Summary 3'],
      };

      expect(news.id).toBe('test-id');
      expect(news.title).toBe('Test Title');
      expect(news.source).toBe('openai');
      expect(news.sourceName).toBe('OpenAI Blog');
      expect(news.publishedAt).toBe('2024-01-15T09:00:00Z');
      expect(news.thumbnailUrl).toBe('https://example.com/image.jpg');
      expect(news.summary).toHaveLength(3);
    });

    it('should allow null thumbnailUrl', () => {
      const news: News = {
        id: 'test-id',
        title: 'Test Title',
        source: 'openai',
        sourceName: 'OpenAI Blog',
        publishedAt: '2024-01-15T09:00:00Z',
        thumbnailUrl: null,
        summary: ['Summary 1', 'Summary 2', 'Summary 3'],
      };

      expect(news.thumbnailUrl).toBeNull();
    });
  });

  describe('NewsWithDetail', () => {
    it('should extend News with additional fields', () => {
      const newsDetail: NewsWithDetail = {
        id: 'test-id',
        title: 'Test Title',
        source: 'openai',
        sourceName: 'OpenAI Blog',
        publishedAt: '2024-01-15T09:00:00Z',
        thumbnailUrl: 'https://example.com/image.jpg',
        summary: ['Summary 1', 'Summary 2', 'Summary 3'],
        originalUrl: 'https://openai.com/blog/test',
        content: 'Full content here...',
        insight: 'AI insight text',
      };

      expect(newsDetail.originalUrl).toBe('https://openai.com/blog/test');
      expect(newsDetail.content).toBe('Full content here...');
      expect(newsDetail.insight).toBe('AI insight text');
    });
  });

  describe('Briefing', () => {
    it('should have correct structure', () => {
      const briefing: Briefing = {
        id: 'briefing-id',
        date: '2024-01-15',
        newsCount: 12,
        topNews: {
          id: 'news-id',
          title: 'Top News Title',
        },
      };

      expect(briefing.id).toBe('briefing-id');
      expect(briefing.date).toBe('2024-01-15');
      expect(briefing.newsCount).toBe(12);
      expect(briefing.topNews.id).toBe('news-id');
      expect(briefing.topNews.title).toBe('Top News Title');
    });
  });

  describe('RSSSource', () => {
    it('should have correct structure with category', () => {
      const source: RSSSource = {
        id: 'openai',
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog/rss.xml',
        category: 'company',
        icon: 'smart_toy',
      };

      expect(source.id).toBe('openai');
      expect(source.category).toBe('company');
    });

    it('should accept media category', () => {
      const source: RSSSource = {
        id: 'techcrunch',
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        category: 'media',
        icon: 'newspaper',
      };

      expect(source.category).toBe('media');
    });
  });

  describe('FeedItem', () => {
    it('should have correct structure', () => {
      const feedItem: FeedItem = {
        title: 'Feed Item Title',
        link: 'https://example.com/article',
        pubDate: '2024-01-15T09:00:00Z',
        content: 'Article content',
        source: 'openai',
      };

      expect(feedItem.title).toBe('Feed Item Title');
      expect(feedItem.link).toBe('https://example.com/article');
      expect(feedItem.pubDate).toBe('2024-01-15T09:00:00Z');
      expect(feedItem.content).toBe('Article content');
      expect(feedItem.source).toBe('openai');
    });
  });

  describe('NewsListResponse', () => {
    it('should have news array and total', () => {
      const response: NewsListResponse = {
        news: [
          {
            id: 'test-id',
            title: 'Test Title',
            source: 'openai',
            sourceName: 'OpenAI Blog',
            publishedAt: '2024-01-15T09:00:00Z',
            thumbnailUrl: null,
            summary: ['Summary 1', 'Summary 2', 'Summary 3'],
          },
        ],
        total: 45,
      };

      expect(response.news).toHaveLength(1);
      expect(response.total).toBe(45);
    });
  });

  describe('ArchiveResponse', () => {
    it('should have briefings array and total', () => {
      const response: ArchiveResponse = {
        briefings: [
          {
            id: 'briefing-id',
            date: '2024-01-15',
            newsCount: 12,
            topNews: {
              id: 'news-id',
              title: 'Top News Title',
            },
          },
        ],
        total: 30,
      };

      expect(response.briefings).toHaveLength(1);
      expect(response.total).toBe(30);
    });
  });
});
