// src/components/DarkModeToggle.tsx
'use client';

import { useTheme } from 'next-themes';

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="text-xs px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
