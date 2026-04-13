import { Mail } from "lucide-react";

export default function ContactBanner({ email }) {
  return (
    <div style={{ background: "#dbeafe", borderRadius: 12, padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
      <Mail size={18} color="#1d4ed8" />
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>문의하기</div>
        <div style={{ fontSize: 13, color: "#334155", marginTop: 2 }}>{email}로 문의해 주시면 담당자가 안내해 드립니다.</div>
      </div>
    </div>
  );
}
