import React from "react";

interface PreviewSectionProps {
  children: React.ReactNode;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ children }) => (
  /**
   * Exatamente 50% da largura, sem espaços vazios
   */
  <section className="w-1/2 h-screen overflow-y-auto bg-gray-50">
    {/* Container que ocupa toda a largura */}
    <div className="h-full p-4">
      {/* Paper do currículo ocupando toda a largura disponível */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  </section>
);

export default PreviewSection;
