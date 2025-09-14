import {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  Suspense,
  lazy,
} from "react";
import PreviewSection from "./components/Layout/PreviewSection";
import { useCVData } from "./hooks/useCVData";
import FormSection from "./components/Layout/FormSection";
import SettingsKeyButton from "./components/UI/SettingsKeyButton";
import { ThemeProvider } from "./contexts/ThemeContext";

import {
  listCVs,
  createCV,
  updateData,
  getDoc,
} from "./services/storageService";
import type { CVData as StorageCVData } from "./types/storage.types";

// Lazy loading para componentes pesados
const PersonalInfoUltraSimpleLazy = lazy(
  () => import("./components/Form/PersonalInfoUltraSimple")
);
const SkillsLazy = lazy(() => import("./components/Form/Skills"));
const ExperienceLazy = lazy(() => import("./components/Form/Experience"));
const CVPreviewLazy = lazy(() => import("./components/Preview/CVPreview"));
const CVManagerLazy = lazy(() => import("./components/Storage/CVManager"));

// Componente de fallback para loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

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
            <div className="mb-6">
              <Suspense fallback={<LoadingFallback />}>
                <CVManagerLazy selectedId={cvId} onSelect={setCvId} />
              </Suspense>
            </div>

            <Suspense fallback={<LoadingFallback />}>
              <PersonalInfoUltraSimpleLazy
                data={cvData.personal}
                actions={actions}
              />
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
              <SkillsLazy data={cvData.skills} actions={actions} />
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
              <ExperienceLazy data={cvData.experiences} actions={actions} />
            </Suspense>
          </FormSection>

          <PreviewSection>
            <Suspense fallback={<LoadingFallback />}>
              {/* A MUDANÇA ESTÁ AQUI 👇 */}
              {/* A propriedade 'actions' foi removida */}
              <CVPreviewLazy data={cvData} />
            </Suspense>
          </PreviewSection>
        </div>

        <SettingsKeyButton />
      </div>
    </ThemeProvider>
  );
}

export default App;
