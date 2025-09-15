// Componente para seleção de tema
import * as React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useCVData } from '../../contexts/CVDataContext';
import { PDF_THEMES } from '../../types/pdf.types';

export const ThemeSelector: React.FC = () => {
  const { previewTheme, applyThemeByKey, clearPreviewTheme } = useTheme();
  const { setSelectedThemeKey } = useCVData();

  return (
  <div style={{ display: 'flex', gap: 16, margin: '24px 0 24px 0', padding: '0 24px', justifyContent: 'center' }}>
      {Object.entries(PDF_THEMES).map(([key, theme]) => (
        <button
          key={key}
          style={{
            background: previewTheme === theme ? theme.colors.accent : theme.colors.primary,
            color: '#fff',
            fontFamily: theme.fonts.primary,
            padding: '12px 20px',
            borderRadius: 8,
            border: previewTheme === theme ? '2px solid #0073b1' : '1px solid #e5e7eb',
            minWidth: 120,
            fontWeight: 'bold',
            boxShadow: previewTheme === theme ? '0 2px 8px #0073b1' : '0 1px 4px #e5e7eb',
            transition: 'all 0.2s',
            cursor: 'pointer',
            outline: previewTheme === theme ? '2px solid #0073b1' : 'none',
          }}
          onClick={() => {
            setSelectedThemeKey(key);
            console.log('Tema selecionado:', key);
          }}
        >
          {theme.name}
        </button>
      ))}
      <button
        style={{
          background: !previewTheme ? '#0073b1' : '#fff',
          color: !previewTheme ? '#fff' : '#222',
          fontFamily: 'Arial',
          padding: '12px 20px',
          borderRadius: 8,
          border: !previewTheme ? '2px solid #0073b1' : '1px solid #e5e7eb',
          minWidth: 120,
          fontWeight: 'bold',
          boxShadow: !previewTheme ? '0 2px 8px #0073b1' : '0 1px 4px #e5e7eb',
          transition: 'all 0.2s',
          cursor: 'pointer',
          outline: !previewTheme ? '2px solid #0073b1' : 'none',
        }}
        onClick={() => {
          setSelectedThemeKey(null);
          console.log('Tema selecionado: padrão');
        }}
      >
        Padrão
      </button>
    </div>
  );
};
