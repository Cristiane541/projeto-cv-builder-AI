import type { FC } from "react";
import type { Skill } from "../../types/cv.types";

export const SkillsSection: FC<{ skills: Skill[] }> = ({ skills }) => {
  return (
    <section>
      <h2 className="text-xl font-medium mb-3">Habilidades</h2>
      {!skills?.length ? (
        <p className="text-neutral-600">Nenhuma habilidade informada.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {skills.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3">
              <span className="truncate">{s.name}</span>
              <span className="text-xs text-neutral-600">{s.level}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
