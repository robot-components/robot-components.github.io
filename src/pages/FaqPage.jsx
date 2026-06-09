import { useState, useEffect } from "react";
import { Mail, ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEFAULT_FAQS, DEFAULT_FAQ_CATS } from "../data/defaults";
import PageHeader from "../components/PageHeader";
import CatFilter from "../components/CatFilter";

const FAQ_HEADER = { label: "FAQ", title: "자주 묻는 질문 (FAQ)" };
const DEFAULT_FAQ_CONTACT = { title: "문의하기", desc: "기타 문의사항은 아래 이메일로 문의해 주시기 바랍니다.", email: "" };

const iStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" };
const btnSm = (variant = "default") => ({
  background: variant === "danger" ? "#fee2e2" : variant === "primary" ? "#1e3a5f" : "#f1f5f9",
  color: variant === "danger" ? "#991b1b" : variant === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
});

const EMPTY_FORM = { q: "", a: "", cat: "일반" };

export default function FaqPage({ adminUser, location }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDB, setUseDB] = useState(true);
  const [catFilter, setCatFilter] = useState("전체");
  const [openFaq, setOpenFaq] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [contact, setContact] = useState(DEFAULT_FAQ_CONTACT);
  const [contactEd, setContactEd] = useState(false);
  const [contactData, setContactData] = useState(DEFAULT_FAQ_CONTACT);
  const [contactSaving, setContactSaving] = useState(false);

  useEffect(() => { fetchFaqs(); loadContact(); }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faqs").select("*").order("order_idx").order("created_at");
    if (error || !data) {
      setFaqs(DEFAULT_FAQS);
      setUseDB(false);
    } else {
      setFaqs(data.length > 0 ? data : DEFAULT_FAQS);
      setUseDB(true);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editForm.q.trim() || !editForm.a.trim()) return;
    setSaving(true);
    if (editForm.id) {
      await supabase.from("faqs").update({ q: editForm.q, a: editForm.a, cat: editForm.cat }).eq("id", editForm.id);
    } else {
      const maxIdx = faqs.length > 0 ? Math.max(...faqs.map(f => f.order_idx ?? 0)) : -1;
      await supabase.from("faqs").insert({ q: editForm.q, a: editForm.a, cat: editForm.cat, order_idx: maxIdx + 1 });
    }
    setSaving(false);
    setEditForm(null);
    fetchFaqs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    if (openFaq === id) setOpenFaq(null);
    fetchFaqs();
  };

  const loadContact = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "faq_contact").single();
    if (data?.value) setContact(data.value);
  };

  const saveContact = async () => {
    setContactSaving(true);
    await supabase.from("site_settings").upsert({ key: "faq_contact", value: contactData });
    setContact(contactData);
    setContactSaving(false);
    setContactEd(false);
  };

  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  };
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const newOrder = [...sortedFiltered];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    await Promise.all(newOrder.map((item, i) =>
      supabase.from("faqs").update({ order_idx: i }).eq("id", item.id)
    ));
    setDragIdx(null);
    setDragOverIdx(null);
    fetchFaqs();
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  const cats = [...new Set(faqs.map(f => f.cat).filter(Boolean))];
  const filtered = catFilter === "전체" ? faqs : faqs.filter(f => f.cat === catFilter);
  const sortedFiltered = [...filtered].sort((a, b) => (a.order_idx ?? 0) - (b.order_idx ?? 0));
  const canDrag = adminUser && useDB && catFilter === "전체";

  return (
    <div>
      <PageHeader label={FAQ_HEADER.label} title={FAQ_HEADER.title} />

      <div style={{ display: "flex", alignItems: "center", marginBottom: 20, gap: 8, flexWrap: "wrap" }}>
        <CatFilter cats={cats} active={catFilter} setActive={setCatFilter} />
        {adminUser && useDB && !editForm && (
          <button onClick={() => setEditForm({ ...EMPTY_FORM })}
            style={{ marginLeft: "auto", background: "#1e3a5f", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Plus size={14} /> 새 FAQ 작성
          </button>
        )}
      </div>

      {/* 작성/편집 폼 */}
      {adminUser && editForm && (
        <div style={{ background: "#fff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{editForm.id ? "FAQ 편집" : "새 FAQ 작성"}</h3>
            <button onClick={() => setEditForm(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 10, marginBottom: 10 }}>
            <input placeholder="질문" value={editForm.q} onChange={e => setEditForm(f => ({ ...f, q: e.target.value }))} style={iStyle} />
            <input placeholder="카테고리" value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))} style={iStyle} />
          </div>
          <textarea placeholder="답변" value={editForm.a} onChange={e => setEditForm(f => ({ ...f, a: e.target.value }))}
            style={{ ...iStyle, height: 120, resize: "vertical", marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setEditForm(null)} style={{ ...btnSm(), padding: "7px 16px" }}>취소</button>
            <button onClick={handleSave} disabled={saving}
              style={{ ...btnSm("primary"), padding: "7px 18px", fontSize: 13 }}>
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* FAQ 목록 */}
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        {loading && <div style={{ background: "#fff", padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>불러오는 중...</div>}
        {!loading && sortedFiltered.length === 0 && (
          <div style={{ background: "#fff", padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>등록된 FAQ가 없습니다.</div>
        )}
        {sortedFiltered.map((f, idx) => (
          <div key={f.id}
            draggable={canDrag}
            onDragStart={canDrag ? e => handleDragStart(e, idx) : undefined}
            onDragOver={canDrag ? e => handleDragOver(e, idx) : undefined}
            onDrop={canDrag ? e => handleDrop(e, idx) : undefined}
            onDragEnd={canDrag ? handleDragEnd : undefined}
            style={{ background: "#fff", borderBottom: idx < sortedFiltered.length - 1 ? "1px solid #f1f5f9" : "none",
              borderTop: dragOverIdx === idx && dragIdx !== idx ? "2px solid #3b82f6" : "2px solid transparent",
              opacity: dragIdx === idx ? 0.4 : 1, transition: "opacity 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "4px 8px 4px 0" }}>
              {canDrag && (
                <GripVertical size={14} color="#cbd5e1" style={{ flexShrink: 0, cursor: "grab", marginLeft: 8 }} />
              )}
              <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                style={{ flex: 1, background: "none", border: "none", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", fontFamily: "inherit", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: "#f1f5f9", color: "#64748b", flexShrink: 0 }}>{f.cat}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1e293b" }}>{f.q}</span>
                </div>
                {openFaq === f.id ? <ChevronUp size={15} color="#94a3b8" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="#94a3b8" style={{ flexShrink: 0 }} />}
              </button>
              {adminUser && useDB && (
                <div style={{ display: "flex", gap: 4, paddingRight: 8, flexShrink: 0 }}>
                  <button onClick={() => setEditForm({ id: f.id, q: f.q, a: f.a, cat: f.cat })} title="편집"
                    style={{ ...btnSm(), padding: "4px 7px" }}><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(f.id)} title="삭제"
                    style={{ ...btnSm("danger"), padding: "4px 7px" }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
            {openFaq === f.id && (
              <div style={{ padding: "0 20px 16px", paddingTop: 12, fontSize: 13, color: "#475569", lineHeight: 1.9, borderTop: "1px solid #f8fafc", textAlign: "left" }}>{f.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* 문의하기 */}
      <div style={{ marginTop: 32, position: "relative" }}>
        {adminUser && !contactEd && (
          <button onClick={() => { setContactData({ ...contact, email: contact.email || (location?.email ?? "") }); setContactEd(true); }}
            style={{ position: "absolute", top: 12, right: 12, zIndex: 1, background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Pencil size={12} /> 편집
          </button>
        )}
        {contactEd ? (
          <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <input placeholder="제목" value={contactData.title} onChange={e => setContactData(d => ({ ...d, title: e.target.value }))} style={iStyle} />
              <textarea placeholder="설명" value={contactData.desc} onChange={e => setContactData(d => ({ ...d, desc: e.target.value }))}
                style={{ ...iStyle, height: 70, resize: "vertical" }} />
              <input placeholder="이메일" value={contactData.email} onChange={e => setContactData(d => ({ ...d, email: e.target.value }))} style={iStyle} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <button onClick={() => setContactEd(false)} style={{ ...btnSm(), padding: "7px 16px" }}>취소</button>
              <button onClick={saveContact} disabled={contactSaving} style={{ ...btnSm("primary"), padding: "7px 18px", fontSize: 13 }}>
                {contactSaving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, border: "1px solid #bfdbfe" }}>
            <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{contact.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{contact.desc}</div>
              <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{contact.email || location?.email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
