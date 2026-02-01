# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Tech Brief는 AI/기술 뉴스를 RSS로 수집하여 Gemini AI 요약과 함께 매일 브리핑으로 제공하는 모바일 퍼스트 웹앱입니다.

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Build & Production
npm run build        # Build for production
npm start            # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Linting
npm run lint         # ESLint check
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini API (gemini-2.0-flash) |
| Styling | Tailwind CSS (dark mode, mobile-first) |
| RSS | rss-parser |
| Testing | Jest + React Testing Library |

## Architecture

```
RSS Sources (9개) → RSS Parser → Gemini AI → Supabase → React Components
                       ↓              ↓
                 fetchAllFeeds()  translateTitle()
                                  generateSummary()
                                  generateInsight()
```

**Data Collection Flow:**
1. `/api/cron/collect` - Vercel Cron이 매일 트리거
2. 각 소스에서 최대 10개씩 균등하게 수집 (round-robin)
3. 영어 제목 → 한국어 번역
4. AI 3줄 요약 + 인사이트 생성
5. Supabase에 저장

## Key Directories

```
src/
├── app/api/          # API routes (cron/collect, news, archive)
├── components/       # Feature-based: layout/, home/, news/, archive/
├── lib/
│   ├── rss/          # parser.ts, sources.ts (9개 RSS 소스)
│   ├── ai/           # summarizer.ts (Gemini prompts)
│   └── db/           # client.ts, queries.ts, schema.ts (Supabase)
└── types/            # TypeScript interfaces
```

## Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
CRON_SECRET=your-secret-here
```

## Database Tables (Supabase)

- `news` - 뉴스 기사 (id, title, source, summary, insight, published_at)
- `briefings` - 일별 브리핑 (date, news_count, top_news_id)
- `sources` - RSS 소스 메타데이터

## RSS Sources

9개 소스: OpenAI, DeepMind, Hugging Face, NVIDIA, TechCrunch AI, The Verge, VentureBeat AI, MIT Tech Review, WIRED AI

소스 추가/수정: `src/lib/rss/sources.ts`

## AI Prompts (Korean)

- **translateTitle**: 영어 제목 → 자연스러운 한국어 뉴스 제목
- **generateSummary**: 3줄 요약 (각 80~120자, 뉴스 문체)
- **generateInsight**: 💡핵심 포인트 / 🔮앞으로의 전망 / 📌알아두면 좋은 점

## UI Patterns

- Mobile-first: `max-w-md` (448px)
- Dark mode only (hardcoded)
- Source-specific colors: NewsCard와 HeroNews에서 소스별 그라데이션
- Client components: `'use client'` for pages with hooks

## Path Alias

`@/*` → `./src/*` (tsconfig.json)
