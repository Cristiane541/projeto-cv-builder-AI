import { useEffect, useState, useLayoutEffect, useRef } from "react";
import PreviewSection from "./components/Layout/PreviewSection";
import PersonalInfoUltraSimple from "./components/Form/PersonalInfoUltraSimple";
import { useCVData } from "./hooks/useCVData";
import FormSection from "./components/Layout/FormSection";
import Skills from "./components/Form/Skills";
import Experience from "./components/Form/Experience";
import SettingsKeyButton from "./components/UI/SettingsKeyButton";
import { CVPreview } from "./components/Preview/CVPreview";
import { ThemeProvider } from "./contexts/ThemeContext";

import CVManager from "./components/Storage/CVManager";

import {
  listCVs,
  createCV,
  updateData,
  getDoc,
} from "./services/storageService";
import type { CVData as StorageCVData } from "./types/storage.types";

function App() {
  const { cvData, actions } = useCVData();

  const [cvId, setCvId] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(false);

  // refs para evitar dependências que causam loop
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  const currentIdRef = useRef<string | null>(null);
  useEffect(() => {
    currentIdRef.current = cvId;
  }, [cvId]);

  useEffect(() => {
    if (cvId) return;
    const first = listCVs()[0]?.id ?? null;
    setCvId(first ?? createCV("Currículo", {}).id);
  }, [cvId]);

  useLayoutEffect(() => {
    if (!cvId) return;
    const doc = getDoc(cvId);
    if (!doc) return;

    setHydrating(true);

    const a: any = actionsRef.current;
    if (typeof a.replaceState === "function") {
      a.replaceState(doc.data);
    } else {
      a.personal?.setAll?.(doc.data?.personal ?? {});
      a.skills?.setAll?.(doc.data?.skills ?? []);
      a.experiences?.setAll?.(doc.data?.experiences ?? []);
    }

    setHydrating(false);
  }, [cvId]);

  useEffect(() => {
    if (hydrating) return;
    const id = currentIdRef.current;
    if (!id) return;
    updateData(id, cvData as unknown as StorageCVData);
  }, [cvData, hydrating]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen w-full">
          <FormSection>
            {/* Currículos + Import/Export no MESMO card */}
            <div className="mb-6">
              <CVManager selectedId={cvId} onSelect={setCvId} />
            </div>

            {/* Formulário */}
            <PersonalInfoUltraSimple data={cvData.personal} actions={actions} />
            <Skills data={cvData.skills} actions={actions} />
            <Experience data={cvData.experiences} actions={actions} />
          </FormSection>

          {/* Preview */}
          <PreviewSection>
            <CVPreview data={cvData} actions={actions} />
          </PreviewSection>
        </div>

        <SettingsKeyButton />
      </div>
    </ThemeProvider>
  );
}

export default App;
