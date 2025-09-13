export type ISODate = string;

export interface CVData {
  [key: string]: unknown;
}

export interface CVVersion {
  id: string;
  createdAt: ISODate;
  label?: string;
  data: CVData;
}

export interface CVMeta {
  id: string;
  name: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CVDocument extends CVMeta {
  data: CVData;
  versions: CVVersion[];
}

export interface ExportBundleV1 {
  schema: "cv.export.v1";
  exportedAt: ISODate;
  items: CVDocument[];
}

export type ImportStrategy = "merge" | "replace";
