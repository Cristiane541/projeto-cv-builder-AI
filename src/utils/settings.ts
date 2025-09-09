const STORAGE_KEY = "cvbuilder:gemini_api_key";

export function getStoredGeminiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredGeminiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {}
}

export function clearStoredGeminiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function getActiveGeminiKey(): string {
  console.log('🔑 Verificando chave da API...');
  
  // 1. Primeiro tenta localStorage
  const override = getStoredGeminiKey();
  console.log('💾 Chave do localStorage:', override ? '✅ ENCONTRADA' : '❌ VAZIA');
  if (override) {
    console.log('✅ Usando chave do localStorage');
    return override;
  }

  // 2. Tenta várias formas de acessar variáveis de ambiente
  try {
    console.log('🔍 Debug - import.meta completo:', import.meta);
    console.log('🔍 Debug - import.meta.env completo:', (import.meta as any)?.env);
    
    // Método 1: import.meta.env direto
    let envKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    console.log('📁 Método 1 - Chave do .env:', envKey ? '✅ ENCONTRADA' : '❌ NÃO ENCONTRADA');
    
    // Método 2: process.env (para casos onde import.meta não funciona)
    if (!envKey && typeof process !== 'undefined' && process.env) {
      envKey = (process.env as any).VITE_GEMINI_API_KEY;
      console.log('📁 Método 2 - process.env:', envKey ? '✅ ENCONTRADA' : '❌ NÃO ENCONTRADA');
    }
    
    // Método 3: window.__ENV__ (se definido)
    if (!envKey && typeof window !== 'undefined' && (window as any).__ENV__) {
      envKey = (window as any).__ENV__.VITE_GEMINI_API_KEY;
      console.log('📁 Método 3 - window.__ENV__:', envKey ? '✅ ENCONTRADA' : '❌ NÃO ENCONTRADA');
    }
    
    console.log('📁 Valor final da chave:', envKey ? envKey.substring(0, 10) + '...' : 'undefined');
    console.log('📁 Tipo da chave:', typeof envKey);
    
    if (typeof envKey === "string" && envKey && envKey.trim()) {
      console.log('✅ Usando chave do arquivo .env');
      return envKey.trim();
    }
    
    console.log('❌ Nenhuma chave encontrada em nenhum método');
    return "";
  } catch (error) {
    console.log('❌ Erro ao acessar variáveis de ambiente:', error);
    return "";
  }
}