// Versão de debug do App para identificar o problema
import React, { useState } from "react";

function AppDebug() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  console.log("AppDebug renderizando...", { name, email });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Teste de Digitação
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.25rem",
              }}
            >
              Nome:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                console.log("Mudando nome:", e.target.value);
                setName(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                outline: "none",
              }}
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.25rem",
              }}
            >
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                console.log("Mudando email:", e.target.value);
                setEmail(e.target.value);
              }}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                outline: "none",
              }}
              placeholder="Digite seu email"
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
          }}
        >
          <strong>Debug:</strong>
          <br />
          Nome: "{name}"<br />
          Email: "{email}"
        </div>
      </div>
    </div>
  );
}

export default AppDebug;
