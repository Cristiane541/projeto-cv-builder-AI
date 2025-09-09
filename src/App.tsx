// src/App.tsx
import PreviewSection from "./components/Layout/PreviewSection";
import PersonalInfoUltraSimple from "./components/Form/PersonalInfoUltraSimple";
import { useCVData } from "./hooks/useCVData";
import FormSection from "./components/Layout/FormSection";
import Skills from "./components/Form/Skills";
import Experience from "./components/Form/Experience";
import SettingsKeyButton from "./components/UI/SettingsKeyButton";
import { CVPreview } from "./components/Preview/CVPreview";

function App() {
  const { cvData, actions } = useCVData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen w-full">
        <FormSection>
          <PersonalInfoUltraSimple data={cvData.personal} actions={actions} />
          <Skills data={cvData.skills} actions={actions} />
          <Experience data={cvData.experiences} actions={actions} />
        </FormSection>

        {/* Preview usando o componente da pasta Preview */}
        <PreviewSection>
          <CVPreview data={cvData} actions={actions} />
        </PreviewSection>
      </div>

      {/* Botão flutuante para gerenciar a chave */}
      <SettingsKeyButton />
    </div>
  );
}

export default App;
