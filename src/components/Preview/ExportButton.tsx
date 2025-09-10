// src/components/Preview/ExportButton.tsx
import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PDFService } from '../../services/pdfService';
import { PDF_THEMES, PRESET_COLORS } from '../../types/pdf.types';
import type { PDFExportOptions, PDFTheme } from '../../types/pdf.types';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';

interface ExportButtonProps {
  targetElementId?: string; // ID do elemento a ser exportado
  cvData: {
    name: string;
    email: string;
    phone: string;
  };
  className?: string;
}

export const ExportButton: FC<ExportButtonProps> = ({ 
  targetElementId = 'cv-preview', 
  cvData,
  className = ''
}) => {
  const { applyThemeByKey, applyCustomTheme, clearPreviewTheme } = useTheme();
  
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [customFilename, setCustomFilename] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Estados para personalização de cores
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [customHeaderColor, setCustomHeaderColor] = useState('#6b7f5e');
  const [customAccentColor, setCustomAccentColor] = useState('#3b82f6');

  // Aplica o tema automaticamente quando o usuário seleciona
  useEffect(() => {
    if (!useCustomColors) {
      // Aplica tema predefinido
      applyThemeByKey(selectedTheme);
    } else {
      // Aplica tema personalizado
      // Função para gerar versão clara da cor
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      
      const headerLightColor = hexToRgba(customHeaderColor, 0.2); // 20% de transparência - mais visível
      const accentLightColor = hexToRgba(customAccentColor, 0.15); // 15% de transparência - mais visível
      
      const customTheme: PDFTheme = {
        name: 'Personalizado',
        colors: {
          primary: customHeaderColor,        // Cor do header
          secondary: '#f8fafc',             // Cor neutra para fundos secundários
          text: '#1f2937',                  // Cor do texto
          background: '#ffffff',            // Fundo branco
          accent: customAccentColor,        // Cor de destaque (títulos das seções)
          headerText: '#ffffff',            // Texto branco no header
          sectionBg: '#f8fafc'              // Fundo neutro para todas as seções
        },
        fonts: {
          primary: 'system-ui',
          secondary: 'system-ui'
        }
      };
      applyCustomTheme(customTheme);
    }
  }, [selectedTheme, useCustomColors, customHeaderColor, customAccentColor, applyThemeByKey, applyCustomTheme]);

  // Nota: Não limpamos o tema automaticamente para manter o preview ativo

  const handleExport = async (options: PDFExportOptions = {}) => {
    try {
      setIsExporting(true);
      setMessage(null);

      // Encontra o elemento a ser exportado
      const targetElement = document.getElementById(targetElementId);
      if (!targetElement) {
        throw new Error(`Elemento com ID "${targetElementId}" não encontrado`);
      }

      console.log('🔍 ELEMENTO TARGET ENCONTRADO:', targetElement);
      console.log('🔍 ID DO ELEMENTO:', targetElementId);
      console.log('🔍 CONTEÚDO DO ELEMENTO:', targetElement.innerHTML.slice(0, 500) + '...');
      console.log('🔍 TAMANHO DO ELEMENTO:', targetElement.offsetWidth, 'x', targetElement.offsetHeight);
      
      // Verifica se o PersonalHeader está presente
      const personalHeader = targetElement.querySelector('h1');
      console.log('🔍 H1 (NOME) ENCONTRADO:', personalHeader);
      console.log('🔍 TEXTO DO H1:', personalHeader?.textContent);

      // Valida o elemento
      if (!PDFService.validateElement(targetElement)) {
        throw new Error('Elemento não é válido para exportação');
      }

      // Configurações de exportação
      let finalTheme: PDFTheme | undefined;
      
      if (useCustomColors) {
        // Cria tema personalizado
        finalTheme = {
          name: 'Personalizado',
          colors: {
            primary: customHeaderColor,
            secondary: '#f8f9fa',
            text: '#1f2937',
            background: '#ffffff',
            accent: customAccentColor,
            headerText: '#ffffff',
            sectionBg: customAccentColor + '10' // 10% de opacidade
          },
          fonts: {
            primary: 'system-ui',
            secondary: 'system-ui'
          }
        };
      } else if (selectedTheme !== 'default') {
        finalTheme = PDF_THEMES[selectedTheme];
      }

      const exportOptions: PDFExportOptions = {
        theme: finalTheme,
        filename: customFilename || undefined,
        ...options
      };

      console.log('🎨 Cores personalizadas:', useCustomColors);
      console.log('🎨 Tema final:', finalTheme);
      console.log('🎨 Cor do cabeçalho escolhida:', customHeaderColor);
      console.log('🎨 Cor de destaque escolhida:', customAccentColor);

      // Exporta para PDF
      const result = await PDFService.exportToPDF({
        element: targetElement,
        cvData,
        options: exportOptions
      });

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✅ PDF exportado: ${result.filename} (${result.size || 'tamanho estimado'})`
        });
        setShowOptions(false);
      } else {
        throw new Error(result.error || 'Erro desconhecido na exportação');
      }

    } catch (error) {
      console.error('Erro na exportação:', error);
      setMessage({
        type: 'error',
        text: `❌ Erro: ${error instanceof Error ? error.message : 'Falha na exportação'}`
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = () => {
    handleExport();
  };

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 5000);
  };

  if (message) {
    clearMessage();
  }

  return (
    <div className={`relative ${className}`}>
      {/* Botão principal - mesmo estilo do Config */}
      <button
        onClick={handleQuickExport}
        disabled={isExporting}
        title="Exportar PDF"
        style={{
          padding: "8px 12px",
          background: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: 9999,
          boxShadow: "0 6px 18px rgba(0,0,0,.15)",
          cursor: isExporting ? "not-allowed" : "pointer",
          fontSize: 14,
          opacity: isExporting ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isExporting) {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.borderColor = "#9ca3af";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,.2)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isExporting) {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,.15)";
            e.currentTarget.style.transform = "translateY(0px)";
          }
        }}
      >
        {isExporting ? (
          <>
            <LoadingSpinner size={16} />
            <span>Gerando...</span>
          </>
        ) : (
          <>
            📄 Exportar PDF
          </>
        )}
      </button>

      {/* Botão de opções - mesmo estilo */}
      {!isExporting && (
        <button
          onClick={() => setShowOptions(!showOptions)}
          title="Opções de exportação"
          style={{
            position: "absolute",
            top: 0,
            right: -32,
            padding: "8px 10px",
            background: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: 9999,
            boxShadow: "0 6px 18px rgba(0,0,0,.15)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.borderColor = "#9ca3af";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,.2)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,.15)";
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          ⋮
        </button>
      )}

      {/* Modal de opções - mesmo estilo do Config */}
      {showOptions && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={() => setShowOptions(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.4)",
            }}
          />
          <div
            ref={dropdownRef}
            style={{
              position: "relative",
              background: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: 12,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)",
              padding: 24,
              width: 400,
              maxWidth: "90vw",
            }}
          >
            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              color: "#111827", 
              marginBottom: 16 
            }}>
              📄 Opções de Exportação PDF
            </h3>
            
            {/* Opções de tema */}
            <div style={{ marginBottom: 16 }}>
              {/* Opção: Temas Predefinidos */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="colorMode"
                    checked={!useCustomColors}
                    onChange={() => setUseCustomColors(false)}
                  />
                  <span>📋 Usar temas predefinidos</span>
                </label>
              </div>
              
              {!useCustomColors && (
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 14,
                    background: "#ffffff",
                    marginBottom: 12
                  }}
                >
                  <option value="default">🔵 Padrão • Mantém cores originais</option>
                  <option value="professional">💼 Profissional • Azul corporativo elegante</option>
                  <option value="modern">🚀 Moderno • Azul escuro minimalista</option>
                  <option value="elegant">💎 Elegante • Índigo sofisticado</option>
                </select>
              )}
              
              {/* Opção: Cores Personalizadas */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="colorMode"
                    checked={useCustomColors}
                    onChange={() => setUseCustomColors(true)}
                  />
                  <span>🎨 Personalizar cores</span>
                </label>
              </div>
            </div>

            {/* Seletores de cores personalizadas */}
            {useCustomColors && (
              <div style={{ 
                marginBottom: 16, 
                padding: 16, 
                background: "#f9fafb", 
                borderRadius: 8, 
                border: "1px solid #e5e7eb" 
              }}>
                {/* Cor do cabeçalho */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ 
                    display: "block", 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: "#374151", 
                    marginBottom: 12 
                  }}>
                    🎯 Cor do Cabeçalho
                  </label>
                  
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    {/* Color Picker Avançado */}
                    <div style={{ flex: 1 }}>
                      <HexColorPicker 
                        color={customHeaderColor} 
                        onChange={setCustomHeaderColor}
                        style={{ width: "100%", height: "120px" }}
                      />
                    </div>
                    
                    {/* Valor hex e cores rápidas */}
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={customHeaderColor}
                        onChange={(e) => setCustomHeaderColor(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 14,
                          fontFamily: "monospace",
                          marginBottom: 8
                        }}
                        placeholder="#000000"
                      />
                      
                      {/* Cores rápidas */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                        {PRESET_COLORS.slice(0, 6).map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setCustomHeaderColor(color.value)}
                            title={color.name}
                            style={{
                              width: "100%",
                              height: 28,
                              borderRadius: 4,
                              border: customHeaderColor === color.value ? "2px solid #000" : "1px solid #ccc",
                              background: color.value,
                              cursor: "pointer"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cor de destaque */}
                <div>
                  <label style={{ 
                    display: "block", 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: "#374151", 
                    marginBottom: 12 
                  }}>
                    ✨ Cor de Destaque
                  </label>
                  
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    {/* Color Picker Avançado */}
                    <div style={{ flex: 1 }}>
                      <HexColorPicker 
                        color={customAccentColor} 
                        onChange={setCustomAccentColor}
                        style={{ width: "100%", height: "120px" }}
                      />
                    </div>
                    
                    {/* Valor hex e cores rápidas */}
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={customAccentColor}
                        onChange={(e) => setCustomAccentColor(e.target.value)}
                        style={{
                          width: "100%",
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 14,
                          fontFamily: "monospace",
                          marginBottom: 8
                        }}
                        placeholder="#000000"
                      />
                      
                      {/* Cores rápidas */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                        {PRESET_COLORS.slice(6).map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setCustomAccentColor(color.value)}
                            title={color.name}
                            style={{
                              width: "100%",
                              height: 28,
                              borderRadius: 4,
                              border: customAccentColor === color.value ? "2px solid #000" : "1px solid #ccc",
                              background: color.value,
                              cursor: "pointer"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview das cores selecionadas */}
            {useCustomColors && (
              <div style={{ 
                marginBottom: 16, 
                padding: 12, 
                background: "#ffffff", 
                borderRadius: 8, 
                border: "1px solid #e5e7eb" 
              }}>
                <label style={{ 
                  display: "block", 
                  fontSize: 13, 
                  fontWeight: 500, 
                  color: "#374151", 
                  marginBottom: 8 
                }}>
                  👁️ Preview das Cores:
                </label>
                
                <div style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: 6, 
                  overflow: "hidden",
                  fontSize: 12
                }}>
                  {/* Simulação do cabeçalho */}
                  <div style={{ 
                    background: customHeaderColor, 
                    color: "#ffffff", 
                    padding: "12px 16px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>Seu Nome Aqui</div>
                    <div style={{ opacity: 0.9 }}>seu.email@exemplo.com</div>
                  </div>
                  
                  {/* Simulação do conteúdo */}
                  <div style={{ 
                    background: "#ffffff", 
                    padding: "12px 16px" 
                  }}>
                    <div style={{ 
                      color: customAccentColor, 
                      fontWeight: "bold", 
                      marginBottom: 6,
                      borderBottom: `2px solid ${customAccentColor}20`,
                      paddingBottom: 4
                    }}>
                      Resumo Profissional
                    </div>
                    <div style={{ 
                      background: `${customAccentColor}10`, 
                      padding: 8, 
                      borderRadius: 4,
                      color: "#374151"
                    }}>
                      Exemplo de seção com cor de destaque
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nome do arquivo */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ 
                display: "block", 
                fontSize: 14, 
                fontWeight: 500, 
                color: "#374151", 
                marginBottom: 8 
              }}>
                📝 Nome do arquivo (opcional):
              </label>
              <input
                type="text"
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder="curriculo-personalizado"
                style={{
                  width: "100%",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 14,
                  background: "#ffffff",
                }}
              />
              <p style={{ 
                fontSize: 12, 
                color: "#6b7280", 
                marginTop: 4 
              }}>
                💡 Deixe vazio para gerar automaticamente
              </p>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => handleExport()}
                disabled={isExporting}
                style={{
                  flex: 1,
                  background: isExporting ? "#9ca3af" : "#3b82f6",
                  color: "#ffffff",
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: isExporting ? "not-allowed" : "pointer",
                  opacity: isExporting ? 0.6 : 1,
                }}
              >
                {isExporting ? '⏳ Exportando...' : '🚀 Exportar com Opções'}
              </button>
              <button
                onClick={() => setShowOptions(false)}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #d1d5db",
                  background: "#ffffff",
                  color: "#374151",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de feedback - estilo Config */}
      {message && (
        <div 
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 8,
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
            zIndex: 50,
            background: message.type === 'success' ? '#dcfce7' : '#fecaca',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: message.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fca5a5',
          }}
        >
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}
    </div>
  );
};
