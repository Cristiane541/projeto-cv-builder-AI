import React from "react";

interface PreviewSectionProps {
  children: React.ReactNode;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ children }) => (
  /**
   * ml-8 / md:ml-10 cria um ESPAÇO real entre a divisória (border-r do form)
   * e a coluna do preview, resolvendo o “colado no canto”.
   */
  <section className="flex-1 min-w-0 h-screen overflow-y-auto bg-gray-50 ml-8 md:ml-10">
    {/* Respiro vertical */}
    <div className="py-10">
      {/* Centraliza o “papel” do currículo e dá padding interno */}
      <div className="w-full max-w-[860px] mx-auto px-6 md:px-8">
        {children}
      </div>
    </div>
  </section>
);

export default PreviewSection;
