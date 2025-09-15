import React, { useCallback, useState, useContext, createContext, type ReactNode } from "react";
import type {
  CVData,
  PersonalInfo,
  Skill,
  Experience,
  CVDataActions,
} from "../types/cv.types";

// Contexto global para CVData
const CVDataContext = createContext<{
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
  setSelectedThemeKey: (themeKey: string | null) => void;
  actions: CVDataActions;
} | undefined>(undefined);

export const CVDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCVData] = useState<CVData>({
    personal: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
    },
    skills: [],
    experiences: [],
    selectedThemeKey: null,
  });

  // Atualiza dados pessoais
  // 👈 Otimizado com useCallback
  const updatePersonalInfo = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setCVData((prev) => {
        if (prev.personal[field] === value) {
          return prev;
        }
        return {
          ...prev,
          personal: { ...prev.personal, [field]: value },
        };
      });
    },
    [] // Array de dependências vazio, a função nunca será recriada
  );

  // Adiciona uma habilidade
  // 👈 Otimizado com useCallback
  const addSkill = useCallback((skill: Omit<Skill, "id">) => {
    const newSkill: Skill = {
      ...skill,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  }, []);

  // Remove uma habilidade
  // 👈 Otimizado com useCallback
  const removeSkill = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

  // Atualiza uma habilidade
  // 👈 Otimizado com useCallback
  const updateSkill = useCallback(
    (id: string, updates: Partial<Omit<Skill, "id">>) => {
      setCVData((prev) => ({
        ...prev,
        skills: prev.skills.map((skill) =>
          skill.id === id ? { ...skill, ...updates } : skill
        ),
      }));
    },
    []
  );

  // Adiciona uma experiência
  // 👈 Otimizado com useCallback
  const addExperience = useCallback((experience: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      ...experience,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  }, []);

  // Remove uma experiência
  // 👈 Otimizado com useCallback
  const removeExperience = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

  // Atualiza uma experiência
  // 👈 Otimizado com useCallback
  const updateExperience = useCallback(
    (id: string, updates: Partial<Omit<Experience, "id">>) => {
      setCVData((prev) => ({
        ...prev,
        experiences: prev.experiences.map((exp) =>
          exp.id === id ? { ...exp, ...updates } : exp
        ),
      }));
    },
    []
  );

  // Atualiza o tema selecionado
  const setSelectedThemeKey = useCallback((themeKey: string | null) => {
    setCVData((prev) => ({
      ...prev,
      selectedThemeKey: themeKey,
    }));
  }, []);

  // Retorna os dados e ações conforme a interface CVDataActions
  const actions: CVDataActions = {
    updatePersonalInfo,
    addSkill,
    removeSkill,
    updateSkill,
    addExperience,
    removeExperience,
    updateExperience,
  };

  return (
    <CVDataContext.Provider value={{ cvData, actions, setCVData, setSelectedThemeKey }}>
      {children}
    </CVDataContext.Provider>
  );
};

export function useCVData() {
  const context = useContext(CVDataContext);
  if (!context) throw new Error("useCVData deve ser usado dentro de CVDataProvider");
  return context;
}
