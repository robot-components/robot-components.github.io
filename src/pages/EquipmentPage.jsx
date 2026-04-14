import { useState } from "react";
import { Mail, X } from "lucide-react";
import { DEFAULT_EQUIPMENT, DEFAULT_EQ_CATS } from "../data/defaults";
import { btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import SpecsTable from "../components/SpecsTable";

const EQ_HEADER = { label: "보유 장비", title: "보유 장비 목록", sub: "" };
const EQ_CONTACT = { title: "문의하기", desc: "장비 이용 및 시험평가 관련 문의 사항은 아래 이메일로 연락해 주세요." };

const renderName = (n) =>
  n.split("//").map((p, i, a) => <span key={i}>{p}{i < a.length - 1 && <br />}</span>);

export default function EquipmentPage({ location }) {
  const [eqCat, setEqCat] = useState("전체");
  const [eqModal, setEqModal] = useState(null);

  const filteredEq = eqCat === "전체" ? DEFAULT_EQUIPMENT : DEFAULT_EQUIPMENT.filter((e) => e.cat === eqCat);

  return (
    <div>
      <PageHeader label={EQ_HEADER.label} title={EQ_HEADER.title} sub={EQ_HEADER.sub} />

      {/* 카테고리 필터 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {["전체", ...DEFAULT_EQ_CATS].map((c) => (
            <button key={c} onClick={() => setEqCat(c)} style={{ background: eqCat === c ? "#1e3a5f" : "#fff", color: eqCat === c ? "#fff" : "#475569", border: `1px solid ${eqCat === c ? "#1e3a5f" : "#e2e8f0"}`, padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: eqCat === c ? 600 : 400 }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {filteredEq.map((eq) => (
          <div
            key={eq.id}
            style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", cursor: "default" }}
          >
            <div style={{ background: "#f1f5f9", aspectRatio: "3/2", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12, overflow: "hidden" }}>
              {eq.image ? <img src={eq.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "장비 사진"}
            </div>
            <div style={{ padding: 18 }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>{eq.cat}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "8px 0 14px", lineHeight: 1.5, height: "3em", overflow: "hidden" }}>{renderName(eq.name)}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEqModal(eq)} style={{ ...btn(), flex: 1, justifyContent: "center", fontSize: 12 }}>상세 보기</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 문의하기 */}
      <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: 32, border: "1px solid #bfdbfe" }}>
        <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{EQ_CONTACT.title}</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{EQ_CONTACT.desc}</div>
          <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{location.email}</div>
        </div>
      </div>

      {/* 장비 상세 모달 */}
      {eqModal && (
        <div onClick={() => setEqModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 560, width: "100%", maxHeight: "82vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 13, padding: "2px 8px", borderRadius: 10 }}>{eqModal.cat}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "8px 0 0", lineHeight: 1.4 }}>{renderName(eqModal.name)}</h3>
              </div>
              <button onClick={() => setEqModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            {eqModal.image && <img src={eqModal.image} style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", borderRadius: 8, marginBottom: 20 }} />}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 10 }}>주요 사양</div>
              <SpecsTable specs={eqModal.specs} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 8 }}>주요 용도</div>
              {(eqModal.uses || "").split("\n").filter(Boolean).map((u, i) => (
                <div key={i} style={{ fontSize: 12, color: "#334155", padding: "6px 0", borderBottom: "0.5px solid #f1f5f9" }}>• {u}</div>
              ))}
            </div>
            {eqModal.youtube && (
              <a href={eqModal.youtube} target="_blank" rel="noopener noreferrer" style={{ ...btn(), marginTop: 20, justifyContent: "center", textDecoration: "none", display: "flex" }}>
                i-Tube 바로가기 →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
