import React, { useRef, useState } from "react";
import { Download, Upload, FileArrowDown } from "phosphor-react";
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

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#fff',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #0073b1 0%, #005a87 100%)',
    color: '#fff',
  };

  const importButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    color: '#fff',
  };

  return (
    <Wrapper>
      <div className="row" style={{ 
        marginBottom: 16, 
        display: 'flex', 
        gap: 12, 
        flexWrap: 'wrap' 
      }}>
        <button 
          onClick={onExportSelected}
          style={primaryButtonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
          }}
        >
          <Download size={18} weight="bold" />
          Exportar selecionado
        </button>
        <button 
          onClick={onExportAll}
          style={secondaryButtonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,115,177,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
          }}
        >
          <FileArrowDown size={18} weight="bold" />
          Exportar todos
        </button>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={onFilePicked}
          style={{ display: 'none' }}
        />
        <button 
          onClick={onClickImport}
          style={importButtonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(217,119,6,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
          }}
        >
          <Upload size={18} weight="bold" />
          Importar
        </button>
      </div>

      {status && (
        <small style={{
          display: 'block',
          padding: '8px 12px',
          background: '#f0f9ff',
          color: '#0369a1',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          border: '1px solid #bae6fd',
        }}>
          {status}
        </small>
      )}
    </Wrapper>
  );
};

export default ImportExport;
