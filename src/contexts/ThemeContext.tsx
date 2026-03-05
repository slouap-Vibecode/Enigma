'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeName } from '@/types/theme';
import { themes, defaultTheme } from '@/lib/themes';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: { name: ThemeName; displayName: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'enigma_theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  // Charger le thème depuis localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    localStorage.setItem(THEME_STORAGE_KEY, newThemeName);
  };

  const theme = themes[themeName] || defaultTheme;

  const availableThemes = Object.values(themes).map(t => ({
    name: t.name as ThemeName,
    displayName: t.displayName
  }));

  // Appliquer les variables CSS pour le thème
  useEffect(() => {
    const root = document.documentElement;

    // Appliquer les couleurs
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-background-secondary', theme.colors.backgroundSecondary);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-accent-hover', theme.colors.accentHover);
    root.style.setProperty('--theme-success', theme.colors.success);
    root.style.setProperty('--theme-error', theme.colors.error);
    root.style.setProperty('--theme-warning', theme.colors.warning);
    root.style.setProperty('--theme-border', theme.colors.border);
    root.style.setProperty('--theme-button-bg', theme.colors.buttonBackground);
    root.style.setProperty('--theme-button-text', theme.colors.buttonText);
    root.style.setProperty('--theme-button-hover-bg', theme.colors.buttonHoverBackground);
    root.style.setProperty('--theme-button-hover-text', theme.colors.buttonHoverText);
    root.style.setProperty('--theme-input-bg', theme.colors.inputBackground);
    root.style.setProperty('--theme-input-border', theme.colors.inputBorder);
    root.style.setProperty('--theme-reward-bg', theme.colors.rewardBackground);
    root.style.setProperty('--theme-reward-border', theme.colors.rewardBorder);

    // Appliquer les fonts
    root.style.setProperty('--theme-font-primary', theme.fonts.primary);
    root.style.setProperty('--theme-font-secondary', theme.fonts.secondary || theme.fonts.primary);

    // Appliquer les shadows
    root.style.setProperty('--theme-shadow-card', theme.shadows.card);
    root.style.setProperty('--theme-shadow-button', theme.shadows.button);
    root.style.setProperty('--theme-shadow-input', theme.shadows.input);

    // Appliquer les border radius
    root.style.setProperty('--theme-radius-small', theme.borderRadius.small);
    root.style.setProperty('--theme-radius-medium', theme.borderRadius.medium);
    root.style.setProperty('--theme-radius-large', theme.borderRadius.large);

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}