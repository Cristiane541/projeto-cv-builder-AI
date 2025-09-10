import React from "react";

interface FormSectionProps {
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ children }) => (
 
  <section className="w-1/2 h-screen overflow-y-auto p-8 bg-gray-50 border-r border-gray-200">
    {/* Título do Gerador de Currículos */}
    <div className="mb-8">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Gerador de Currículos
        </h1>
      </div>
    </div>
    
    <div className="space-y-6">{children}</div>
  </section>
);

export default FormSection;
