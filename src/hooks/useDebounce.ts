// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um timer que só vai atualizar o valor "debounced"
    // depois que o usuário parar de digitar por `delay` milissegundos
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Isso limpa o timer se o valor mudar (ex: usuário continua digitando)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Só re-executa se o valor ou o delay mudar

  return debouncedValue;
}
