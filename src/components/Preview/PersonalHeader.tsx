import type { FC } from "react";
import type { PersonalInfo } from "../../types/cv.types";
import { AIEnhanceButton } from "../Form/AIEnhanceButton";

type Props = {
  personal: PersonalInfo;
  onImproveSummary?: (newText: string) => void; // usa actions.updatePersonalInfo
};

export const PersonalHeader: FC<Props> = ({ personal, onImproveSummary }) => {
  const { name, email, phone, linkedin, summary } = personal;

  return (
    <div>
      {/* Header com fundo verde */}
      <div style={{backgroundColor: '#6b7f5e', padding: '40px 60px', color: 'white', marginLeft: '-40px', marginRight: '-40px', marginTop: '-40px', marginBottom: '32px'}}>
        <h1 style={{fontSize: '36px', fontWeight: '300', marginBottom: '8px', textAlign: 'center'}}>
          {name || "Seu Nome"}
        </h1>
        <div style={{height: '1px', backgroundColor: 'rgba(255,255,255,0.3)', margin: '20px 0'}}></div>
        <div style={{textAlign: 'center', fontSize: '14px', lineHeight: '1.6'}}>
          <div>{email || "seu.email@exemplo.com"}</div>
          <div>{phone || "(11) 99999-9999"}</div>
          {linkedin && <div>{linkedin}</div>}
        </div>
      </div>

      {/* Resumo Profissional */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-light text-gray-800 tracking-wide">
            Resumo Profissional
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8">
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
