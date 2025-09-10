import type { FC } from "react";
import type { Skill } from "../../types/cv.types";
import type { PDFTheme } from "../../types/pdf.types";

export const SkillsSection: FC<{ skills: Skill[]; previewTheme?: PDFTheme | null }> = ({ skills, previewTheme }) => {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-1 h-10 rounded-full"
          style={{
            background: previewTheme 
              ? `linear-gradient(to bottom, ${previewTheme.colors.accent}, ${previewTheme.colors.primary})`
              : '#6b7f5e' // Cor sólida segura para html2canvas
          }}
        ></div>
        <h2 
          className="text-3xl font-light tracking-wide"
          style={{
            color: previewTheme ? previewTheme.colors.accent : '#6b7f5e'
          }}
        >
          Habilidades
        </h2>
      </div>
      
      {!skills?.length ? (
        <div 
          className="rounded-xl shadow-md p-8"
          style={{
            background: previewTheme 
              ? previewTheme.colors.sectionBg // Fundo neutro das seções
              : '#f8fafc' // Fundo neutro
          }}
        >
          <p className="text-gray-600 text-center">Nenhuma habilidade informada.</p>
        </div>
      ) : (
        <div 
          className="rounded-xl shadow-md p-8"
          style={{
            background: previewTheme 
              ? previewTheme.colors.sectionBg // Fundo neutro das seções
              : '#f8fafc' // Fundo neutro
          }}
        >
          <div className="space-y-4">
            {skills.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-gray-800 text-lg">
                  {s.name} ({s.level})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
