// src/types/pdf.types.ts
export interface PDFTheme {
  name: string;
  colors: {
    primary: string;        // Cor principal (cabeçalho)
    secondary: string;      // Cor secundária (fundos)
    text: string;          // Cor do texto
    background: string;     // Cor de fundo geral
    accent: string;        // Cor de destaque (gradientes)
    headerText: string;    // Cor do texto no cabeçalho
    sectionBg: string;     // Cor de fundo das seções
  };
  fonts: {
    primary: string;
    secondary: string;
  };
}

export interface CustomPDFTheme {
  name: string;
  headerColor: string;     // Cor do cabeçalho (escolhida pelo usuário)
  accentColor: string;     // Cor dos destaques
  textColor: string;       // Cor do texto
  backgroundColor: string; // Cor de fundo
}

export interface PDFExportOptions {
  theme?: PDFTheme;
  filename?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number; // 0.1 to 1.0
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface PDFExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  size?: string; // tamanho do arquivo gerado
}

export interface PDFGenerationConfig {
  element: HTMLElement;
  options: PDFExportOptions;
  cvData: {
    name: string;
    email: string;
    phone: string;
  };
}

// Temas predefinidos
export const PDF_THEMES: Record<string, PDFTheme> = {
  professional: {
    name: 'Profissional',
    colors: {
      primary: '#1e40af',      // Azul corporativo
      secondary: '#f8fafc',    // Cinza muito claro
      text: '#1f2937',         // Cinza escuro
      background: '#ffffff',   // Branco
      accent: '#2563eb',       // Azul médio
      headerText: '#ffffff',   // Texto branco no header
      sectionBg: '#eff6ff'     // Azul corporativo claro
    },
    fonts: {
      primary: 'system-ui',
      secondary: 'system-ui'
    }
  },
  modern: {
    name: 'Moderno',
    colors: {
      primary: '#1e293b',      // Azul escuro
      secondary: '#f1f5f9',    // Azul muito claro
      text: '#0f172a',         // Preto
      background: '#ffffff',   // Branco
      accent: '#0ea5e9',       // Azul claro
      headerText: '#ffffff',   // Texto branco no header
      sectionBg: '#f0f9ff'     // Azul muito claro
    },
    fonts: {
      primary: 'system-ui',
      secondary: 'system-ui'
    }
  },
  elegant: {
    name: 'Elegante',
    colors: {
      primary: '#6366f1',      // Índigo sofisticado
      secondary: '#f8fafc',    // Cinza pérola
      text: '#1e293b',         // Cinza carvão
      background: '#ffffff',   // Branco puro
      accent: '#8b5cf6',       // Violeta elegante
      headerText: '#ffffff',   // Texto branco no header
      sectionBg: '#f1f5f9'     // Cinza azulado suave
    },
    fonts: {
      primary: 'system-ui',
      secondary: 'system-ui'
    }
  }
};

// Cores predefinidas para seleção rápida
export const PRESET_COLORS = [
  { name: 'Verde Profissional', value: '#6b7f5e' },
  { name: 'Azul Corporativo', value: '#1e40af' },
  { name: 'Roxo Criativo', value: '#7c3aed' },
  { name: 'Verde Moderno', value: '#059669' },
  { name: 'Laranja Vibrante', value: '#ea580c' },
  { name: 'Rosa Elegante', value: '#db2777' },
  { name: 'Azul Claro', value: '#0ea5e9' },
  { name: 'Vermelho', value: '#dc2626' },
  { name: 'Cinza Escuro', value: '#374151' },
  { name: 'Preto', value: '#111827' }
];
