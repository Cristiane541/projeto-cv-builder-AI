import { PencilSimple, Trash, Plus } from "phosphor-react";
import React, { useMemo, useState } from "react";
import {
  createCV,
  deleteCV,
  listCVs,
  renameCV,
} from "../../services/storageService";
import ImportExport from "./ImportExport";

interface CVManagerProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
  embedded?: boolean;
}

const CVManager: React.FC<CVManagerProps> = ({
  selectedId,
  onSelect,
  embedded = false,
}) => {
  const [newName, setNewName] = useState("Currículo");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const metas = useMemo(() => listCVs(), [selectedId]);
  const selected = metas.find((m) => m.id === selectedId);

  const handleCreate = () => {
    createCV(newName);
    setNewName("Currículo");
    setCreating(false);
  };

  const handleRename = (id: string) => {
    renameCV(id, editingName);
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (id: string) => {
    setConfirmId(id);
  };

  const confirmDelete = () => {
    if (confirmId) {
      deleteCV(confirmId);
      setConfirmId(null);
    }
  };

  return (
    <div className={`cv-manager ${embedded ? "embedded" : ""}`}>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setCreating(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}
        >
          <Plus size={20} weight="bold" />
          Novo Currículo
        </button>

        {creating && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 12, 
            marginTop: 16,
            padding: 16,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: 12,
            border: '2px solid #e2e8f0'
          }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do currículo"
              autoFocus
              style={{
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={handleCreate} 
                style={{
                  padding: '10px 20px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Criar
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setNewName("Currículo");
                }}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="cv-list">
        {metas.map((m) => (
          <li
            key={m.id}
            className={m.id === selectedId ? "selected" : ""}
            onClick={() => onSelect?.(m.id)}
            style={{ cursor: "pointer" }}
          >
            {editingId === m.id ? (
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: 8,
                    marginBottom: 8,
                    width: '100%',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => handleRename(m.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#059669',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      color: '#4b5563',
                      border: 'none',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <div style={{
                  padding: '14px 18px',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: 12,
                  marginBottom: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#1e293b',
                }}>
                  {m.name}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      setEditingId(m.id);
                      setEditingName(m.name);
                    }}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6,
                      background: '#eaf3fb', 
                      color: '#0073b1', 
                      border: 'none', 
                      borderRadius: 8,
                      padding: '8px 16px', 
                      fontWeight: 600, 
                      fontSize: 15, 
                      cursor: 'pointer',
                    }}
                  >
                    <PencilSimple size={18} /> Renomear
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6,
                      background: '#ffeaea', 
                      color: '#dc2626', 
                      border: 'none', 
                      borderRadius: 8,
                      padding: '8px 16px', 
                      fontWeight: 600, 
                      fontSize: 15, 
                      cursor: 'pointer',
                    }}
                  >
                    <Trash size={18} /> Excluir
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {metas.length === 0 && <li>Nenhum currículo salvo.</li>}
      </ul>

      {selected && (
        <div className="cv-selected-info">
          <small>ID: {selected.id}</small>{" "}
          <small>
            Atualizado: {new Date(selected.updatedAt).toLocaleString()}
          </small>
        </div>
      )}

      <div
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <ImportExport selectedId={selectedId} embedded />
      </div>

      {confirmId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setConfirmId(null)}
        >
          <div
            style={{
              width: "min(420px, 92vw)",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 25px rgba(0,0,0,.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>
              Excluir currículo
            </h4>
            <p style={{ margin: "10px 0 16px", fontSize: 14, color: "#374151" }}>
              Tem certeza que deseja excluir este currículo? Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button 
                onClick={() => setConfirmId(null)}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManager;