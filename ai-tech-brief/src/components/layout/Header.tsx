'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-text-secondary/10">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            auto_awesome
          </span>
          <h1 className="text-lg font-semibold text-text-primary">
            AI Tech Brief
          </h1>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
