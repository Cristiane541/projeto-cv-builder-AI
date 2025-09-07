// Funções de validação de dados do formulário

// Validação de email
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email deve ter um formato válido' };
  }
  
  return { isValid: true };
};

// Validação de nome
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  return { isValid: true };
};

// Validação de telefone
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Telefone é obrigatório' };
  }
  
  // Remove caracteres não numéricos para validação
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return { isValid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
  }
  
  return { isValid: true };
};

// Validação de LinkedIn
export const validateLinkedIn = (linkedin: string): { isValid: boolean; error?: string } => {
  if (!linkedin.trim()) {
    return { isValid: true }; // LinkedIn é opcional
  }
  
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  if (!linkedinRegex.test(linkedin)) {
    return { isValid: false, error: 'URL do LinkedIn deve ter formato válido (ex: https://linkedin.com/in/seuperfil)' };
  }
  
  return { isValid: true };
};

// Validação de resumo
export const validateSummary = (summary: string, maxLength: number = 500): { isValid: boolean; error?: string } => {
  if (!summary.trim()) {
    return { isValid: false, error: 'Resumo profissional é obrigatório' };
  }
  
  if (summary.length > maxLength) {
    return { isValid: false, error: `Resumo deve ter no máximo ${maxLength} caracteres` };
  }
  
  if (summary.trim().length < 50) {
    return { isValid: false, error: 'Resumo deve ter pelo menos 50 caracteres' };
  }
  
  return { isValid: true };
};

// Formatação de telefone
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};
