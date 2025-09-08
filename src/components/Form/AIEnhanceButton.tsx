// src/components/Form/AIEnhanceButton.tsx
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
  disabled?: boolean;
};

export const AIEnhanceButton: FC<Props> = ({
  field,
  text,
  context,
  onEnhanced,
  label = "Melhorar com IA",
  disabled,
}) => {
  const { run, isLoading } = useAIEnhancement();

  const handle = async () => {
    const { improvedText } = await run({ field, text, context });
    if (improvedText) onEnhanced(improvedText);
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled || isLoading || !text?.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        background: "#ffffff",
        fontSize: 14,
        color: "#111827",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        opacity: disabled || isLoading ? 0.6 : 1,
      }}
      aria-busy={isLoading}
    >
      {isLoading ? <LoadingSpinner size={16} /> : null}
      <span>{label}</span>
    </button>
  );
};
