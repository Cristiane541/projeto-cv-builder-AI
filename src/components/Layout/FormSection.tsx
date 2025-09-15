import React from "react";

interface FormSectionProps {
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ children }) => (
 
  <section className="w-1/2 h-screen overflow-y-auto p-8 bg-gray-50 border-r border-gray-200" style={{marginTop: 24, marginLeft: 24, marginRight: 24, borderRadius: 16}}>    
    <div className="space-y-6">{children}</div>
  </section>
);

export default FormSection;
