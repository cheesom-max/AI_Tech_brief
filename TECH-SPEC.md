# TECH-SPEC.md - AI Tech Brief

## 1. Project Scope

**AI 기술 뉴스를 RSS로 수집하여 AI 요약과 함께 매일 브리핑으로 제공하는 모바일 퍼스트 웹앱**

---

## 2. Tech Stack Decision

| Layer | Technology | 선정 이유 |
|-------|------------|----------|
| Frontend | Next.js 14 (App Router) | SSR/SSG 지원으로 SEO 최적화, React 기반 |
| Styling | Tailwind CSS | 제공된 디자인 시스템과 호환, 빠른 모바일 반응형 구현 |
| Backend | Next.js API Routes | 프론트엔드와 통합 배포, 별도 서버 불필요 |
| Database | SQLite (Turso) | 뉴스 아카이빙용 경량 DB, 서버리스 호환 |
| RSS Parsing | rss-parser | 널리 사용되는 안정적인 RSS 파싱 라이브러리 |
| AI Summary | OpenAI API (GPT-4o-mini) | 비용 효율적, 한국어 요약 품질 우수 |
| Scheduler | Vercel Cron | 매일 오전 9시 자동 수집, 인프라 관리 불필요 |
| Icons | Material Symbols Outlined | 요구사항에 명시된 아이콘 시스템 |

---

## 3. Project Structure Tree

```
ai-tech-brief/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── news/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── archive/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── cron/
│   │       │   └── collect/
│   │       │       └── route.ts
│   │       ├── news/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── archive/
│   │           └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── home/
│   │   │   ├── HeroNews.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   └── NewsList.tsx
│   │   ├── news/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsDetail.tsx
│   │   │   ├── AISummary.tsx
│   │   │   └── AIInsight.tsx
│   │   └── archive/
│   │       └── ArchiveTimeline.tsx
│   ├── lib/
│   │   ├── rss/
│   │   │   ├── parser.ts
│   │   │   └── sources.ts
│   │   ├── ai/
│   │   │   └── summarizer.ts
│   │   └── db/
│   │       ├── client.ts
│   │       ├── schema.ts
│   │       └── queries.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── public/
│   └── fonts/
├── .env.example
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

### 폴더/파일 역할 설명

| 경로 | 역할 |
|------|------|
| `src/app/` | Next.js App Router 페이지 및 API 라우트 |
| `src/app/page.tsx` | 홈 피드 페이지 (히어로 + 필터 + 뉴스 리스트) |
| `src/app/news/[id]/` | 뉴스 상세 페이지 (원문 + AI 요약 + 인사이트) |
| `src/app/archive/` | 브리핑 아카이브 페이지 (타임라인) |
| `src/app/api/cron/collect/` | 크론 트리거로 RSS 수집 및 AI 요약 생성 |
| `src/app/api/news/` | 뉴스 목록/상세 조회 API |
| `src/components/layout/` | 공통 레이아웃 컴포넌트 (헤더, 하단 네비, 테마 토글) |
| `src/components/home/` | 홈 피드 전용 컴포넌트 |
| `src/components/news/` | 뉴스 카드 및 상세 관련 컴포넌트 |
| `src/lib/rss/` | RSS 파싱 로직 및 소스 설정 |
| `src/lib/ai/` | OpenAI API를 통한 요약/인사이트 생성 |
| `src/lib/db/` | 데이터베이스 연결, 스키마, 쿼리 함수 |
| `src/types/` | TypeScript 타입 정의 |

---

## 4. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │
│  │  Home Feed  │  │ News Detail │  │      Archive Timeline       │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────────┬──────────────┘ │
└─────────┼────────────────┼────────────────────────┼─────────────────┘
          │                │                        │
          ▼                ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                        API Routes                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │ │
│  │  │ GET /api/news│  │GET /api/news/│  │  GET /api/archive    │  │ │
│  │  │              │  │    [id]      │  │                      │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     CRON JOB (매일 09:00 KST)                   │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │ │
│  │  │ RSS Parser  │ -> │ AI Summary  │ -> │   DB Storage        │ │ │
│  │  │             │    │ (OpenAI)    │    │                     │ │ │
│  │  └─────────────┘    └─────────────┘    └─────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
          │                      │                    │
          ▼                      ▼                    ▼
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────┐
│   RSS Sources   │    │   OpenAI API    │    │   SQLite (Turso)     │
│  - OpenAI Blog  │    │   GPT-4o-mini   │    │   - news             │
│  - DeepMind     │    │                 │    │   - briefings        │
│  - Anthropic    │    │                 │    │   - sources          │
│  - HuggingFace  │    │                 │    │                      │
│  - TechCrunch   │    │                 │    │                      │
│  - The Verge    │    │                 │    │                      │
│  - VentureBeat  │    │                 │    │                      │
│  - MIT Tech Rev │    │                 │    │                      │
└─────────────────┘    └─────────────────┘    └──────────────────────┘
```

