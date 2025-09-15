import type { FC } from "react";
import type { CVData } from "../../types/cv.types"; // Removido CVDataActions que não era mais necessário
import { PersonalHeader } from "./PersonalHeader";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ExportButton } from "./ExportButton";
import { useTheme } from "../../contexts/ThemeContext";

type Props = {
  data: CVData;
  // A propriedade 'actions' foi removida daqui, pois não era usada.
};

// 'actions' foi removido da desestruturação das props aqui 👇
export const CVPreview: FC<Props> = ({ data }) => {
  const { previewTheme } = useTheme();

  return (
    <div className="relative">
      {/* Conteúdo do CV */}
      <div
        id="cv-preview-content"
        className="rounded-lg shadow-xl border border-gray-100 min-h-[297mm] w-full"
        style={{ 
          overflow: "visible",
          background: previewTheme?.colors?.background || '#ffffff'
        }}
      >
        <div
          className="h-full text-neutral-900"
          style={{ padding: "0px 40px 40px 40px", overflow: "visible" }}
        >
          <PersonalHeader
            personal={data.personal}
            onImproveSummary={undefined}
            previewTheme={previewTheme}
          />

          {/* Botão de Export no topo esquerdo */}
          <div
            className="absolute z-10 export-button"
            style={{
              top: "16px",
              left: "56px",
            }}
          >
            <ExportButton
              targetElementId="cv-preview-content"
              cvData={{
                name: data.personal.name || "Usuario",
                email: data.personal.email || "",
                phone: data.personal.phone || "",
              }}
            />
          </div>

          <SkillsSection skills={data.skills} previewTheme={previewTheme} />

          <ExperienceSection
            experiences={data.experiences}
            onImproveExperience={undefined}
            previewTheme={previewTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
