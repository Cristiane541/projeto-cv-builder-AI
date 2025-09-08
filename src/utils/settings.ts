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
  const override = getStoredGeminiKey();
  if (override) return override;

  // bypass de tipos: evita erro “import.meta.env” não existe
  try {
    const envKey = (import.meta as any)?.env?.VITE_GEMINI_API_KEY;
    return typeof envKey === "string" ? envKey : "";
  } catch {
    return "";
  }
}
