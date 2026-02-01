import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'AI Tech Brief',
  description: 'AI 기술 뉴스를 RSS로 수집하여 AI 요약과 함께 매일 브리핑으로 제공하는 모바일 퍼스트 웹앱',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Inline script to set theme before hydration (prevents flash)
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (theme === 'dark' || prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
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
