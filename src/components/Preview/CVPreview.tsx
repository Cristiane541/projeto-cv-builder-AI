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
    <div className="bg-white rounded-lg shadow-xl border border-gray-100 min-h-[297mm] w-full overflow-hidden">
      <div className="h-full overflow-auto text-neutral-900" style={{padding: '40px'}}>
        <PersonalHeader
          personal={data.personal}
          onImproveSummary={undefined}
        />

        <SkillsSection skills={data.skills} />

        <ExperienceSection
          experiences={data.experiences}
          onImproveExperience={undefined}
        />
      </div>
    </div>
  );
};
