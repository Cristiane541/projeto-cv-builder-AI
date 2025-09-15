import React, { useCallback, useState, useContext, createContext, useEffect, type ReactNode } from "react";
import type { CVData, CVDataActions, PersonalInfo, Skill, Experience } from "../types/cv.types";

const CVDataContext = createContext<{
  cvData: CVData;
  setCVData: React.Dispatch<React.SetStateAction<CVData>>;
  setSelectedThemeKey: (themeKey: string | null) => void;
  actions: CVDataActions;
} | undefined>(undefined);

export const CVDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Função para migrar experiências antigas
  const migrateExperience = (exp: any): Experience => {
    if (exp.startMonth !== undefined && exp.startYear !== undefined) {
      return exp; // Já migrado
    }
    
    // Tentar extrair data do campo period se existir
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let startMonth = 1, startYear = new Date().getFullYear() - 1;
    let endMonth = 12, endYear = new Date().getFullYear();
    
    if (exp.period && typeof exp.period === 'string') {
      // Tentar fazer parse do período "Jan 2020 - Dez 2022" ou "Jan 2020 - Atual"
      const periodMatch = exp.period.match(/(\w{3})\s+(\d{4})\s*-\s*(\w{3})\s+(\d{4})|(\w{3})\s+(\d{4})\s*-\s*Atual/);
      if (periodMatch) {
        if (periodMatch[1]) {
          startMonth = monthNames.indexOf(periodMatch[1]) + 1 || 1;
          startYear = parseInt(periodMatch[2]) || startYear;
        }
        if (periodMatch[3] && periodMatch[4] && !exp.current) {
          endMonth = monthNames.indexOf(periodMatch[3]) + 1 || 12;
          endYear = parseInt(periodMatch[4]) || endYear;
        }
      }
    }
    
    return {
      ...exp,
      startMonth,
      startYear,
      endMonth: exp.current ? undefined : endMonth,
      endYear: exp.current ? undefined : endYear,
    };
  };

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

  // Migração automática de experiências antigas
  useEffect(() => {
    setCVData((prev) => {
      const needsMigration = prev.experiences.some(exp => 
        exp.startMonth === undefined || exp.startYear === undefined
      );
      
      if (needsMigration) {
        return {
          ...prev,
          experiences: prev.experiences.map(migrateExperience)
        };
      }
      
      return prev;
    });
  }, []);

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
    []
  );

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

  const removeSkill = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

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

  const removeExperience = useCallback((id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

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

  const setSelectedThemeKey = useCallback((themeKey: string | null) => {
    setCVData((prev) => ({
      ...prev,
      selectedThemeKey: themeKey,
    }));
  }, []);

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
