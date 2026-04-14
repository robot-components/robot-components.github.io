import { Mail } from "lucide-react";
import { DEFAULT_KOLAS, DEFAULT_SITE } from "../data/defaults";
import PageHeader from "../components/PageHeader";

const KOLAS_HEADER = { label: "KOLAS", title: "KOLAS 인정 규격 안내", sub: "로봇융합부품지원센터는 KOLAS 공인시험기관으로서 아래 규격에 따른 공인 시험성적서를 발급합니다." };
const KOLAS_CONTACT = { title: "문의하기", desc: "공인 시험성적서 발급 및 시험평가 관련 문의사항은 아래 이메일로 문의해 주시기 바랍니다." };
const KOLAS_SUMMARY = DEFAULT_SITE.kolasSummary;

export default function KolasPage({ location }) {
  return (
    <div>
      <PageHeader label={KOLAS_HEADER.label} title={KOLAS_HEADER.title} sub={KOLAS_HEADER.sub} />

      {/* KOLAS 개요 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 22px", marginBottom: 24, fontSize: 14, color: "#475569", lineHeight: 1.9 }}>{KOLAS_SUMMARY}</div>

      {/* 규격 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {DEFAULT_KOLAS.map((k) => (
          <div key={k.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 22 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ background: "#1e3a5f", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, width: 175, textAlign: "center" }}>{k.code}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px" }}>{k.title}</h3>
                <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.7 }}>{k.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 문의하기 */}
      <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: 32, border: "1px solid #bfdbfe" }}>
        <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{KOLAS_CONTACT.title}</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{KOLAS_CONTACT.desc}</div>
          <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{location.email}</div>
        </div>
      </div>
    </div>
  );
}
