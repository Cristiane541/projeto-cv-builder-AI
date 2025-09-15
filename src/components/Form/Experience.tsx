import React from "react";
import { Trash, Buildings, Briefcase, Calendar } from "phosphor-react";
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
  const currentYear = new Date().getFullYear();
  const [newExp, setNewExp] = React.useState({
    company: "",
    role: "",
    period: "",
    startMonth: 1,
    startYear: currentYear - 1,
    endMonth: 12,
    endYear: currentYear,
    description: "",
    current: false,
  });

  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const formatPeriod = (startMonth: number, startYear: number, endMonth?: number, endYear?: number, current?: boolean) => {
    const startPeriod = `${monthNames[startMonth - 1]} ${startYear}`;
    if (current) {
      return `${startPeriod} - Atual`;
    }
    if (endMonth && endYear) {
      const endPeriod = `${monthNames[endMonth - 1]} ${endYear}`;
      return `${startPeriod} - ${endPeriod}`;
    }
    return startPeriod;
  };

  const handleChange = (field: keyof typeof newExp, value: string | boolean | number) =>
    setNewExp((prev) => ({ ...prev, [field]: value }));

  const addExperience = () => {
    if (!newExp.company.trim() || !newExp.role.trim()) return;
    
    // Validação de data: fim deve ser posterior ao início
    if (!newExp.current) {
      const startDate = new Date(newExp.startYear, newExp.startMonth - 1);
      const endDate = new Date(newExp.endYear, newExp.endMonth - 1);
      
      if (endDate <= startDate) {
        alert("A data de fim deve ser posterior à data de início!");
        return;
      }
    }
    
    const period = formatPeriod(
      newExp.startMonth, 
      newExp.startYear, 
      newExp.current ? undefined : newExp.endMonth, 
      newExp.current ? undefined : newExp.endYear, 
      newExp.current
    );

    actions.addExperience({
      company: newExp.company.trim(),
      role: newExp.role.trim(),
      period,
      startMonth: newExp.startMonth,
      startYear: newExp.startYear,
      endMonth: newExp.current ? undefined : newExp.endMonth,
      endYear: newExp.current ? undefined : newExp.endYear,
      description: newExp.description,
      current: newExp.current,
    });
    setNewExp({
      company: "",
      role: "",
      period: "",
      startMonth: 1,
      startYear: currentYear - 1,
      endMonth: 12,
      endYear: currentYear,
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
        Experiência Profissional
      </h2>

      <div style={rowGap}>
        <div>
          <label style={{
            ...label,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}><Buildings size={20} color="#0073b1" weight="bold" /> Nome da empresa</label>
          <input
            type="text"
            value={newExp.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Ex.: Acme S.A."
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
          }}><Briefcase size={20} color="#0073b1" weight="bold" /> Cargo/Posição</label>
          <input
            type="text"
            value={newExp.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Ex.: Desenvolvedor Front-end"
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
          }}><Calendar size={20} color="#0073b1" weight="bold" /> Período</label>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: '#0073b1', fontWeight: '600' }}>Início:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={newExp.startMonth}
                  onChange={(e) => handleChange("startMonth", parseInt(e.target.value))}
                  style={{
                    ...inputBase,
                    width: '100px',
                    padding: '10px 12px'
                  }}
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
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                  ))}
                </select>
                <select
                  value={newExp.startYear}
                  onChange={(e) => handleChange("startYear", parseInt(e.target.value))}
                  style={{
                    ...inputBase,
                    width: '90px',
                    padding: '10px 12px'
                  }}
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
                  {Array.from({ length: 30 }, (_, i) => currentYear - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {!newExp.current && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: '#0073b1', fontWeight: '600' }}>Fim:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={newExp.endMonth}
                    onChange={(e) => handleChange("endMonth", parseInt(e.target.value))}
                    style={{
                      ...inputBase,
                      width: '100px',
                      padding: '10px 12px'
                    }}
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
                    {monthNames.map((month, index) => (
                      <option key={index + 1} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={newExp.endYear}
                    onChange={(e) => handleChange("endYear", parseInt(e.target.value))}
                    style={{
                      ...inputBase,
                      width: '90px',
                      padding: '10px 12px'
                    }}
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
                    {Array.from({ length: 30 }, (_, i) => currentYear - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
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
          
          {/* Botões na mesma linha: Adicionar Experiência e Melhorar com IA */}
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={addExperience}
              style={{
                padding: "10px 18px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontFamily: 'Montserrat, Arial, sans-serif',
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(37, 99, 235, 0.2)";
              }}
            >
              Adicionar Experiência
            </button>
            
            <AIEnhanceButton
              field="experience"
              text={newExp.description || `Descreva atividades como ${newExp.role || 'profissional'} na ${newExp.company || 'empresa'}`}
              context={`${newExp.company || 'Empresa'} | ${newExp.role || 'Cargo'}`}
              onEnhanced={(enhancedText) => {
                handleChange("description", enhancedText);
              }}
              size="sm"
              label="Melhorar com IA"
              disabled={!newExp.description?.trim()}
            />
          </div>
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
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#ffeaea', color: '#dc2626', border: 'none', borderRadius: 8,
                      padding: '6px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(220,38,38,0.08)', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ffd6d6'}
                    onMouseLeave={e => e.currentTarget.style.background = '#ffeaea'}
                  >
                      <Trash size={16} color="#dc2626" weight="bold" /> Remover
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
              </div>
            )}
            
            {/* Botão Melhorar com IA para experiência existente - sempre visível mas desabilitado sem texto */}
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <AIEnhanceButton
                field="experience"
                text={exp.description || `Descreva atividades como ${exp.role} na ${exp.company}`}
                context={`${exp.company} | ${exp.role}`}
                onEnhanced={(enhancedText) => {
                  actions.updateExperience(exp.id, { description: enhancedText });
                }}
                size="sm"
                label="Melhorar com IA"
                disabled={!exp.description?.trim()}
              />
            </div>
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
