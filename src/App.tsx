import FormSection from "./components/Layout/FormSection";
import PreviewSection from "./components/Layout/PreviewSection";
import PersonalInfoUltraSimple from "./components/Form/PersonalInfoUltraSimple";
import Skills from "./components/Form/Skills";
import Experience from "./components/Form/Experience";
import { useCVData } from "./hooks/useCVData";

function App() {
  const { cvData, actions } = useCVData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <FormSection>
          {/* Seção de Informações Pessoais */}
          <PersonalInfoUltraSimple data={cvData.personal} actions={actions} />

          {/* Seção de Habilidades - NOVA */}
          <Skills data={cvData.skills} actions={actions} />

          {/* Seção de Experiência - NOVA */}
          <Experience data={cvData.experiences} actions={actions} />
        </FormSection>

        <PreviewSection>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Preview do Currículo
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold text-gray-900">
                {cvData.personal.name || "Seu Nome"}
              </h3>
              <p className="text-gray-600">
                {cvData.personal.email || "seu.email@exemplo.com"}
              </p>
              <p className="text-gray-600">
                {cvData.personal.phone || "(11) 99999-9999"}
              </p>
              {cvData.personal.linkedin && (
                <p className="text-blue-600">{cvData.personal.linkedin}</p>
              )}
              {cvData.personal.summary && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800">
                    Resumo Profissional
                  </h4>
                  <p className="text-gray-700 mt-1">
                    {cvData.personal.summary}
                  </p>
                </div>
              )}

              {/* Preview das Habilidades - NOVO */}
              {cvData.skills.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Habilidades
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill.name} ({skill.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview da Experiência - NOVO */}
              {cvData.experiences.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Experiência Profissional
                  </h4>
                  <div className="space-y-4">
                    {cvData.experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <h5 className="font-medium text-gray-900">
                          {exp.role}
                        </h5>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-xs">
                          {exp.period} {exp.current && "(Atual)"}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 text-sm mt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}

export default App;
