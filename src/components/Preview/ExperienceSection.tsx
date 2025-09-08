import type { FC } from "react";
import type { Experience } from "../../types/cv.types";
import { AIEnhanceButton } from "../Form/AIEnhanceButton";

type Props = {
  experiences: Experience[];
  onImproveExperience?: (id: string, newText: string) => void; // usa actions.updateExperience
};

export const ExperienceSection: FC<Props> = ({
  experiences,
  onImproveExperience,
}) => {
  return (
    <section>
      <h2 className="text-xl font-medium mb-4">Experiências</h2>
      {!experiences?.length ? (
        <p className="text-neutral-600">Nenhuma experiência informada.</p>
      ) : (
        <div className="space-y-5">
          {experiences.map((e) => (
            <article key={e.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium">
                  {e.role || "Cargo"} ·{" "}
                  <span className="text-neutral-700">
                    {e.company || "Empresa"}
                  </span>
                </h3>
                <span className="text-xs text-neutral-600">
                  {e.period} {e.current ? "· Atual" : ""}
                </span>
              </div>

              <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {e.description || "Descrição da experiência."}
              </p>

              {onImproveExperience ? (
                <AIEnhanceButton
                  field="experience"
                  text={e.description || ""}
                  context={`${e.company} | ${e.role} | ${e.period}`}
                  onEnhanced={(t) => onImproveExperience(e.id, t)}
                  size="sm"
                />
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
