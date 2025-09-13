import { v4 as uuid } from "uuid";
import { differenceInHours } from "date-fns";
import type {
  CVDocument,
  CVMeta,
  CVVersion,
  CVData,
  ExportBundleV1,
  ImportStrategy,
} from "../types/storage.types";
import {
  safeParse,
  safeStringify,
  nowISO,
  shallowMeta,
  isExportBundleV1,
  mergeDocs,
} from "../utils/dataHelpers";

const isBrowser = typeof window !== "undefined";

// Configurações
const MAX_VERSIONS = 50;
const BACKUP_RETENTION_DAYS = 7;

// Chaves
const INDEX_KEY = "cv.index";
const DOC_KEY = (id: string) => `cv.doc.${id}`;
const LAST_BACKUP_AT = "cv.backup.lastAt";
const BACKUP_KEY = (ts: string) => `cv.backup.${ts}`;

// localStorage wrappers
function lsGet<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  return safeParse<T>(localStorage.getItem(key), fallback);
}
function lsSet(key: string, value: unknown): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, safeStringify(value));
  } catch {
    // quota cheia
  }
}
function lsRemove(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

// Index
function getIndex(): CVMeta[] {
  const arr = lsGet<CVMeta[]>(INDEX_KEY, []);
  return Array.isArray(arr) ? arr : [];
}
function setIndex(index: CVMeta[]): void {
  lsSet(INDEX_KEY, index);
}
function upsertIndex(meta: CVMeta): void {
  const index = getIndex();
  const i = index.findIndex((m) => m.id === meta.id);
  if (i >= 0) index[i] = meta;
  else index.push(meta);
  index.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  setIndex(index);
}

// Documentos
export function getDoc(id: string): CVDocument | null {
  return lsGet<CVDocument | null>(DOC_KEY(id), null);
}
function setDoc(doc: CVDocument): void {
  lsSet(DOC_KEY(doc.id), doc);
  upsertIndex(shallowMeta(doc));
  maybeAutoBackup();
}

export function listCVs(): CVMeta[] {
  return getIndex();
}

export function createCV(name?: string, initialData: CVData = {}): CVDocument {
  const id = uuid();
  const now = nowISO();
  const doc: CVDocument = {
    id,
    name: name?.trim() || "Currículo",
    createdAt: now,
    updatedAt: now,
    data: initialData,
    versions: [
      {
        id: uuid(),
        createdAt: now,
        label: "Inicial",
        data: initialData,
      },
    ],
  };
  setDoc(doc);
  return doc;
}

export function renameCV(id: string, newName: string): CVDocument {
  const doc = getDoc(id);
  if (!doc) throw new Error("Documento não encontrado");
  const name = newName.trim();
  if (name.length === 0) return doc;
  doc.name = name;
  doc.updatedAt = nowISO();
  setDoc(doc);
  return doc;
}

export function deleteCV(id: string): void {
  const doc = getDoc(id);
  if (!doc) return;
  lsRemove(DOC_KEY(id));
  const index = getIndex().filter((m) => m.id !== id);
  setIndex(index);
}

export function updateData(
  id: string,
  data: CVData,
  opts?: { saveAsVersion?: boolean; label?: string }
): CVDocument {
  const doc = getDoc(id);
  if (!doc) throw new Error("Documento não encontrado");

  const same = safeStringify(data) === safeStringify(doc.data);
  if (same && !opts?.saveAsVersion) return doc;

  doc.data = data;
  doc.updatedAt = nowISO();

  if (opts?.saveAsVersion) {
    const version: CVVersion = {
      id: uuid(),
      createdAt: nowISO(),
      label: opts.label,
      data,
    };
    doc.versions.unshift(version);
    if (doc.versions.length > MAX_VERSIONS)
      doc.versions = doc.versions.slice(0, MAX_VERSIONS);
  }

  setDoc(doc);
  return doc;
}

export function listVersions(id: string): CVVersion[] {
  const doc = getDoc(id);
  if (!doc) throw new Error("Documento não encontrado");
  return doc.versions.slice();
}

export function restoreVersion(id: string, versionId: string): CVDocument {
  const doc = getDoc(id);
  if (!doc) throw new Error("Documento não encontrado");
  const v = doc.versions.find((x) => x.id === versionId);
  if (!v) throw new Error("Versão não encontrada");
  doc.data = v.data;
  doc.updatedAt = nowISO();
  setDoc(doc);
  return doc;
}

// Export / Import
export function exportBundle(ids?: string[]): ExportBundleV1 {
  const metas = listCVs();
  const selected =
    ids && ids.length ? metas.filter((m) => ids.includes(m.id)) : metas;
  const items: CVDocument[] = selected
    .map((m) => getDoc(m.id))
    .filter((d): d is CVDocument => !!d);

  return {
    schema: "cv.export.v1",
    exportedAt: nowISO(),
    items,
  };
}

export function importBundle(
  bundle: unknown,
  strategy: ImportStrategy = "merge"
): number {
  if (!isExportBundleV1(bundle)) throw new Error("Arquivo inválido");

  const metas = listCVs();
  const map = new Map(metas.map((m) => [m.id, getDoc(m.id)]));

  let count = 0;

  if (strategy === "replace") {
    metas.forEach((m) => {
      lsRemove(DOC_KEY(m.id));
    });
    setIndex([]);
  }

  for (const incoming of (bundle as ExportBundleV1).items) {
    const existing = map.get(incoming.id) || null;
    const next = existing ? mergeDocs(existing, incoming) : incoming;
    setDoc(next);
    count++;
  }

  return count;
}

// Backups
function cleanupOldBackups(now = new Date()): void {
  if (!isBrowser) return;
  const total = localStorage.length;
  for (let i = 0; i < total; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("cv.backup.")) continue;
    const iso = key.replace("cv.backup.", "");
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) continue;
    const ageDays = (now.getTime() - dt.getTime()) / 86400000;
    if (ageDays > BACKUP_RETENTION_DAYS) lsRemove(key);
  }
}

function maybeAutoBackup(): void {
  if (!isBrowser) return;
  const last = lsGet<string | null>(LAST_BACKUP_AT, null);
  const now = new Date();
  if (last) {
    const diff = differenceInHours(now, new Date(last));
    if (diff < 24) return;
  }
  const bundle = exportBundle();
  const ts = now.toISOString();
  lsSet(BACKUP_KEY(ts), bundle);
  lsSet(LAST_BACKUP_AT, ts);
  cleanupOldBackups(now);
}

// Autosave utilitário
export function autoSave(
  id: string,
  getData: () => CVData,
  intervalMs = 2000
): { start: () => void; stop: () => void } {
  let h: number | null = null;

  const tick = () => {
    try {
      updateData(id, getData());
    } catch {
      // ignore
    }
  };

  const start = () => {
    if (h != null) return;
    tick();
    h = window.setInterval(tick, intervalMs);
  };

  const stop = () => {
    if (h == null) return;
    window.clearInterval(h);
    h = null;
  };

  return { start, stop };
}
