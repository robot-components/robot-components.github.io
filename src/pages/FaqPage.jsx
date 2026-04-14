import { useState } from "react";
import { Mail, ChevronDown, ChevronUp } from "lucide-react";
import { DEFAULT_FAQS, DEFAULT_FAQ_CATS } from "../data/defaults";
import PageHeader from "../components/PageHeader";
import CatFilter from "../components/CatFilter";

const FAQ_HEADER = { label: "FAQ", title: "자주 묻는 질문 (FAQ)", sub: "" };
const FAQ_CONTACT = { title: "문의하기", desc: "기타 문의사항은 아래 이메일로 문의해 주시기 바랍니다." };

export default function FaqPage({ location }) {
  const faqs = DEFAULT_FAQS;
  const faqCats = DEFAULT_FAQ_CATS;
  const [faqCat, setFaqCat] = useState("전체");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = faqCat === "전체" ? faqs : faqs.filter((f) => f.cat === faqCat);

  return (
    <div>
      <PageHeader label={FAQ_HEADER.label} title={FAQ_HEADER.title} sub={FAQ_HEADER.sub} />

      <CatFilter cats={faqCats} active={faqCat} setActive={setFaqCat} />

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        {filteredFaqs.map((f, idx) => (
          <div key={f.id} style={{ background: "#fff", borderBottom: idx < filteredFaqs.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                style={{ flex: 1, background: "none", border: "none", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", fontFamily: "inherit", gap: 10 }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#f1f5f9", color: "#64748b", flexShrink: 0 }}>{f.cat}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{f.q}</span>
                </div>
                {openFaq === f.id ? <ChevronUp size={15} color="#94a3b8" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="#94a3b8" style={{ flexShrink: 0 }} />}
              </button>
            </div>
            {openFaq === f.id && (
              <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#475569", lineHeight: 1.9, borderTop: "0.5px solid #f8fafc", paddingTop: 12, textAlign: "left" }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* 문의하기 */}
      <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: 32, border: "1px solid #bfdbfe" }}>
        <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{FAQ_CONTACT.title}</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{FAQ_CONTACT.desc}</div>
          <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{location.email}</div>
        </div>
      </div>
    </div>
  );
}
