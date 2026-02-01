'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Sync state with actual DOM class (set by blocking script)
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDark(newIsDark);
  };

  // Don't render button until we know the current theme (prevents hydration mismatch)
  if (isDark === null) {
    return (
      <div className="p-2 w-10 h-10" aria-hidden="true">
        <span className="material-symbols-outlined text-text-secondary opacity-0">
          light_mode
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-text-secondary/10 transition-colors active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="material-symbols-outlined text-text-secondary">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
