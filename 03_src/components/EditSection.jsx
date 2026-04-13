import { Save, XCircle } from "lucide-react";
import { btn } from "./styles";

export default function EditSection({ title, onSave, onCancel, children }) {
  return (
    <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 20, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 14 }}>{title}</div>
      {children}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button onClick={onSave} style={btn()}><Save size={13} />저장</button>
        <button onClick={onCancel} style={btn("#f1f5f9", "#475569")}><XCircle size={13} />취소</button>
      </div>
    </div>
  );
}
