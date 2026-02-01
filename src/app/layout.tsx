import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: {
    default: 'AI Tech Brief - AI 뉴스 브리핑',
    template: '%s | AI Tech Brief',
  },
  description: 'AI 기술 뉴스를 RSS로 수집하여 AI 요약과 함께 매일 브리핑으로 제공하는 모바일 퍼스트 웹앱. OpenAI, Google, Meta 등 주요 AI 기업의 최신 소식을 한눈에.',
  keywords: ['AI', '인공지능', '뉴스', '브리핑', 'OpenAI', 'Google AI', 'ChatGPT', '머신러닝', '딥러닝', 'AI 뉴스'],
  authors: [{ name: 'AI Tech Brief' }],
  creator: 'AI Tech Brief',
  publisher: 'AI Tech Brief',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://ai-tech-brief.vercel.app'),
  openGraph: {
    title: 'AI Tech Brief - AI 뉴스 브리핑',
    description: 'AI 기술 뉴스를 AI 요약과 함께 매일 브리핑으로 제공합니다.',
    type: 'website',
    siteName: 'AI Tech Brief',
    locale: 'ko_KR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Tech Brief - Daily AI News Briefing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tech Brief - AI 뉴스 브리핑',
    description: 'AI 기술 뉴스를 AI 요약과 함께 매일 브리핑으로 제공합니다.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Inline script to set theme before hydration (prevents flash)
// Server renders with 'dark' class by default, script removes it if user prefers light
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      }
      // If theme is 'dark' or not set, keep the default 'dark' class from server
    } catch (e) {
      // Keep dark mode on error
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        {/* Theme script - must run before hydration */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="google-site-verification" content="SLb2alCB2Rw__kwtk1doAZENvubcsvtCTfBpIAIiazE" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QNK26527EH" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QNK26527EH');
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9086353762859364"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-text-primary min-h-screen">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 px-4 py-6 pb-20">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
