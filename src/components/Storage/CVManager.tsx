import React, { useMemo, useState } from "react";
import {
  listCVs,
  createCV,
  renameCV,
  deleteCV,
  getDoc,
} from "../../services/storageService";
import ImportExport from "./ImportExport";
import type { CVMeta } from "../../types/storage.types";

type Props = {
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

const isEmptyObject = (v: unknown) =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  Object.keys(v as Record<string, unknown>).length === 0;

const CVManager: React.FC<Props> = ({ selectedId, onSelect }) => {
  const [metas, setMetas] = useState<CVMeta[]>(listCVs());
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("Currículo");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const refresh = () => setMetas(listCVs());

  const handleCreate = () => {
    const metasNow = listCVs();
    const finalName = (newName || "").trim() || "Currículo";
    if (
      metasNow.length === 1 &&
      metasNow[0].name.trim().toLowerCase() === "currículo"
    ) {
      const id = metasNow[0].id;
      const doc = getDoc(id);
      const untouched =
        !!doc &&
        isEmptyObject(doc.data) &&
        (doc.versions?.length ?? 0) <= 1 &&
        doc.createdAt === doc.updatedAt;
      if (untouched) {
        renameCV(id, finalName);
        setCreating(false);
        setNewName("Currículo");
        refresh();
        onSelect?.(id);
        return;
      }
    }
    const doc = createCV(finalName, {});
    setCreating(false);
    setNewName("Currículo");
    refresh();
    onSelect?.(doc.id);
  };

  const handleRename = (id: string) => {
    renameCV(id, (editingName || "").trim() || "Currículo");
    setEditingId(null);
    setEditingName("");
    refresh();
  };

  const handleDelete = (id: string) => setConfirmId(id);
  const confirmDelete = () => {
    if (!confirmId) return;
    deleteCV(confirmId);
    const next = listCVs()[0]?.id ?? null;
    onSelect?.(next);
    setConfirmId(null);
    refresh();
  };

  const selected = useMemo(
    () => metas.find((m) => m.id === selectedId) ?? null,
    [metas, selectedId]
  );

  return (
    <div className="cv-manager">
      <div className="cv-manager-header">
        <h3>Currículos</h3>
        {!creating ? (
          <button onClick={() => setCreating(true)}>Novo</button>
        ) : (
          <div className="cv-create-inline">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do currículo"
              autoFocus
            />
            <button onClick={handleCreate}>Criar</button>
            <button
              onClick={() => {
                setCreating(false);
                setNewName("Currículo");
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <ul className="cv-list">
        {metas.map((m) => {
          const isSel = m.id === selectedId;
          return (
            <li
              key={m.id}
              className={isSel ? "selected" : ""}
              onClick={() => onSelect?.(m.id)} // ← seleção só aqui
              style={{ cursor: "pointer" }}
            >
              {editingId === m.id ? (
                <div
                  className="cv-edit-inline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => handleRename(m.id)}>Salvar</button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="cv-row" onClick={(e) => e.stopPropagation()}>
                  {/* botão de nome sem onClick extra para não duplicar seleção */}
                  <button className="cv-name" type="button">
                    {m.name}
                  </button>
                  <div className="cv-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(m.id);
                        setEditingName(m.name);
                      }}
                    >
                      Renomear
                    </button>
                    <button type="button" onClick={() => handleDelete(m.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
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
            className="cv-manager"
            style={{
              width: "min(420px, 92vw)",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 25px rgba(0,0,0,.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Excluir currículo
            </h4>
            <p
              style={{ margin: "10px 0 16px", fontSize: 14, color: "#374151" }}
            >
              Tem certeza que deseja excluir este currículo? Essa ação não pode
              ser desfeita.
            </p>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button onClick={() => setConfirmId(null)}>Cancelar</button>
              <button
                onClick={confirmDelete}
                style={{
                  borderColor: "#fecaca",
                  color: "#b91c1c",
                  background: "#fff",
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
