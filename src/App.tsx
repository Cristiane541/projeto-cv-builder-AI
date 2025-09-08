// src/App.tsx
import PreviewSection from "./components/Layout/PreviewSection";
import PersonalInfoUltraSimple from "./components/Form/PersonalInfoUltraSimple";
import { useCVData } from "./hooks/useCVData";
import { AIEnhanceButton } from "./components/Form/AIEnhanceButton";
import FormSection from "./components/Layout/FormSection";
import Skills from "./components/Form/Skills";
import Experience from "./components/Form/Experience";
import SettingsKeyButton from "./components/UI/SettingsKeyButton";

function App() {
  const { cvData, actions } = useCVData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <FormSection>
          <PersonalInfoUltraSimple data={cvData.personal} actions={actions} />
          <Skills data={cvData.skills} actions={actions} />
          <Experience data={cvData.experiences} actions={actions} />
        </FormSection>

        {/* Pode manter seu PreviewSection como já estava */}
        <PreviewSection>
          <div className="bg-white  rounded-md shadow-sm w-full max-w-[816px] mx-auto">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Preview do Currículo
              </h2>

              <div className="space-y-1">
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
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="font-semibold text-gray-800">
                  Resumo Profissional
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {cvData.personal.summary ||
                    "Resumo profissional aparecerá aqui."}
                </p>
                <AIEnhanceButton
                  field="summary"
                  text={cvData.personal.summary || ""}
                  onEnhanced={(t) => actions.updatePersonalInfo("summary", t)}
                />
              </div>

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

              {cvData.experiences.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Experiência Profissional
                  </h4>
                  <div className="space-y-4">
                    {cvData.experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="border-l-4 border-blue-500 pl-4 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h5 className="font-medium text-gray-900">
                            {exp.role || "Cargo"}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {exp.period} {exp.current ? "· Atual" : ""}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{exp.company}</p>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {exp.description ||
                            "Descrição das atividades e responsabilidades."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PreviewSection>
      </div>

      {/* Botão flutuante para gerenciar a chave */}
      <SettingsKeyButton />
    </div>
  );
}

export default App;
