import { Mail } from "lucide-react";

export default function ContactBanner({ email }) {
  return (
    <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14, marginTop: 32, border: "1px solid #bfdbfe" }}>
      <Mail size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>문의하기</div>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>{email}로 문의해 주시면 담당자가 안내해 드립니다.</div>
      </div>
    </div>
  );
}
