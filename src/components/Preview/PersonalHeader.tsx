import type { FC } from "react";
import type { PersonalInfo } from "../../types/cv.types";
import type { PDFTheme } from "../../types/pdf.types";
import { AIEnhanceButton } from "../Form/AIEnhanceButton";

type Props = {
  personal: PersonalInfo;
  onImproveSummary?: (newText: string) => void; // usa actions.updatePersonalInfo
  previewTheme?: PDFTheme | null; // Tema para preview em tempo real
};

export const PersonalHeader: FC<Props> = ({ personal, onImproveSummary, previewTheme }) => {
  const { name, email, phone, linkedin, summary } = personal;

  // Determina a cor do header baseada no tema de preview
  const headerColor = previewTheme ? previewTheme.colors.primary : '#6b7f5e';

  return (
    <div>
      {/* Header com fundo dinâmico baseado no tema */}
      <div style={{backgroundColor: headerColor, padding: '40px 60px', color: 'white', marginLeft: '-40px', marginRight: '-40px', marginTop: '0px', marginBottom: '32px'}}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 700,
          marginBottom: 16,
          textAlign: 'center',
          fontFamily: 'Montserrat, Arial, sans-serif',
        }}>
          {name || "Seu Nome"}
        </h1>
        <div style={{height: '1px', backgroundColor: 'rgba(255,255,255,0.7)', margin: '20px 0', width: '100%', display: 'block', boxShadow: '0 0 1px rgba(255,255,255,0.3)'}}></div>
        <div style={{textAlign: 'center', fontSize: '14px', lineHeight: '1.6'}}>
          <div>{email || "seu.email@exemplo.com"}</div>
          <div>{phone || "(11) 99999-9999"}</div>
          {linkedin && <div>{linkedin}</div>}
        </div>
      </div>

      {/* Resumo Profissional */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-1 h-10 rounded-full"
            style={{
              background: previewTheme 
                ? `linear-gradient(to bottom, ${previewTheme.colors.accent}, ${previewTheme.colors.primary})`
                : '#6b7f5e' // Cor sólida segura para html2canvas
            }}
          ></div>
          <h2 
            className="text-3xl font-light tracking-wide"
            style={{
              color: previewTheme ? previewTheme.colors.accent : '#6b7f5e'
            }}
          >
            Resumo Profissional
          </h2>
        </div>
        
        <div 
          className="rounded-xl shadow-md p-8"
          style={{
            background: previewTheme 
              ? previewTheme.colors.sectionBg // Fundo neutro das seções
              : '#f8fafc' // Fundo neutro
          }}
        >
          <p className="text-gray-800 leading-loose text-justify font-normal text-lg tracking-wide">
            {summary || "Descreva aqui seu perfil profissional, objetivos de carreira e principais qualificações que destacam seu potencial no mercado de trabalho."}
          </p>
        </div>

        {onImproveSummary && (
          <div className="mt-3">
            <AIEnhanceButton
              field="summary"
              text={summary || ""}
              onEnhanced={(t) => onImproveSummary(t)}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
