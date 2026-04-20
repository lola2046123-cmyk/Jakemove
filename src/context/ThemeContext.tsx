import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { lightTokens, darkTokens } from '../theme/tokens';
import type { Tokens } from '../theme/tokens';
import type { ThemeMode } from '../types';

interface ThemeContextValue {
  mode: ThemeMode;
  tokens: Tokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  tokens: lightTokens,
  toggle: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const tokens = useMemo(() => (mode === 'light' ? lightTokens : darkTokens), [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.backgroundColor = tokens.bgPage;
    document.body.style.color = tokens.textPrimary;
  }, [mode, tokens]);

  const toggle = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, tokens, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
