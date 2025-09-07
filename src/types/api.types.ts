// Estrutura da requisição para melhoria de texto via IA
export interface AIEnhanceRequest {
  field: 'summary' | 'experience'; // Campo a ser melhorado
  text: string;                    // Texto original enviado para IA
  context?: string;                // Contexto adicional (ex: cargo, empresa)
}

// Estrutura da resposta da IA
export interface AIEnhanceResponse {
  improvedText: string;            // Texto aprimorado retornado pela IA
  suggestions?: string[];          // Sugestões adicionais (opcional)
  error?: string;                  // Mensagem de erro (se houver)
}

// Estrutura para erros de integração com a API
export interface APIError {
  code: string;                    // Código do erro
  message: string;                 // Descrição amigável do erro
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