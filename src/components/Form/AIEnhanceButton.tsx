// src/components/Form/AIEnhanceButton.tsx
import type { FC } from "react";
import { useState, useEffect } from "react";
import { Robot } from "phosphor-react";
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
  size?: string;
};

export const AIEnhanceButton: FC<Props> = ({
  field,
  text,
  onEnhanced,
  label = "Melhorar com IA",
  disabled,
  size = "md",
}) => {
  const { setPrompt, result, isLoading } = useAIEnhancement(field);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (result?.improvedText && result.improvedText !== text) {
      onEnhanced(result.improvedText);
    }
  }, [result, onEnhanced, text]);

  const handle = async () => {
    try {
      console.log('🚀 Clicou no botão Melhorar com IA');
      setPrompt(text);
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
    }
  };

  const isDisabled = disabled || isLoading || !text?.trim();

  return (
    <button
      type="button"
      onClick={handle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 6 : 8,
        padding: size === "sm" ? "8px 14px" : "10px 18px",
        border: "1px solid #d97706",
        borderRadius: 8,
        background: isDisabled 
          ? "#f9fafb" 
          : isHovered 
            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" 
            : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        fontSize: size === "sm" ? 13 : 14,
        fontFamily: 'Montserrat, Arial, sans-serif',
        fontWeight: "600",
        color: isDisabled 
          ? "#9ca3af" 
          : isHovered || isLoading 
            ? "#ffffff" 
            : "#ffffff",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        transform: isDisabled ? "scale(0.98)" : isHovered ? "scale(1.02)" : "scale(1)",
        boxShadow: isHovered && !isDisabled ? "0 4px 12px rgba(217, 119, 6, 0.3)" : "none",
      }}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={size === "sm" ? 14 : 16} />
          <span>Melhorando...</span>
        </>
      ) : (
        <>
          <Robot size={size === "sm" ? 14 : 16} weight="bold" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
