import {
  NEWS_TABLE_SCHEMA,
  BRIEFINGS_TABLE_SCHEMA,
  SOURCES_TABLE_SCHEMA,
  CREATE_TABLES_SQL,
} from './schema';

describe('Database Schema', () => {
  describe('NEWS_TABLE_SCHEMA', () => {
    it('should be a valid SQL CREATE TABLE statement for Supabase', () => {
      expect(NEWS_TABLE_SCHEMA).toContain('CREATE TABLE IF NOT EXISTS news');
      expect(NEWS_TABLE_SCHEMA).toContain('id UUID PRIMARY KEY');
      expect(NEWS_TABLE_SCHEMA).toContain('title TEXT NOT NULL');
      expect(NEWS_TABLE_SCHEMA).toContain('source TEXT NOT NULL');
      expect(NEWS_TABLE_SCHEMA).toContain('original_url TEXT UNIQUE NOT NULL');
      expect(NEWS_TABLE_SCHEMA).toContain('thumbnail_url TEXT');
      expect(NEWS_TABLE_SCHEMA).toContain('content TEXT');
      expect(NEWS_TABLE_SCHEMA).toContain('summary JSONB');
      expect(NEWS_TABLE_SCHEMA).toContain('insight TEXT');
      expect(NEWS_TABLE_SCHEMA).toContain('published_at TIMESTAMPTZ');
      expect(NEWS_TABLE_SCHEMA).toContain('created_at TIMESTAMPTZ');
    });
  });

  describe('BRIEFINGS_TABLE_SCHEMA', () => {
    it('should be a valid SQL CREATE TABLE statement for Supabase', () => {
      expect(BRIEFINGS_TABLE_SCHEMA).toContain('CREATE TABLE IF NOT EXISTS briefings');
      expect(BRIEFINGS_TABLE_SCHEMA).toContain('id UUID PRIMARY KEY');
      expect(BRIEFINGS_TABLE_SCHEMA).toContain('date DATE UNIQUE NOT NULL');
      expect(BRIEFINGS_TABLE_SCHEMA).toContain('news_count INTEGER');
      expect(BRIEFINGS_TABLE_SCHEMA).toContain('top_news_id UUID');
      expect(BRIEFINGS_TABLE_SCHEMA).toContain('created_at TIMESTAMPTZ');
    });
  });

  describe('SOURCES_TABLE_SCHEMA', () => {
    it('should be a valid SQL CREATE TABLE statement for Supabase', () => {
      expect(SOURCES_TABLE_SCHEMA).toContain('CREATE TABLE IF NOT EXISTS sources');
      expect(SOURCES_TABLE_SCHEMA).toContain('id TEXT PRIMARY KEY');
      expect(SOURCES_TABLE_SCHEMA).toContain('name TEXT NOT NULL');
      expect(SOURCES_TABLE_SCHEMA).toContain('url TEXT NOT NULL');
      expect(SOURCES_TABLE_SCHEMA).toContain('category TEXT');
      expect(SOURCES_TABLE_SCHEMA).toContain('is_active BOOLEAN');
    });
  });

  describe('CREATE_TABLES_SQL', () => {
    it('should contain all table creation statements and RLS policies', () => {
      expect(CREATE_TABLES_SQL).toContain('news');
      expect(CREATE_TABLES_SQL).toContain('briefings');
      expect(CREATE_TABLES_SQL).toContain('sources');
      expect(CREATE_TABLES_SQL).toContain('ENABLE ROW LEVEL SECURITY');
    });
  });
});
