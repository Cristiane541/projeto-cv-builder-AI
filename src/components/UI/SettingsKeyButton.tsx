import React from "react";
import { createPortal } from "react-dom";
import {
  getStoredGeminiKey,
  setStoredGeminiKey,
  clearStoredGeminiKey,
} from "../../utils/settings";

/**
 * Botão flutuante + modal para gerenciar a API key do Gemini
 * - Usa portal (não interfere no layout/CSS da página)
 * - Salva em localStorage (tem prioridade sobre .env)
 */
const SettingsKeyButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>(getStoredGeminiKey() || "");
  const [show, setShow] = React.useState(false);
  const [msg, setMsg] = React.useState<string>("");

  const onOpen = () => {
    setMsg("");
    setValue(getStoredGeminiKey() || "");
    setOpen(true);
  };

  const onSave = () => {
    if (!value.trim()) {
      setMsg("Informe uma chave válida ou use Limpar para remover.");
      return;
    }
    setStoredGeminiKey(value.trim());
    setMsg("Chave salva. As próximas chamadas usarão esta chave.");
    setTimeout(() => setOpen(false), 700);
  };

  const onClear = () => {
    clearStoredGeminiKey();
    setValue("");
    setMsg("Chave removida. Voltará a usar a do .env (se existir).");
    setTimeout(() => setOpen(false), 700);
  };

  const node = (
    <>
      {/* Botão flutuante (portal) */}
      <button
        onClick={onOpen}
        title="Configurar chave da IA (Gemini)"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          padding: "10px 14px",
          background: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: 9999,
          boxShadow: "0 6px 18px rgba(0,0,0,.15)",
          zIndex: 2147483647,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        ⚙︎ Config
      </button>

      {/* Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-modal="true"
          role="dialog"
        >
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.4)",
            }}
          />
          <div
            style={{
              position: "relative",
              background: "#fff",
              width: "100%",
              maxWidth: 520,
              margin: "0 16px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              boxShadow: "0 24px 48px rgba(0,0,0,.25)",
              padding: 24,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              Chave da IA (Gemini)
            </h3>
            <p style={{ fontSize: 14, color: "#4b5563", marginBottom: 14 }}>
              A chave salva aqui tem prioridade sobre a do <code>.env</code>.
            </p>

            <label
              htmlFor="gemini-key"
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              API Key
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="gemini-key"
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ex.: AIxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 14,
                }}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {msg && (
              <p style={{ fontSize: 13, color: "#4b5563", marginTop: 10 }}>
                {msg}
              </p>
            )}

            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Fechar
              </button>
              <button
                onClick={onClear}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Limpar
              </button>
              <button
                onClick={onSave}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(node, document.body);
};

export default SettingsKeyButton;
