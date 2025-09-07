// Versão simplificada para teste - PersonalInfo
import React from 'react';
import { PersonalInfo as PersonalInfoType, CVDataActions } from '../../types/cv.types';

interface PersonalInfoProps {
  data: PersonalInfoType;
  actions: CVDataActions;
}

const PersonalInfoSimple: React.FC<PersonalInfoProps> = ({ data, actions }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Dados Pessoais (Versão Teste)
        </h2>
        
        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => actions.updatePersonalInfo('name', e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => actions.updatePersonalInfo('email', e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => actions.updatePersonalInfo('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              value={data.linkedin}
              onChange={(e) => actions.updatePersonalInfo('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/seuperfil"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Resumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resumo Profissional *
            </label>
            <textarea
              value={data.summary}
              onChange={(e) => actions.updatePersonalInfo('summary', e.target.value)}
              placeholder="Descreva brevemente sua experiência profissional..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              {data.summary.length}/500 caracteres
            </p>
          </div>
        </div>
        
        {/* Debug info */}
        <div className="mt-6 p-3 bg-gray-50 rounded text-xs">
          <strong>Debug:</strong> Nome: "{data.name}" | Email: "{data.email}"
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSimple;
