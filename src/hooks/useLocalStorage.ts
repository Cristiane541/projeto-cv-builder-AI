import { useEffect, useRef, useState } from "react";
import { safeParse, safeStringify } from "../utils/dataHelpers";

type Serializer<T> = (v: T) => string;
type Deserializer<T> = (v: string | null) => T;

interface Options<T> {
  serialize?: Serializer<T>;
  deserialize?: Deserializer<T>;
  syncAcrossTabs?: boolean;
}

const isBrowser = typeof window !== "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
) {
  const serialize = options?.serialize ?? ((v: T) => safeStringify(v));
  const deserialize =
    options?.deserialize ??
    ((v: string | null) => safeParse<T>(v, initialValue));
  const syncAcrossTabs = options?.syncAcrossTabs ?? true;

  const read = (): T => {
    if (!isBrowser) return initialValue;
    return deserialize(localStorage.getItem(key));
  };

  const [value, setValue] = useState<T>(read);
  const isFirst = useRef(true);

  useEffect(() => {
    if (!isBrowser) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // storage cheio/bloqueado
    }
  }, [key, value, serialize]);

  useEffect(() => {
    if (!isBrowser || !syncAcrossTabs) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, syncAcrossTabs]);

  const clear = () => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, clear] as const;
}
