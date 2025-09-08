import React from "react";
import { createPortal } from "react-dom";

const DebugFloating: React.FC = () => {
  console.log("[DebugFloating] montado");
  const node = (
    <button
      onClick={() => alert("Debug OK")}
      style={{
        position: "fixed",
        inset: "auto 24px 24px auto", // bottom-right
        width: 64,
        height: 64,
        borderRadius: 9999,
        background: "hotpink",
        color: "#111",
        fontWeight: 700,
        border: "2px solid #fff",
        boxShadow: "0 6px 18px rgba(0,0,0,.25)",
        zIndex: 2147483647, // acima de tudo
        cursor: "pointer",
      }}
      title="Debug Floating"
    >
      CFG
    </button>
  );
  return createPortal(node, document.body);
};

export default DebugFloating;
