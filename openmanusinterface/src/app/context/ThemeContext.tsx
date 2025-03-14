'use client';

import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultContext: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}