export default App;
import React, { Component, useEffect, useState, useLayoutEffect, useRef, lazy, Suspense, useCallback } from "react";

// Error Boundary para capturar erros de componentes
interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo?: any;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorInfo: undefined };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorInfo: error };
  }
  componentDidCatch(error: any, info: any) {
    // Log detalhado para depuração
    console.error('Erro capturado pelo ErrorBoundary:', error, info);
    this.setState({ errorInfo: { error, info } });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#dc2626', fontSize: 22 }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 16 }}>Ocorreu um erro inesperado 😢</h1>
          <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
          {this.state.errorInfo && (
            <pre style={{
              background: '#fff0f0',
              color: '#dc2626',
              padding: 16,
              borderRadius: 8,
              marginTop: 24,
              fontSize: 14,
              textAlign: 'left',
              maxWidth: 600,
              margin: '0 auto',
              overflowX: 'auto',
            }}>{JSON.stringify(this.state.errorInfo, null, 2)}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
import { useCVData, CVDataProvider } from "./contexts/CVDataContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { keyCombos } from "./utils/keyboardHelpers";
import { useUndoRedo } from "./hooks/useUndoRedo";
import { listCVs, createCV, updateData, getDoc } from "./services/storageService";
import type { CVData as StorageCVData } from "./types/storage.types";
import { ThemeSelector } from "./components/UI/ThemeSelector";
import FormSection from "./components/Layout/FormSection";
import PreviewSection from "./components/Layout/PreviewSection";
import SettingsKeyButton from "./components/UI/SettingsKeyButton";

const PersonalInfoUltraSimpleLazy = lazy(() => import("./components/Form/PersonalInfoUltraSimple"));
const SkillsLazy = lazy(() => import("./components/Form/Skills"));
const ExperienceLazy = lazy(() => import("./components/Form/Experience"));
const CVPreviewLazy = lazy(() => import("./components/Preview/CVPreview"));
const CVManagerLazy = lazy(() => import("./components/Storage/CVManager"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <CVDataProvider>
        <InnerApp />
      </CVDataProvider>
    </ErrorBoundary>
  );
}

function InnerApp() {
  const { cvData, actions } = useCVData();
  if (typeof window !== "undefined") {
    (window as any).__CV_SELECTED_THEME_KEY = cvData.selectedThemeKey ?? null;
  }

  const {
    state: personalState,
    set: setPersonalState,
    undo: undoPersonal,
    redo: redoPersonal,
    canUndo: canUndoPersonal,
    canRedo: canRedoPersonal,
  } = useUndoRedo(cvData.personal);

  // Sincroniza o estado do undo/redo com o estado global
  useEffect(() => {
    if (personalState !== cvData.personal) {
      // Atualiza cada campo individualmente
      Object.keys(personalState).forEach(field => {
        if (personalState[field as keyof typeof personalState] !== cvData.personal[field as keyof typeof cvData.personal]) {
          actions.updatePersonalInfo(field as keyof typeof personalState, personalState[field as keyof typeof personalState]);
        }
      });
    }
  }, [personalState, cvData.personal, actions]);

  const handleSave = useCallback(() => {
    // Salvar currículo
  }, []);

  const handleUndo = useCallback(() => {
    undoPersonal();
  }, [undoPersonal]);

  const handleRedo = useCallback(() => {
    redoPersonal();
  }, [redoPersonal]);

  const handleFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  useKeyboardShortcuts({
    [keyCombos.save]: handleSave,
    [keyCombos.undo]: handleUndo,
    [keyCombos.redo]: handleRedo,
    [keyCombos.fullscreen]: handleFullscreen,
  });

  const [cvId, setCvId] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(false);

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
    <ThemeProvider selectedThemeKey={cvData.selectedThemeKey ?? null}>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f3f6fa 0%, #eaf3fb 100%)',
        padding: '0',
        fontFamily: 'Montserrat, Arial, sans-serif',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '48px 24px 24px 24px',
        }}>
          {/* Título principal centralizado */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: '#0073b1',
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: '0.5px',
              marginBottom: 12,
            }}>
              Gerador de Currículos
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#374151',
              fontFamily: 'Montserrat, Arial, sans-serif',
              maxWidth: 600,
              margin: '0 auto',
            }}>
              Crie, personalize e exporte currículos profissionais de forma rápida e elegante. Escolha o tema, adicione suas experiências e habilidades, e gere um CV pronto para impressionar!
            </p>
          </div>
          <ThemeSelector />
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', marginTop: 24 }}>
            <FormSection>
              {/* Card: Meus Currículos com título centralizado, envolvido pelo card */}
              {/*
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 6px 32px rgba(0,115,177,0.10)',
                border: '2px solid #0073b1',
                padding: '40px 32px 32px 32px',
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                minWidth: 340,
                maxWidth: 480,
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#0073b1',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  margin: 0,
                  marginBottom: 24,
                  textAlign: 'left',
                  width: '100%',
                  paddingTop: 0,
                  paddingLeft: 0,
                }}>
                  Meus Currículos
                </h2>
                <div style={{ width: '100%' }}>
                  <Suspense fallback={<LoadingFallback />}>
                    <CVManagerLazy selectedId={cvId} onSelect={setCvId} />
                  </Suspense>
                </div>
              </div>
              */}
              {/* Card: Dados Pessoais */}
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 6px 32px rgba(0,115,177,0.10)',
                border: '2px solid #f0f9ff',
                padding: '32px 32px 32px 32px',
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 340,
                maxWidth: 480,
                position: 'relative',
              }}>
                <div style={{ width: '100%' }}>
                  <Suspense fallback={<LoadingFallback />}>
                    <PersonalInfoUltraSimpleLazy
                      data={personalState}
                      actions={actions}
                      setPersonalState={setPersonalState}
                      undo={undoPersonal}
                      redo={redoPersonal}
                      canUndo={canUndoPersonal}
                      canRedo={canRedoPersonal}
                    />
                  </Suspense>
                </div>
              </div>
              {/* Card: Skills */}
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 6px 32px rgba(0,115,177,0.10)',
                border: '2px solid #f0f9ff',
                padding: '32px 32px 32px 32px',
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 340,
                maxWidth: 480,
                position: 'relative',
              }}>
                <div style={{ width: '100%' }}>
                  <Suspense fallback={<LoadingFallback />}>
                    <SkillsLazy data={cvData.skills} actions={actions} />
                  </Suspense>
                </div>
              </div>
              {/* Card: Experiências */}
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 6px 32px rgba(0,115,177,0.10)',
                border: '2px solid #f0f9ff',
                padding: '32px 32px 32px 32px',
                marginBottom: 32,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minWidth: 340,
                maxWidth: 480,
                position: 'relative',
              }}>
                <div style={{ width: '100%' }}>
                  <Suspense fallback={<LoadingFallback />}>
                    <ExperienceLazy data={cvData.experiences} actions={actions} />
                  </Suspense>
                </div>
              </div>
            </FormSection>
            <PreviewSection>
              <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 6px 32px rgba(0,115,177,0.10)',
                border: '2px solid #eaf3fb',
                padding: '40px 32px',
                minWidth: 340,
                width: '100%',
                maxWidth: 700,
              }}>
                <Suspense fallback={<LoadingFallback />}>
                  <CVPreviewLazy data={cvData} />
                </Suspense>
              </div>
            </PreviewSection>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
