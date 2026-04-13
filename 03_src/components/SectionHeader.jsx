import { Edit2 } from "lucide-react";
import { btn } from "./styles";

export default function SectionHeader({ title, onEdit, adminMode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{title}</h2>
      {adminMode && (
        <button onClick={onEdit} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "0.5px solid #cbd5e1", padding: "6px 12px", fontSize: 12 }}>
          <Edit2 size={13} />수정
        </button>
      )}
    </div>
  );
}
