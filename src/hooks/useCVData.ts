import { useState } from 'react';
import { CVData, PersonalInfo, Skill, Experience } from '../types/cv.types';

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
  function updatePersonalInfo(info: Partial<PersonalInfo>) {
    setCVData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...info },
    }));
  }

  // Adiciona uma habilidade
  function addSkill(skill: Skill) {
    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  }

  // Remove uma habilidade
  function removeSkill(id: string) {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }

  // Adiciona uma experiência
  function addExperience(exp: Experience) {
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, exp],
    }));
  }

  // Remove uma experiência
  function removeExperience(id: string) {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }

  return {
    cvData,
    updatePersonalInfo,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    setCVData,
  };
}