'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/archive', icon: 'archive', label: 'Archive' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-text-secondary/10">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
