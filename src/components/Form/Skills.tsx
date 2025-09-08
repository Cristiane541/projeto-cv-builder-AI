import React from "react";
import type { Skill, CVDataActions, SkillLevel } from "../../types/cv.types";

interface SkillsProps {
  data: Skill[];
  actions: CVDataActions;
}

const Skills: React.FC<SkillsProps> = ({ data, actions }) => {
  const [newSkill, setNewSkill] = React.useState("");
  const [newLevel, setNewLevel] = React.useState<SkillLevel>("Básico");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    actions.addSkill({ name: newSkill.trim(), level: newLevel });
    setNewSkill("");
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
        Habilidades
      </h2>

      <div style={rowGap}>
        <div>
          <label style={label}>Habilidade</label>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Ex.: React, TypeScript, Python"
            style={inputBase}
          />
        </div>

        <div>
          <label style={label}>Nível</label>
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value as SkillLevel)}
            style={inputBase}
          >
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>

        <div>
          <button
            onClick={addSkill}
            style={{
              padding: "8px 16px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Adicionar
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {data.map((skill) => (
          <div
            key={skill.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              marginTop: 8,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#1f2937" }}>
                {skill.name}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "#dbeafe",
                  color: "#1e40af",
                }}
              >
                {skill.level}
              </span>
            </div>
            <button
              onClick={() => actions.removeSkill(skill.id)}
              title="Remover habilidade"
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
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
            Nenhuma habilidade adicionada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default Skills;
