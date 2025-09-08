import type { FC } from "react";
import { useAIEnhancement } from "../../hooks/useAIEnhancement";
import type { AIEnhanceRequest } from "../../types/api.types";
import { LoadingSpinner } from "../UI/LoadingSpinner";

type Props = {
  field: AIEnhanceRequest["field"];
  text: string;
  context?: string;
  onEnhanced: (newText: string) => void;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
};

export const AIEnhanceButton: FC<Props> = ({
  field,
  text,
  context,
  onEnhanced,
  label = "Melhorar com IA",
  size = "md",
  disabled,
}) => {
  const { run, isLoading, error } = useAIEnhancement();

  const handle = async () => {
    const { improvedText } = await run({ field, text, context });
    if (improvedText) onEnhanced(improvedText);
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={handle}
        disabled={disabled || isLoading || !text?.trim()}
        className={[
          "inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3",
          size === "sm" ? "h-8 text-xs" : "h-9 text-sm",
          "hover:bg-neutral-50 disabled:opacity-60",
        ].join(" ")}
        aria-busy={isLoading}
      >
        {isLoading ? <LoadingSpinner size={16} /> : null}
        <span>{label}</span>
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
};
