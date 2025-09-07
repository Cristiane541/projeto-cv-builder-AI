// Dados pessoais do usuário
export interface PersonalInfo {
  name: string;        
  email: string;        
  phone: string;       
  linkedin: string;   
  summary: string;     
}

// Níveis de proficiência para habilidades
export type SkillLevel = 'Básico' | 'Intermediário' | 'Avançado';

// Habilidade individual
export interface Skill {
  id: string;          
  name: string;        
  level: SkillLevel;    
}

// Experiência profissional
export interface Experience {
  id: string;          
  company: string;     
  role: string;         
  period: string;      
  description: string;  
  current: boolean;   
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