import { useState } from "react";
import { Edit2, Mail, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Save } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import { DEFAULT_FAQS, DEFAULT_FAQ_CATS } from "../data/defaults";
import { inp, ta, btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import CatFilter from "../components/CatFilter";
import EditSection from "../components/EditSection";
import AdminBadge from "../components/AdminBadge";
import AdminBtn from "../components/AdminBtn";
import LoginBox from "../components/LoginBox";

const DEFAULT_FAQ_CONTACT = {
  title: "문의하기",
  desc: "답변을 찾지 못하셨다면 아래 이메일로 문의해 주세요.",
};

const DEFAULT_FAQ_HEADER = {
  label: "FAQ",
  title: "자주 묻는 질문 (FAQ)",
  sub: "궁금하신 점을 빠르게 찾아보세요.",
};

function FaqContactEditor({ faqContact, onSave, onCancel }) {
  const [f, setF] = useState({ ...faqContact });
  return (
    <EditSection title="문의하기 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>제목</label><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>내용</label><textarea value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} style={ta(2)} /></div>
      </div>
    </EditSection>
  );
}

function FaqHeaderEditor({ faqHeader, onSave, onCancel }) {
  const [f, setF] = useState({ ...faqHeader });
  return (
    <EditSection title="페이지 헤더 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>분류명 (상단 작은 글씨)</label><input value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>제목</label><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>부제</label><input value={f.sub} onChange={(e) => setF({ ...f, sub: e.target.value })} style={inp()} /></div>
      </div>
    </EditSection>
  );
}

export default function FaqPage({ adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, onAdminToggle, location }) {
  const [faqs, setFaqs] = useStorage("rtac_faqs", DEFAULT_FAQS);
  const [faqCats, setFaqCats] = useStorage("rtac_faq_cats", DEFAULT_FAQ_CATS);
  const [faqHeader, setFaqHeader] = useStorage("rtac_faq_header", DEFAULT_FAQ_HEADER);
  const [faqContact, setFaqContact] = useStorage("rtac_faq_contact", DEFAULT_FAQ_CONTACT);

  const [editingHeader, setEditingHeader] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [faqCatEditMode, setFaqCatEditMode] = useState(false);
  const [faqCatDragIdx, setFaqCatDragIdx] = useState(null);
  const [faqCat, setFaqCat] = useState("전체");
  const [openFaq, setOpenFaq] = useState(null);
  const [faqEdit, setFaqEdit] = useState(null);
  const [faqForm, setFaqForm] = useState({ cat: "이용 안내", q: "", a: "" });

  const filteredFaqs = faqCat === "전체" ? faqs : faqs.filter((f) => f.cat === faqCat);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PageHeader label={faqHeader.label} title={faqHeader.title} sub={faqHeader.sub} />
        <AdminBtn adminMode={adminMode} onToggle={onAdminToggle} />
      </div>
      <LoginBox showLogin={showLogin} adminMode={adminMode} adminPw={adminPw} onAdminPwChange={onAdminPwChange} onLogin={onLogin} onClose={onLoginClose} />
      {adminMode && <AdminBadge onLogout={onLogout} />}

      {/* 헤더 수정 버튼 */}
      {adminMode && !editingHeader && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => setEditingHeader(true)} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "1px solid #e2e8f0", fontSize: 12 }}><Edit2 size={13} />헤더 수정</button>
        </div>
      )}

      {/* 헤더 수정 폼 */}
      {adminMode && editingHeader && (
        <FaqHeaderEditor
          faqHeader={faqHeader}
          onSave={(v) => { setFaqHeader(v); setEditingHeader(false); }}
          onCancel={() => setEditingHeader(false)}
        />
      )}

      {/* 관리자 도구 */}
      {adminMode && (
        <div style={{ marginBottom: 20 }}>
          {/* 카테고리 편집 */}
          {faqCatEditMode ? (
            <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 16, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 10 }}>카테고리 편집</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                {faqCats.map((c, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => setFaqCatDragIdx(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (faqCatDragIdx === null || faqCatDragIdx === i) return;
                      const a = [...faqCats]; const [m] = a.splice(faqCatDragIdx, 1); a.splice(i, 0, m);
                      setFaqCats(a); setFaqCatDragIdx(null);
                    }}
                    style={{ display: "flex", gap: 8, alignItems: "center", background: "#fff", borderRadius: 6, border: "1px solid #e2e8f0", padding: "6px 10px", cursor: "grab" }}
                  >
                    <GripVertical size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                    <input value={c} onChange={(e) => { const a = [...faqCats]; a[i] = e.target.value; setFaqCats(a); }} style={{ ...inp(), flex: 1, padding: "5px 8px" }} />
                    <button onClick={() => { if (faqCats.length <= 1) { alert("최소 1개 이상이어야 합니다."); return; } const a = faqCats.filter((_, x) => x !== i); setFaqCats(a); if (faqCat === c) setFaqCat("전체"); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "5px 7px" }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setFaqCats([...faqCats, "새 카테고리"])} style={{ ...btn("#f1f5f9", "#475569"), fontSize: 12 }}><Plus size={12} />카테고리 추가</button>
                <button onClick={() => setFaqCatEditMode(false)} style={{ ...btn(), fontSize: 12 }}><Save size={12} />완료</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setFaqCatEditMode(true)} style={{ ...btn("#f8fafc", "#475569"), border: "1px solid #e2e8f0", fontSize: 12, marginBottom: 12 }}><Edit2 size={13} />카테고리 편집</button>
          )}

          {/* FAQ 추가/수정 폼 */}
          {faqEdit !== null ? (
            <EditSection
              title={faqEdit === "new" ? "FAQ 추가" : "FAQ 수정"}
              onSave={() => {
                if (!faqForm.q || !faqForm.a) { alert("질문과 답변을 입력해 주세요."); return; }
                if (faqEdit === "new") setFaqs([...faqs, { id: Date.now(), ...faqForm }]);
                else setFaqs(faqs.map((f) => f.id === faqEdit ? { ...f, ...faqForm } : f));
                setFaqEdit(null); setFaqForm({ cat: faqCats[0] || "", q: "", a: "" });
              }}
              onCancel={() => { setFaqEdit(null); setFaqForm({ cat: faqCats[0] || "", q: "", a: "" }); }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                {faqCats.map((c) => (
                  <button key={c} onClick={() => setFaqForm({ ...faqForm, cat: c })} style={{ ...btn(faqForm.cat === c ? "#1e3a5f" : "#f1f5f9", faqForm.cat === c ? "#fff" : "#475569"), fontSize: 12 }}>{c}</button>
                ))}
              </div>
              <input value={faqForm.q} onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })} placeholder="질문" style={{ ...inp(), marginBottom: 10 }} />
              <textarea value={faqForm.a} onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })} placeholder="답변" style={ta(3)} />
            </EditSection>
          ) : (
            <button onClick={() => { setFaqForm({ cat: faqCats[0] || "", q: "", a: "" }); setFaqEdit("new"); }} style={btn()}><Plus size={14} />FAQ 추가</button>
          )}
        </div>
      )}

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
              {adminMode && (
                <div style={{ display: "flex", gap: 6, padding: "0 14px", flexShrink: 0 }}>
                  <button onClick={() => { setFaqForm({ cat: f.cat, q: f.q, a: f.a }); setFaqEdit(f.id); }} style={{ ...btn("#f1f5f9", "#475569"), padding: "5px 7px" }}><Edit2 size={12} /></button>
                  <button onClick={() => { if (confirm("삭제하시겠습니까?")) setFaqs(faqs.filter((x) => x.id !== f.id)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "5px 7px" }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
            {openFaq === f.id && (
              <div style={{ padding: "0 20px 16px", fontSize: 13, color: "#475569", lineHeight: 1.9, borderTop: "0.5px solid #f8fafc", paddingTop: 12, textAlign: "left" }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* 문의하기 수정 버튼 */}
      {adminMode && !editingContact && (
        <div style={{ marginTop: 32 }}>
          <button onClick={() => setEditingContact(true)} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "1px solid #e2e8f0", fontSize: 12 }}><Edit2 size={13} />문의하기 수정</button>
        </div>
      )}

      {/* 문의하기 수정 폼 */}
      {adminMode && editingContact && (
        <div style={{ marginTop: 32 }}>
          <FaqContactEditor
            faqContact={faqContact}
            onSave={(v) => { setFaqContact(v); setEditingContact(false); }}
            onCancel={() => setEditingContact(false)}
          />
        </div>
      )}

      {/* 문의하기 표시 */}
      {!editingContact && (
        <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: adminMode ? 12 : 32, border: "1px solid #bfdbfe" }}>
          <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{faqContact.title}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{faqContact.desc}</div>
            <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{location.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}
