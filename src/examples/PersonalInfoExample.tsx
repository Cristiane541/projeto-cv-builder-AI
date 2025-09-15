// Exemplo de uso do componente PersonalInfo
import React from 'react';
import PersonalInfo from '../components/Form/PersonalInfo';
import { useCVData } from '../hooks/useCVData';

const PersonalInfoExample: React.FC = () => {
  const { cvData, actions } = useCVData();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{
          fontSize: '2.2rem',
          marginBottom: 16,
          fontFamily: 'Montserrat, Arial, sans-serif',
        }}>
          Exemplo - Formulário de Dados Pessoais
        </h1>
        <p className="text-gray-600">
          Este é um exemplo de como usar o componente PersonalInfo com validação em tempo real.
        </p>
      </div>

      <PersonalInfo data={cvData.personal} actions={actions} />

      {/* Preview dos dados para demonstração */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Preview dos Dados (para demonstração)
        </h3>
        <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
          {JSON.stringify(cvData.personal, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default PersonalInfoExample;
