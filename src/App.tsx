import FormSection from './components/Layout/FormSection';
import PreviewSection from './components/Layout/PreviewSection';
import PersonalInfoUltraSimple from './components/Form/PersonalInfoUltraSimple';
import { useCVData } from './hooks/useCVData';

function App() {
  const { cvData, actions } = useCVData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <FormSection>
          <PersonalInfoUltraSimple data={cvData.personal} actions={actions} />
        </FormSection>
        <PreviewSection>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Preview do Currículo
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-bold text-gray-900">{cvData.personal.name || 'Seu Nome'}</h3>
              <p className="text-gray-600">{cvData.personal.email || 'seu.email@exemplo.com'}</p>
              <p className="text-gray-600">{cvData.personal.phone || '(11) 99999-9999'}</p>
              {cvData.personal.linkedin && (
                <p className="text-blue-600">{cvData.personal.linkedin}</p>
              )}
              {cvData.personal.summary && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800">Resumo Profissional</h4>
                  <p className="text-gray-700 mt-1">{cvData.personal.summary}</p>
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