// src/components/Form/AIEnhanceButton.tsx
import type { FC } from "react";
import { useState } from "react";
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
  size?: string; // Adicionando size que estava sendo passado
};

export const AIEnhanceButton: FC<Props> = ({
  field,
  text,
  context,
  onEnhanced,
  label = "Melhorar com IA",
  disabled,
  size = "md",
}) => {
  const { run, isLoading } = useAIEnhancement();
  const [isHovered, setIsHovered] = useState(false);

  const handle = async () => {
    try {
      console.log('🚀 Clicou no botão Melhorar com IA');
      const { improvedText } = await run({ field, text, context });
      if (improvedText) {
        onEnhanced(improvedText);
      }
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isLoading || !text?.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: size === "sm" ? "6px 12px" : "8px 16px",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        background: isHovered && !disabled && !isLoading ? "#3b82f6" : "#ffffff",
        fontSize: size === "sm" ? 13 : 14,
        color: isHovered && !disabled && !isLoading ? "#ffffff" : "#111827",
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: "all 0.2s ease",
        fontWeight: "500",
      }}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={16} />
          <span>Melhorando...</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
};
