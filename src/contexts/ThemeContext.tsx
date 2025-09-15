// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, type FC, type ReactNode } from 'react';
import type { PDFTheme } from '../types/pdf.types';
import { PDF_THEMES } from '../types/pdf.types';

interface ThemeContextType {
  // Estado do tema para preview
  previewTheme: PDFTheme | null;
  setPreviewTheme: (theme: PDFTheme | null) => void;
  
  // Métodos utilitários
  applyThemeByKey: (themeKey: string) => void;
  applyCustomTheme: (customTheme: PDFTheme) => void;
  clearPreviewTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  selectedThemeKey?: string | null;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, selectedThemeKey }) => {
  // previewTheme pode ser alterado instantaneamente pelo usuário
  // previewTheme sempre reflete o tema salvo no CV
  const previewTheme = (typeof selectedThemeKey === 'string' && selectedThemeKey in PDF_THEMES)
    ? PDF_THEMES[selectedThemeKey]
    : null;

  // As funções abaixo não mudam o preview local
  const setPreviewTheme = () => {};
  const applyThemeByKey = () => {};
  const applyCustomTheme = () => {};
  const clearPreviewTheme = () => {};

  return (
    <ThemeContext.Provider value={{
      previewTheme,
      setPreviewTheme,
      applyThemeByKey,
      applyCustomTheme,
      clearPreviewTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
