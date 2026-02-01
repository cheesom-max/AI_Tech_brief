// Supabase SQL for table creation (run in Supabase SQL Editor)
export const NEWS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  original_url TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  content TEXT,
  summary JSONB DEFAULT '[]'::jsonb,
  insight TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source);
`;

export const BRIEFINGS_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  news_count INTEGER DEFAULT 0,
  top_news_id UUID REFERENCES news(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_briefings_date ON briefings(date);
`;

export const SOURCES_TABLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true
);
`;

export const CREATE_TABLES_SQL = `
-- Run this in Supabase SQL Editor to create all tables

${NEWS_TABLE_SCHEMA}

${BRIEFINGS_TABLE_SCHEMA}

${SOURCES_TABLE_SCHEMA}

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow public read access on briefings" ON briefings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on sources" ON sources FOR SELECT USING (true);

-- Create policies for service role write access
CREATE POLICY "Allow service role insert on news" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role update on news" ON news FOR UPDATE USING (true);
CREATE POLICY "Allow service role insert on briefings" ON briefings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service role update on briefings" ON briefings FOR UPDATE USING (true);
`;
