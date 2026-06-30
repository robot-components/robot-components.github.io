import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, X, GripVertical, Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEFAULT_FAQS } from "../data/defaults";

const btnSm = (variant = "default") => ({
  background: variant === "danger" ? "#fee2e2" : "#f1f5f9",
  color: variant === "danger" ? "#991b1b" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer",
  fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
});

const checkBtn = { background: "#dcfce7", color: "#15803d", border: "none", borderRadius: 6, padding: "4px 7px", cursor: "pointer", display: "inline-flex", alignItems: "center" };

const inputStyle = (extra = {}) => ({
  display: "block", width: "100%", border: "none", borderBottom: "1px solid #e2e8f0",
  outline: "none", background: "transparent", fontFamily: "inherit", boxSizing: "border-box", ...extra,
});

const EMPTY_FORM = { q: "", a: "", cat: "일반" };

export default function FaqPage({ adminUser }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDB, setUseDB] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("faqs").select("*").order("order_idx").order("created_at");
    if (error || !data) { setFaqs(DEFAULT_FAQS); setUseDB(false); }
    else { setFaqs(data.length > 0 ? data : DEFAULT_FAQS); setUseDB(true); }
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

  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverIdx(idx); };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const newOrder = [...sortedFiltered];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    await Promise.all(newOrder.map((item, i) => supabase.from("faqs").update({ order_idx: i }).eq("id", item.id)));
    setDragIdx(null);
    setDragOverIdx(null);
    fetchFaqs();
  };

  const sortedFiltered = [...faqs].sort((a, b) => (a.order_idx ?? 0) - (b.order_idx ?? 0));
  const canDrag = adminUser && useDB;
  const isNewForm = editForm && !editForm.id;

  const InlineForm = () => (
    <div style={{ padding: "12px 0", position: "relative" }}>
      <div style={{ position: "absolute", top: 8, right: 0, display: "flex", gap: 4 }}>
        <button onClick={() => setEditForm(null)} style={{ ...btnSm(), padding: "4px 7px" }}><X size={12} /></button>
        <button onClick={handleSave} disabled={saving} style={checkBtn}><Check size={12} /></button>
      </div>
      <input
        placeholder="질문"
        value={editForm.q}
        onChange={e => setEditForm(f => ({ ...f, q: e.target.value }))}
        style={inputStyle({ fontSize: 14, fontWeight: 500, color: "#1e293b", padding: "4px 0", paddingRight: 72, marginBottom: 12 })}
      />
      <textarea
        placeholder="답변"
        value={editForm.a}
        onChange={e => setEditForm(f => ({ ...f, a: e.target.value }))}
        style={inputStyle({ fontSize: 13, color: "#475569", lineHeight: 1.9, resize: "none", height: 80, paddingBottom: 8 })}
      />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 42 }}>
        <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>자주 묻는 질문 (FAQ)</div>
        {adminUser && useDB && !editForm && (
          <button onClick={() => setEditForm({ ...EMPTY_FORM })}
            style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <Plus size={12} /> 새 FAQ 작성
          </button>
        )}
      </div>

      <div>
        {loading && <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>불러오는 중...</div>}
        {!loading && sortedFiltered.length === 0 && !isNewForm && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>등록된 FAQ가 없습니다.</div>
        )}

        {sortedFiltered.map((f, idx) => {
          const isEditing = editForm?.id === f.id;
          const isLast = idx === sortedFiltered.length - 1;
          return (
            <div key={f.id}
              draggable={canDrag && !isEditing}
              onDragStart={canDrag && !isEditing ? e => handleDragStart(e, idx) : undefined}
              onDragOver={canDrag && !isEditing ? e => handleDragOver(e, idx) : undefined}
              onDrop={canDrag && !isEditing ? e => handleDrop(e, idx) : undefined}
              onDragEnd={canDrag && !isEditing ? handleDragEnd : undefined}
              style={{
                borderTop: dragOverIdx === idx && dragIdx !== idx ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                borderBottom: isLast && !isNewForm ? "1px solid #e2e8f0" : "none",
                opacity: dragIdx === idx ? 0.4 : 1, transition: "opacity 0.15s",
              }}>
              {isEditing ? <InlineForm /> : (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {canDrag && <GripVertical size={14} color="#cbd5e1" style={{ flexShrink: 0, cursor: "grab" }} />}
                    <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                      style={{ flex: 1, background: "none", border: "none", padding: "16px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", fontFamily: "inherit", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f" }}>{f.q}</span>
                      {openFaq === f.id ? <ChevronUp size={15} color="#94a3b8" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="#94a3b8" style={{ flexShrink: 0 }} />}
                    </button>
                    {adminUser && useDB && (
                      <div style={{ display: "flex", gap: 4, marginLeft: 8, flexShrink: 0 }}>
                        <button onClick={() => setEditForm({ id: f.id, q: f.q, a: f.a, cat: f.cat })} style={{ ...btnSm(), padding: "4px 7px" }}><Pencil size={12} /></button>
                        <button onClick={() => handleDelete(f.id)} style={{ ...btnSm("danger"), padding: "4px 7px" }}><Trash2 size={12} /></button>
                      </div>
                    )}
                  </div>
                  {openFaq === f.id && (
                    <div style={{ paddingBottom: 16, fontSize: 13, color: "#475569", lineHeight: 1.9 }}>{f.a}</div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* 새 FAQ 작성 폼 — 리스트 끝에 인라인 */}
        {isNewForm && (
          <div style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
            <InlineForm />
          </div>
        )}
      </div>
    </div>
  );
}
