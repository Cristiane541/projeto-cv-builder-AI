import type { FC } from "react";
import type { PersonalInfo } from "../../types/cv.types";
import { AIEnhanceButton } from "../Form/AIEnhanceButton";

type Props = {
  personal: PersonalInfo;
  onImproveSummary?: (newText: string) => void; // usa actions.updatePersonalInfo
};

export const PersonalHeader: FC<Props> = ({ personal, onImproveSummary }) => {
  const { name, email, phone, linkedin, summary } = personal;

  return (
    <header className="space-y-3">
      <h1 className="text-3xl font-semibold">{name || "Seu Nome"}</h1>

      <div className="text-sm text-neutral-600 flex flex-wrap gap-x-4 gap-y-1">
        {email && <span>{email}</span>}
        {phone && <span>{phone}</span>}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            LinkedIn
          </a>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-neutral-800 leading-relaxed">
          {summary || "Resumo profissional aparecerá aqui."}
        </p>

        {onImproveSummary ? (
          <AIEnhanceButton
            field="summary"
            text={summary || ""}
            onEnhanced={(t) => onImproveSummary(t)}
            size="sm"
          />
        ) : null}
      </div>
    </header>
  );
};
