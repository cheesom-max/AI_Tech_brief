# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Tech Brief는 AI/기술 뉴스를 RSS로 수집하여 Gemini AI 요약과 함께 매일 브리핑으로 제공하는 모바일 퍼스트 웹앱입니다.

## Commands

```bash
npm run dev            # Start dev server (http://localhost:3000)
npm run build          # Build for production
npm start              # Start production server
npm test               # Run all tests
npm run test:watch     # Watch mode for single test development
npm run test:coverage  # Coverage report
npm run lint           # ESLint check
```

## Architecture

```
Vercel Cron (22:30 UTC / 7:30 KST)
    ↓
/api/cron/collect
    ↓
RSS Parser (10 sources, max 10 items each, round-robin)
    ↓
Content Fetcher (fetch full article if RSS content < 200 chars)
    ↓
Gemini AI (translate → summarize → insight)
    ↓
Supabase PostgreSQL
    ↓
React Components (SSR + Client)
```

## Key Directories

```
src/
├── app/
│   ├── api/cron/collect/   # Daily RSS collection endpoint
│   ├── api/news/           # News list/detail API
│   ├── api/archive/        # Briefing archive API
│   ├── news/[id]/          # News detail page
│   └── archive/            # Archive timeline page
├── components/
│   ├── layout/             # Header, BottomNav
│   ├── home/               # HeroNews, CategoryFilter, NewsList
│   ├── news/               # NewsCard, NewsDetail, AISummary, AIInsight
│   └── archive/            # ArchiveTimeline
├── lib/
│   ├── rss/
│   │   ├── sources.ts      # RSS source definitions (10 sources)
│   │   ├── parser.ts       # RSS feed parsing
│   │   └── fetcher.ts      # Full article content extraction
│   ├── ai/
│   │   └── summarizer.ts   # Gemini AI prompts (translate, summarize, insight)
│   └── db/
│       ├── client.ts       # Supabase client
│       ├── queries.ts      # Database operations
│       └── schema.ts       # Table initialization
└── types/                  # TypeScript interfaces
```

## RSS Sources (10)

OpenAI, Google Research, arXiv ML (cs.LG), arXiv NLP (cs.CL), Meta Engineering, Hugging Face, Lobsters, Papers With Code, AWS ML Blog, ML Mastery

소스 추가/수정: `src/lib/rss/sources.ts`
소스별 아이콘/색상: `src/components/news/NewsCard.tsx`, `src/components/home/HeroNews.tsx`

## Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
CRON_SECRET=your-secret-here
```

## Database Tables

- `news` - 뉴스 기사 (id, title, source, original_url, content, summary[], insight, published_at)
- `briefings` - 일별 브리핑 (date, news_count, top_news_id)
- `sources` - RSS 소스 메타데이터

## AI Processing

| Function | Purpose |
|----------|---------|
| `translateTitle()` | 영어 제목 → 한국어 뉴스 제목 |
| `generateSummary()` | 3줄 요약 (각 80~120자, 뉴스 문체) |
| `generateInsight()` | 💡핵심 / 🔮전망 / 📌배경지식 |

RSS 내용이 200자 미만이면 `fetcher.ts`가 원본 URL에서 전체 기사를 가져옴.

## UI Patterns

- Mobile-first: `max-w-md` (448px)
- Dark mode only (hardcoded in layout.tsx)
- Source-specific gradients in NewsCard/HeroNews
- Client components use `'use client'` directive

## Path Alias

`@/*` → `./src/*`
