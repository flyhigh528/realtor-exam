'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/practice', label: '연습' },
  { href: '/wrong-answers', label: '오답' },
  { href: '/bookmarks', label: '북마크' },
  { href: '/history', label: '성적' },
];

export default function Header() {
  const pathname = usePathname();
  const isExamPage = pathname?.includes('/test');
  const [menuOpen, setMenuOpen] = useState(false);

  if (isExamPage) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
          다혜&apos;s중개사패스
        </Link>

        {/* 데스크톱 네비 */}
        <nav className="hidden sm:flex gap-4 text-sm">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                pathname === item.href
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden w-8 h-8 flex items-center justify-center text-gray-600"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <nav className="max-w-lg mx-auto px-4 py-2 flex flex-col">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 text-sm transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
