import { Metadata } from 'next';
import { getBriefings, getTotalBriefingsCount } from '@/lib/db/queries';
import ArchiveContent from '@/components/archive/ArchiveContent';

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archive | AI Tech Brief',
  description: 'Browse past AI news briefings. Access historical AI and tech news summaries organized by date.',
  openGraph: {
    title: 'Briefing Archive | AI Tech Brief',
    description: 'Browse past AI news briefings organized by date.',
    type: 'website',
    siteName: 'AI Tech Brief',
  },
};

// Server Component - initial data fetched at request time
export default async function ArchivePage() {
  // Fetch initial briefings server-side
  const [initialBriefings, total] = await Promise.all([
    getBriefings(10, 0),
    getTotalBriefingsCount(),
  ]);

  return <ArchiveContent initialBriefings={initialBriefings} initialTotal={total} />;
}
