// Formulário de habilidades
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
    if (newSkill.trim()) {
      actions.addSkill({
        name: newSkill.trim(),
        level: newLevel,
      });
      setNewSkill("");
    }
  };

  const removeSkill = (id: string) => {
    actions.removeSkill(id);
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Habilidades</h3>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Ex: React, TypeScript, Python"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newLevel}
          onChange={(e) => setNewLevel(e.target.value as SkillLevel)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Básico">Básico</option>
          <option value="Intermediário">Intermediário</option>
          <option value="Avançado">Avançado</option>
        </select>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Adicionar
        </button>
      </div>

      <div className="space-y-2">
        {data.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-800">{skill.name}</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {skill.level}
              </span>
            </div>
            <button
              onClick={() => removeSkill(skill.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
              title="Remover habilidade"
            >
              ✕
            </button>
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            Nenhuma habilidade adicionada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default Skills;
