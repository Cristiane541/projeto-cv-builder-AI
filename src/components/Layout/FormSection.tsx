import React from "react";

interface FormSectionProps {
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ children }) => (
  // Coluna do formulário com border-r (a divisória). Mantemos flex-1.
  <section className="flex-1 min-w-0 h-screen overflow-y-auto p-8 bg-gray-50 border-r border-gray-200">
    <div className="space-y-6">{children}</div>
  </section>
);

export default FormSection;
