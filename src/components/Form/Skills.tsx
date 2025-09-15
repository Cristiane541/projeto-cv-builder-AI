import { Plus, Lightbulb, ChartBar } from "phosphor-react";
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
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "#0073b1",
    fontFamily: 'Montserrat, Arial, sans-serif',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    border: "2px solid #e5f3ff",
    borderRadius: "12px",
    fontSize: "16px",
    fontFamily: 'Montserrat, Arial, sans-serif',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fcff 100%)',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,115,177,0.08)',
    outline: 'none'
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
          <label style={{
            ...label,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}><Lightbulb size={20} color="#0073b1" weight="bold" /> Habilidade</label>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Ex.: React, TypeScript, Python"
            style={inputBase}
            onFocus={(e) => {
              e.target.style.border = '2px solid #0073b1';
              e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.border = '2px solid #e5f3ff';
              e.target.style.boxShadow = '0 2px 8px rgba(0,115,177,0.08)';
              e.target.style.transform = 'translateY(0)';
            }}
          />
        </div>

        <div>
          <label style={{
            ...label,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}><ChartBar size={20} color="#0073b1" weight="bold" /> Nível</label>
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value as SkillLevel)}
            style={inputBase}
            onFocus={(e) => {
              e.target.style.border = '2px solid #0073b1';
              e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onBlur={(e) => {
              e.target.style.border = '2px solid #e5f3ff';
              e.target.style.boxShadow = '0 2px 8px rgba(0,115,177,0.08)';
              e.target.style.transform = 'translateY(0)';
            }}
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
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#eaf3fb', color: '#0073b1', border: 'none', borderRadius: 8,
              padding: '8px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,115,177,0.08)', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#cde6fa'}
            onMouseLeave={e => e.currentTarget.style.background = '#eaf3fb'}
          >
            <Plus size={20} color="#0073b1" weight="bold" /> Adicionar
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