---

## 5. File Specifications

### 5.1 Pages (src/app/)

#### `layout.tsx`
- **역할**: 루트 레이아웃, 테마 프로바이더, 폰트 설정
- **책임**:
  - Inter, Noto Sans KR 폰트 로드
  - 다크모드 컨텍스트 제공
  - 공통 메타데이터 설정

#### `page.tsx` (Home Feed)
- **역할**: 메인 홈 피드 페이지
- **책임**:
  - 오늘의 히어로 뉴스 표시
  - 카테고리 필터 상태 관리
  - 뉴스 리스트 렌더링

#### `news/[id]/page.tsx` (News Detail)
- **역할**: 뉴스 상세 페이지
- **책임**:
  - 원본 뉴스 내용 표시
  - AI 3줄 요약 표시
  - AI 기술 인사이트 표시
  - 원문 링크 제공

#### `archive/page.tsx` (Archive)
- **역할**: 브리핑 아카이브 페이지
- **책임**:
  - 날짜별 브리핑 타임라인 표시
  - 무한 스크롤 또는 페이지네이션

---

### 5.2 Components (src/components/)

#### Layout Components

| 파일 | 역할 | Props |
|------|------|-------|
| `Header.tsx` | 상단 헤더 (로고, 테마 토글) | - |
| `BottomNav.tsx` | 모바일 하단 네비게이션 | `currentPath: string` |
| `ThemeToggle.tsx` | 라이트/다크 모드 토글 버튼 | - |

#### Home Components

| 파일 | 역할 | Props |
|------|------|-------|
| `HeroNews.tsx` | 오늘의 주요 뉴스 히어로 카드 | `news: News` |
| `CategoryFilter.tsx` | 소스별 필터 버튼 그룹 | `selected: string[], onChange: fn` |
| `NewsList.tsx` | 뉴스 카드 리스트 | `news: News[], isLoading: boolean` |

#### News Components

| 파일 | 역할 | Props |
|------|------|-------|
| `NewsCard.tsx` | 개별 뉴스 카드 | `news: News` |
| `NewsDetail.tsx` | 뉴스 상세 내용 | `news: NewsWithDetail` |
| `AISummary.tsx` | AI 3줄 요약 섹션 | `summary: string[]` |
| `AIInsight.tsx` | AI 기술 인사이트 섹션 | `insight: string` |

#### Archive Components

| 파일 | 역할 | Props |
|------|------|-------|
| `ArchiveTimeline.tsx` | 날짜별 브리핑 타임라인 | `briefings: Briefing[]` |

---

### 5.3 API Routes (src/app/api/)

#### `cron/collect/route.ts`
- **역할**: 스케줄된 뉴스 수집 및 처리
- **트리거**: Vercel Cron (매일 09:00 KST)
- **처리 흐름**:
  1. 8개 RSS 소스에서 뉴스 수집
  2. 중복 제거 (URL 기준)
  3. 각 뉴스에 대해 AI 요약 생성
  4. 각 뉴스에 대해 AI 인사이트 생성
  5. 데이터베이스 저장
  6. 오늘의 브리핑 레코드 생성

#### `news/route.ts`
- **역할**: 뉴스 목록 조회
- **Method**: GET
- **Query Params**: `date`, `source`, `limit`, `offset`
- **Response**: `{ news: News[], total: number }`

#### `news/[id]/route.ts`
- **역할**: 뉴스 상세 조회
- **Method**: GET
- **Response**: `NewsWithDetail`

#### `archive/route.ts`
- **역할**: 브리핑 아카이브 조회
- **Method**: GET
- **Query Params**: `limit`, `offset`
- **Response**: `{ briefings: Briefing[], total: number }`

---

### 5.4 Library (src/lib/)

#### `rss/sources.ts`
- **역할**: RSS 소스 설정
- **내용**: 8개 소스의 URL, 이름, 카테고리 정의

```
RSS_SOURCES = [
  { id, name, url, category, icon }
]
```

#### `rss/parser.ts`
- **역할**: RSS 피드 파싱
- **함수**:
  - `fetchFeed(url: string): Promise<FeedItem[]>`
  - `fetchAllFeeds(): Promise<FeedItem[]>`
  - `deduplicateByUrl(items: FeedItem[]): FeedItem[]`

#### `ai/summarizer.ts`
- **역할**: AI 요약 및 인사이트 생성
- **함수**:
  - `generateSummary(content: string): Promise<string[]>` - 3줄 요약 반환
  - `generateInsight(content: string): Promise<string>` - 기술 인사이트 반환

