// Estrutura da requisição para melhoria de texto via IA
export interface AIEnhanceRequest {
  field: 'summary' | 'experience'; 
  text: string;                    
  context?: string;                
}

// Estrutura da resposta da IA
export interface AIEnhanceResponse {
  improvedText: string;           
  suggestions?: string[];          
  error?: string;                  
}

// Estrutura para erros de integração com a API
export interface APIError {
  code: string;                   
  message: string;                 
}

// Estados de carregamento para operações assíncronas
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Configuração do serviço de IA
export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}