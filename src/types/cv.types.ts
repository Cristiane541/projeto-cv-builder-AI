// Dados pessoais do usuário
export interface PersonalInfo {
  name: string;         // Nome completo
  email: string;        // Email válido
  phone: string;        // Telefone com DDD
  linkedin: string;     // URL do perfil LinkedIn
  summary: string;      // Resumo profissional
}

// Níveis de proficiência para habilidades
export type SkillLevel = 'Básico' | 'Intermediário' | 'Avançado';

// Habilidade individual
export interface Skill {
  id: string;           // Identificador único
  name: string;         // Nome da habilidade
  level: SkillLevel;    // Nível de proficiência
}

// Experiência profissional
export interface Experience {
  id: string;           // Identificador único
  company: string;      // Nome da empresa
  role: string;         // Cargo ocupado
  period: string;       // Período (ex: 2022-2024)
  description: string;  // Descrição das atividades
  current: boolean;     // Se é o trabalho atual
}

// Estrutura completa do currículo
export interface CVData {
  personal: PersonalInfo;
  skills: Skill[];
  experiences: Experience[];
}

// Callbacks para atualização dos dados
export interface CVDataActions {
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, updates: Partial<Omit<Skill, 'id'>>) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, updates: Partial<Omit<Experience, 'id'>>) => void;
}

// Props para componentes de formulário
export interface FormComponentProps {
  data: CVData;
  actions: CVDataActions;
}

// Estados de validação
export interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}