import FormSection from './components/Layout/FormSection';
import PreviewSection from './components/Layout/PreviewSection';
import { useCVData } from './hooks/useCVData';

export default App;

function App() {
  const { cvData, updatePersonalInfo, addSkill, removeSkill, addExperience, removeExperience } = useCVData();

  return (
    <div className="flex h-screen">
      <FormSection>
        {/* Formulário vai aqui */}
        {/* Exemplo: <PersonalInfoForm data={cvData.personal} onChange={updatePersonalInfo} /> */}
      </FormSection>
      <PreviewSection>
        {/* Preview do currículo vai aqui */}
        {/* Exemplo: <CVPreview data={cvData} /> */}
      </PreviewSection>
    </div>
  );
}

export default App;