import React from 'react';

interface FormSectionProps {
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ children }) => (
  <section className="w-1/2 h-screen overflow-y-auto p-8 bg-white border-r border-gray-200">
    {children}
  </section>
);

export default FormSection;