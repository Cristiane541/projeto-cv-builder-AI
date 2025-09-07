import { useState } from 'react';
import type { CVData, PersonalInfo, Skill, Experience, CVDataActions } from '../types/cv.types';

// Hook para gerenciar o estado central do currículo
export function useCVData() {
  const [cvData, setCVData] = useState<CVData>({
    personal: {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      summary: '',
    },
    skills: [],
    experiences: [],
  });

  // Atualiza dados pessoais
  function updatePersonalInfo(field: keyof PersonalInfo, value: string) {
    setCVData((prev) => {
      // Evita re-renderização desnecessária se o valor não mudou
      if (prev.personal[field] === value) {
        return prev;
      }
      
      return {
        ...prev,
        personal: { ...prev.personal, [field]: value },
      };
    });
  }

  // Adiciona uma habilidade
  function addSkill(skill: Omit<Skill, 'id'>) {
    const newSkill: Skill = {
      ...skill,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  }

  // Remove uma habilidade
  function removeSkill(id: string) {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }

  // Atualiza uma habilidade
  function updateSkill(id: string, updates: Partial<Omit<Skill, 'id'>>) {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    }));
  }

  // Adiciona uma experiência
  function addExperience(experience: Omit<Experience, 'id'>) {
    const newExperience: Experience = {
      ...experience,
      id: crypto.randomUUID(),
    };
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  }

  // Remove uma experiência
  function removeExperience(id: string) {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }

  // Atualiza uma experiência
  function updateExperience(id: string, updates: Partial<Omit<Experience, 'id'>>) {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  }

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

  return {
    cvData,
    actions,
    setCVData,
  };
}