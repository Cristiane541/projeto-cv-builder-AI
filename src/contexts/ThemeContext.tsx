// src/contexts/ThemeContext.tsx
import type { FC, ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
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

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [previewTheme, setPreviewTheme] = useState<PDFTheme | null>(null);

  const applyThemeByKey = (themeKey: string) => {
    if (themeKey === 'default') {
      setPreviewTheme(null); // Tema padrão = sem tema aplicado
    } else {
      const theme = PDF_THEMES[themeKey];
      if (theme) {
        setPreviewTheme(theme);
      }
    }
  };

  const applyCustomTheme = (customTheme: PDFTheme) => {
    setPreviewTheme(customTheme);
  };

  const clearPreviewTheme = () => {
    setPreviewTheme(null);
  };

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
