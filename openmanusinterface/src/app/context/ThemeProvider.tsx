'use client';

import React from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('light');

  React.useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    darkModeQuery.addEventListener('change', handler);

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }

    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}