#### `db/schema.ts`
- **역할**: 데이터베이스 스키마 정의

#### `db/client.ts`
- **역할**: 데이터베이스 연결 클라이언트

#### `db/queries.ts`
- **역할**: 데이터베이스 쿼리 함수
- **함수**:
  - `getNewsByDate(date: string): Promise<News[]>`
  - `getNewsById(id: string): Promise<NewsWithDetail>`
  - `getBriefings(limit: number, offset: number): Promise<Briefing[]>`
  - `saveNews(news: NewsInput): Promise<void>`
  - `saveBriefing(briefing: BriefingInput): Promise<void>`

---

## 6. Data Flow

### 6.1 뉴스 수집 플로우 (Cron Job)

```
[09:00 KST Cron Trigger]
         │
         ▼
┌─────────────────────┐
│ 1. RSS 피드 수집     │
│    - 8개 소스 병렬   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. 데이터 정제       │
│    - 중복 제거       │
│    - 필드 정규화     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. AI 처리          │
│    - 3줄 요약 생성   │
│    - 인사이트 생성   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. DB 저장          │
│    - news 테이블    │
│    - briefings 테이블│
└─────────────────────┘
```

### 6.2 홈 피드 조회 플로우

```
[User visits Home]
         │
         ▼
┌─────────────────────┐
│ 1. page.tsx 렌더링   │
│    (Server Component)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. DB에서 오늘 뉴스  │
│    조회              │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. HeroNews 선정    │
│    (조회수/최신순)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. UI 렌더링        │
│    - Hero Card      │
│    - Filter Chips   │
│    - News List      │
└─────────────────────┘
```

### 6.3 뉴스 상세 조회 플로우

```
[User clicks NewsCard]
         │
         ▼
┌─────────────────────┐
│ 1. /news/[id] 이동   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. DB에서 상세 조회  │
│    - 원문 내용       │
│    - AI 요약        │
│    - AI 인사이트    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. UI 렌더링        │
│    - NewsDetail     │
│    - AISummary      │
│    - AIInsight      │
└─────────────────────┘
```

---

## 7. API Contracts

### 7.1 GET /api/news

**Request**
```
GET /api/news?date=2024-01-15&source=openai&limit=20&offset=0
```

**Response**
```json
{
  "news": [
    {
      "id": "uuid",
      "title": "GPT-5 발표 임박",
      "source": "openai",
      "sourceName": "OpenAI Blog",
      "publishedAt": "2024-01-15T09:00:00Z",
      "thumbnailUrl": "https://...",
      "summary": ["요약1", "요약2", "요약3"]
    }
  ],
  "total": 45
}
```

### 7.2 GET /api/news/[id]

**Request**
```
GET /api/news/abc123
```

**Response**
```json
{
  "id": "abc123",
  "title": "GPT-5 발표 임박",
  "source": "openai",
  "sourceName": "OpenAI Blog",
  "publishedAt": "2024-01-15T09:00:00Z",
  "originalUrl": "https://openai.com/blog/...",
  "thumbnailUrl": "https://...",
  "content": "원문 내용...",
  "summary": ["요약1", "요약2", "요약3"],
  "insight": "기술적 인사이트 내용..."
}
```

### 7.3 GET /api/archive

**Request**
```
GET /api/archive?limit=10&offset=0
```

**Response**
```json
{
  "briefings": [
    {
      "id": "uuid",
      "date": "2024-01-15",
      "newsCount": 12,
      "topNews": {
        "id": "abc123",
        "title": "GPT-5 발표 임박"
      }
    }
  ],
  "total": 30
}
```

---

## 8. Database Schema

### news 테이블
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | UUID |
| title | TEXT | 뉴스 제목 |
| source | TEXT | 소스 ID (openai, deepmind, etc.) |
| original_url | TEXT (UNIQUE) | 원문 URL (중복 체크용) |
| thumbnail_url | TEXT | 썸네일 이미지 URL |
| content | TEXT | 원문 내용 |
| summary | TEXT | JSON 배열 (3줄 요약) |
| insight | TEXT | AI 기술 인사이트 |
| published_at | DATETIME | 원문 발행 시각 |
| created_at | DATETIME | 수집 시각 |

### briefings 테이블
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | UUID |
| date | DATE (UNIQUE) | 브리핑 날짜 |
| news_count | INTEGER | 해당일 뉴스 수 |
| top_news_id | TEXT (FK) | 대표 뉴스 ID |
| created_at | DATETIME | 생성 시각 |

### sources 테이블
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT (PK) | 소스 식별자 |
| name | TEXT | 소스 이름 |
| url | TEXT | RSS 피드 URL |
| category | TEXT | 카테고리 |
| is_active | BOOLEAN | 활성화 여부 |

---

