import React, { useRef, useState } from "react";
import {
  downloadJSON,
  isExportBundleV1,
  makeFilename,
} from "../../utils/dataHelpers";
import { exportBundle, importBundle } from "../../services/storageService";
import type { ExportBundleV1 } from "../../types/storage.types";

type Props = {
  selectedId?: string | null;
  embedded?: boolean;
};

const ImportExport: React.FC<Props> = ({ selectedId, embedded }) => {
  const [status, setStatus] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onExportSelected = () => {
    if (!selectedId) {
      setStatus("Selecione um currículo para exportar.");
      return;
    }
    downloadJSON(makeFilename("cv-selected"), exportBundle([selectedId]));
    setStatus("Exportado currículo selecionado.");
  };

  const onExportAll = () => {
    downloadJSON(makeFilename("cv-all"), exportBundle());
    setStatus("Exportados todos os currículos.");
  };

  const onClickImport = () => fileRef.current?.click();

  const onFilePicked: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      if (!isExportBundleV1(json)) {
        setStatus("Arquivo inválido.");
        e.target.value = "";
        return;
      }
      const count = importBundle(json as ExportBundleV1, "merge");
      setStatus(`Importados ${count} currículo(s).`);
    } catch {
      setStatus("Falha ao importar.");
    } finally {
      e.target.value = "";
    }
  };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    embedded ? (
      <div>{children}</div>
    ) : (
      <div className="cv-import-export">{children}</div>
    );

  return (
    <Wrapper>
      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={onExportSelected}>Exportar selecionado</button>
        <button onClick={onExportAll}>Exportar todos</button>
      </div>

      <div className="row">
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={onFilePicked}
          className="hidden"
        />
        <button onClick={onClickImport}>Importar</button>
      </div>

      {status && <small>{status}</small>}
    </Wrapper>
  );
};

export default ImportExport;
