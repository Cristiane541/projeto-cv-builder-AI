import { formatISO } from "date-fns";
import type {
  CVDocument,
  CVMeta,
  ExportBundleV1,
} from "../types/storage.types";

export function nowISO(): string {
  return formatISO(new Date());
}

export function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function safeStringify(obj: unknown): string {
  return JSON.stringify(obj);
}

export function downloadJSON(filename: string, data: unknown): void {
  const blob = new Blob([safeStringify(data)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function isExportBundleV1(x: unknown): x is ExportBundleV1 {
  const obj = x as ExportBundleV1;
  return !!obj && obj.schema === "cv.export.v1" && Array.isArray(obj.items);
}

export function shallowMeta(doc: CVDocument): CVMeta {
  const { id, name, createdAt, updatedAt } = doc;
  return { id, name, createdAt, updatedAt };
}

export function mergeDocs(local: CVDocument, incoming: CVDocument): CVDocument {
  if (
    new Date(incoming.updatedAt).getTime() > new Date(local.updatedAt).getTime()
  ) {
    return incoming;
  }
  return local;
}

export function makeFilename(base: string, ext = "json"): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `${base}-${ts}.${ext}`;
}
