import { Save, XCircle } from "lucide-react";
import { btn } from "./styles";

export default function EditSection({ title, onSave, onCancel, children }) {
  return (
    <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 20, marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #fde68a" }}>{title}</div>
      {children}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={onSave} style={btn()}><Save size={13} />저장</button>
        <button onClick={onCancel} style={btn("#f1f5f9", "#64748b")}><XCircle size={13} />취소</button>
      </div>
    </div>
  );
}
