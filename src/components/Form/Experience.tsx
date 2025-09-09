import React from "react";
import type {
  Experience as ExperienceType,
  CVDataActions,
} from "../../types/cv.types";
import { AIEnhanceButton } from "./AIEnhanceButton";

interface ExperienceProps {
  data: ExperienceType[];
  actions: CVDataActions;
}

const Experience: React.FC<ExperienceProps> = ({ data, actions }) => {
  const [newExp, setNewExp] = React.useState({
    company: "",
    role: "",
    period: "",
    description: "",
    current: false,
  });

  const handleChange = (field: keyof typeof newExp, value: string | boolean) =>
    setNewExp((prev) => ({ ...prev, [field]: value }));

  const addExperience = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return;
    actions.addExperience({
      company: newExp.company.trim(),
      role: newExp.role.trim(),
      period: newExp.period,
      description: newExp.description,
      current: newExp.current,
    });
    setNewExp({
      company: "",
      role: "",
      period: "",
      description: "",
      current: false,
    });
  };

  const card: React.CSSProperties = {
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const label: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "4px",
    color: "#374151",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
  };

  const rowGap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  return (
    <div style={card}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#1f2937",
        }}
      >
        Experiência Profissional
      </h2>

      <div style={rowGap}>
        <div>
          <label style={label}>Nome da empresa</label>
          <input
            type="text"
            value={newExp.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Ex.: Acme S.A."
            style={inputBase}
          />
        </div>

        <div>
          <label style={label}>Cargo/Posição</label>
          <input
            type="text"
            value={newExp.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Ex.: Desenvolvedor Front-end"
            style={inputBase}
          />
        </div>

        <div>
          <label style={label}>Período</label>
          <input
            type="text"
            value={newExp.period}
            onChange={(e) => handleChange("period", e.target.value)}
            placeholder="Ex.: Jan 2020 - Dez 2022"
            style={inputBase}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            id="current-job"
            type="checkbox"
            checked={newExp.current}
            onChange={(e) => handleChange("current", e.target.checked)}
          />
          <label
            htmlFor="current-job"
            style={{ fontSize: 14, color: "#374151" }}
          >
            Emprego atual
          </label>
        </div>

        <div>
          <label style={label}>Descrição</label>
          <textarea
            rows={3}
            value={newExp.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Descrição das atividades e responsabilidades"
            style={{ ...inputBase, resize: "none", fontFamily: "inherit" }}
          />
          
          {/* Botão Melhorar com IA para nova experiência */}
          {newExp.description && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <AIEnhanceButton
                field="experience"
                text={newExp.description}
                context={`${newExp.company} | ${newExp.role} | ${newExp.period}`}
                onEnhanced={(enhancedText) => {
                  handleChange("description", enhancedText);
                }}
                size="sm"
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={addExperience}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Adicionar Experiência
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {data.map((exp) => (
          <div
            key={exp.id}
            style={{
              padding: 16,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              marginTop: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h4 style={{ fontWeight: 600, color: "#1f2937" }}>
                  {exp.role || "Cargo"}
                </h4>
                <p style={{ color: "#4b5563" }}>{exp.company}</p>
                <p style={{ color: "#6b7280", fontSize: 12 }}>
                  {exp.period} {exp.current && "(Atual)"}
                </p>
              </div>
              <button
                onClick={() => actions.removeExperience(exp.id)}
                title="Remover experiência"
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  cursor: "pointer",
                  marginLeft: 16,
                  fontSize: 16,
                }}
              >
                ✕
              </button>
            </div>

            {exp.description && (
              <div>
                <p
                  style={{
                    color: "#374151",
                    fontSize: 14,
                    marginTop: 8,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {exp.description}
                </p>
                
                {/* Botão Melhorar com IA para experiência existente */}
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <AIEnhanceButton
                    field="experience"
                    text={exp.description}
                    context={`${exp.company} | ${exp.role} | ${exp.period}`}
                    onEnhanced={(enhancedText) => {
                      actions.updateExperience(exp.id, { description: enhancedText });
                    }}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {data.length === 0 && (
          <p
            style={{
              color: "#6b7280",
              fontSize: 14,
              textAlign: "center",
              padding: "12px 0",
            }}
          >
            Nenhuma experiência adicionada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default Experience;
