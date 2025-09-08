// Formulário de experiências
import React from "react";
import type {
  Experience as ExperienceType,
  CVDataActions,
} from "../../types/cv.types";

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

  const addExperience = () => {
    if (newExp.company.trim() && newExp.role.trim()) {
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
    }
  };

  const removeExperience = (id: string) => {
    actions.removeExperience(id);
  };

  const handleInputChange = (
    field: keyof typeof newExp,
    value: string | boolean
  ) => {
    setNewExp((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Experiência Profissional
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
        <input
          type="text"
          value={newExp.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
          placeholder="Nome da empresa"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={newExp.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
          placeholder="Cargo/Posição"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={newExp.period}
          onChange={(e) => handleInputChange("period", e.target.value)}
          placeholder="Período (Ex: Jan 2020 - Dez 2022)"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="current-job"
            checked={newExp.current}
            onChange={(e) => handleInputChange("current", e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="current-job" className="text-sm text-gray-700">
            Emprego atual
          </label>
        </div>
        <textarea
          value={newExp.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Descrição das atividades e responsabilidades"
          rows={3}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
        />
        <button
          onClick={addExperience}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
        >
          Adicionar Experiência
        </button>
      </div>

      <div className="space-y-4">
        {data.map((exp) => (
          <div
            key={exp.id}
            className="p-4 bg-gray-50 border border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{exp.role}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.period} {exp.current && "(Atual)"}
                </p>
              </div>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none ml-4"
                title="Remover experiência"
              >
                ✕
              </button>
            </div>
            {exp.description && (
              <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
            )}
          </div>
        ))}

        {data.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            Nenhuma experiência adicionada ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default Experience;
