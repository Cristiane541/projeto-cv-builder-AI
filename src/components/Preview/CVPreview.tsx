import type { FC } from "react";
import type { CVData, CVDataActions } from "../../types/cv.types";
import { PersonalHeader } from "./PersonalHeader";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";

type Props = {
  data: CVData;
  actions?: Pick<CVDataActions, "updatePersonalInfo" | "updateExperience">;
};

export const CVPreview: FC<Props> = ({ data, actions }) => {
  return (
    <div className="h-full overflow-auto p-8 bg-white text-neutral-900">
      <PersonalHeader
        personal={data.personal}
        onImproveSummary={
          actions ? (t) => actions.updatePersonalInfo("summary", t) : undefined
        }
      />

      <div className="h-px w-full bg-neutral-200 my-6" />

      <SkillsSection skills={data.skills} />

      <div className="h-px w-full bg-neutral-200 my-6" />

      <ExperienceSection
        experiences={data.experiences}
        onImproveExperience={
          actions
            ? (id, t) => actions.updateExperience(id, { description: t })
            : undefined
        }
      />
    </div>
  );
};
