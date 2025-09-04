import React from 'react';

interface PreviewSectionProps {
  children: React.ReactNode;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ children }) => (
  <section className="w-1/2 h-screen overflow-y-auto p-8 bg-gray-50">
    {children}
  </section>
);

export default PreviewSection;