## 9. Type Definitions (src/types/index.ts)

```typescript
// News Types
interface News {
  id: string;
  title: string;
  source: string;
  sourceName: string;
  publishedAt: string;
  thumbnailUrl: string | null;
  summary: string[];
}

interface NewsWithDetail extends News {
  originalUrl: string;
  content: string;
  insight: string;
}

// Briefing Types
interface Briefing {
  id: string;
  date: string;
  newsCount: number;
  topNews: {
    id: string;
    title: string;
  };
}

// RSS Types
interface RSSSource {
  id: string;
  name: string;
  url: string;
  category: 'company' | 'media';
  icon: string;
}

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
}

// API Response Types
interface NewsListResponse {
  news: News[];
  total: number;
}

interface ArchiveResponse {
  briefings: Briefing[];
  total: number;
}
```

---

## 10. Design System Tokens

### Colors
```css
/* Light Mode */
--color-primary: #4f46e5;        /* Indigo-600 */
--color-primary-alt: #2b4bee;    /* Alternative */
--color-background: #f6f6f8;
--color-surface: #ffffff;
--color-text-primary: #09090b;
--color-text-secondary: #71717a;

/* Dark Mode */
--color-primary: #818cf8;        /* Indigo-400 */
--color-background: #09090b;     /* Zinc-950 */
--color-background-alt: #101322;
--color-surface: #18181b;
--color-text-primary: #fafafa;
--color-text-secondary: #a1a1aa;
```

### Typography
```css
--font-primary: 'Inter', sans-serif;
--font-korean: 'Noto Sans KR', sans-serif;
--font-family: var(--font-primary), var(--font-korean);
```

### Breakpoints
```css
/* Mobile First */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;  /* max-width for mobile optimization */
--breakpoint-lg: 1024px;
```

---

## 11. Dependencies

### Production
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "tailwindcss": "^3.x",
  "rss-parser": "^3.x",
  "openai": "^4.x",
  "@libsql/client": "^0.x",
  "date-fns": "^3.x"
}
```

### Development
```json
{
  "typescript": "^5.x",
  "@types/node": "^20.x",
  "@types/react": "^18.x",
  "eslint": "^8.x",
  "eslint-config-next": "^14.x"
}
```

---

## 12. MVP Scope Boundary

### MVP에 포함 (Phase 1)
- [x] 8개 RSS 소스에서 뉴스 수집
- [x] AI 3줄 요약 생성
- [x] AI 기술 인사이트 생성
- [x] 홈 피드 (히어로 + 필터 + 리스트)
- [x] 뉴스 상세 페이지
- [x] 브리핑 아카이브 (기본 타임라인)
- [x] 다크 모드 지원
- [x] 모바일 최적화
- [x] 매일 09:00 KST 자동 수집

### MVP에서 제외 (Phase 2+)
- [ ] 사용자 인증/로그인
- [ ] 북마크/저장 기능
- [ ] 푸시 알림
- [ ] 검색 기능
- [ ] 댓글/토론
- [ ] 소셜 공유
- [ ] 개인화 추천
- [ ] 다국어 지원
- [ ] PWA 오프라인 지원
- [ ] 뉴스 원문 전체 크롤링 (RSS 제공 내용만 사용)

---

## 13. Configuration Files

### vercel.json
```json
{
  "crons": [
    {
      "path": "/api/cron/collect",
      "schedule": "0 0 * * *"
    }
  ]
}
```
> Note: 00:00 UTC = 09:00 KST

### .env.example
```
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
OPENAI_API_KEY=sk-...
CRON_SECRET=...
```

---

## 14. Implementation Notes

### RSS 소스 URL 참고
| Source | RSS URL |
|--------|---------|
| OpenAI Blog | https://openai.com/blog/rss.xml |
| Google DeepMind | https://deepmind.google/blog/rss.xml |
| Anthropic | https://www.anthropic.com/rss.xml |
| Hugging Face | https://huggingface.co/blog/feed.xml |
| TechCrunch | https://techcrunch.com/feed/ |
| The Verge | https://www.theverge.com/rss/index.xml |
| VentureBeat | https://venturebeat.com/feed/ |
| MIT Tech Review | https://www.technologyreview.com/feed/ |

> RSS URL은 변경될 수 있으므로 구현 시 확인 필요

### AI Prompt Guidelines

**3줄 요약 프롬프트 구조**
- 핵심 내용을 3개의 간결한 문장으로 요약
- 각 문장은 50자 이내
- 한국어로 작성

**기술 인사이트 프롬프트 구조**
- 해당 기술/발표의 의미와 영향 분석
- 관련 기술 트렌드와의 연결
- 200자 이내 한국어로 작성

---

*Last Updated: 2024-01*
*Version: 1.0.0*
