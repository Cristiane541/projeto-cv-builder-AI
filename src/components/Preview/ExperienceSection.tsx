import type { FC } from "react";
import type { Experience } from "../../types/cv.types";
import type { PDFTheme } from "../../types/pdf.types";
import { AIEnhanceButton } from "../Form/AIEnhanceButton";

type Props = {
  experiences: Experience[];
  onImproveExperience?: (id: string, newText: string) => void; // usa actions.updateExperience
  previewTheme?: PDFTheme | null;
};

export const ExperienceSection: FC<Props> = ({
  experiences,
  onImproveExperience,
  previewTheme,
}) => {
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
          Experiência Profissional
        </h2>
      </div>
      
      {!experiences?.length ? (
        <div 
          className="rounded-xl shadow-md p-8"
          style={{
            background: previewTheme 
              ? previewTheme.colors.sectionBg // Fundo neutro das seções
              : '#f8fafc' // Fundo neutro
          }}
        >
          <p className="text-gray-600 text-center">Nenhuma experiência informada.</p>
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
          <div className="space-y-8">
            {experiences.map((e) => (
              <article key={e.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {e.role || "Cargo"}
                    </h3>
                    <p className="text-gray-600 font-medium text-lg">{e.company || "Empresa"}</p>
                  </div>
                  <div className="lg:text-right">
                    <span 
                      className="text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                      style={{
                        background: previewTheme 
                          ? previewTheme.colors.sectionBg // Apenas cor de fundo derivada do header
                          : '#f0f4f0' // Mesmo verde suave
                      }}
                    >
                      {e.period} {e.current ? "· Atual" : ""}
                    </span>
                  </div>
                </div>

                <p className="text-gray-800 leading-loose text-justify font-normal whitespace-pre-wrap tracking-wide mb-4">
                  {e.description || "Descreva suas principais responsabilidades, conquistas e contribuições nesta posição. Inclua resultados específicos e impactos gerados."}
                </p>

                {onImproveExperience && (
                  <AIEnhanceButton
                    field="experience"
                    text={e.description || ""}
                    context={`${e.company} | ${e.role} | ${e.period}`}
                    onEnhanced={(t) => onImproveExperience(e.id, t)}
                    size="sm"
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
