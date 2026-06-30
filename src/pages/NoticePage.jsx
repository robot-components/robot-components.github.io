import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Paperclip, GripVertical, Check, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "../lib/supabase";

const CAT_COLORS = ["#dbeafe,#1d4ed8","#dcfce7,#166534","#f3e8ff,#7e22ce","#fef3c7,#92400e","#fee2e2,#991b1b","#f1f5f9,#475569"];
const catStyle = (cat, cats) => {
  const idx = cats.indexOf(cat);
  const [bg, color] = (CAT_COLORS[idx >= 0 ? idx % CAT_COLORS.length : 5]).split(",");
  return { fontSize: 11, padding: "2px 8px", borderRadius: 10, flexShrink: 0, background: bg, color };
};

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

const EMPTY_FORM = { title: "", cat: "공지", body: "", pinned: false, files: [] };

export default function NoticePage({ adminUser }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("전체");
  const [openId, setOpenId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const { data } = await supabase.from("notices").select("*").order("order_idx").order("created_at", { ascending: false });
    setNotices(data || []);
    setLoading(false);
  };

  const uploadPendingFiles = async (files) => {
    const results = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("notice-files").upload(path, file);
      if (error) { alert(`파일 업로드 실패: ${file.name}\n${error.message}`); continue; }
      const { data: { publicUrl } } = supabase.storage.from("notice-files").getPublicUrl(path);
      results.push({ name: file.name, url: publicUrl });
    }
    return results;
  };

  const handleSave = async () => {
    if (!editForm.title.trim()) return;
    setSaving(true);
    const uploaded = await uploadPendingFiles(pendingFiles);
    const allFiles = [...(editForm.files || []), ...uploaded];
    const payload = { title: editForm.title, cat: editForm.cat, body: editForm.body, pinned: editForm.pinned, files: allFiles };
    if (editForm.id) {
      await supabase.from("notices").update(payload).eq("id", editForm.id);
    } else {
      const maxIdx = notices.length > 0 ? Math.max(...notices.map(n => n.order_idx ?? 0)) : -1;
      const today = new Date().toISOString().slice(0, 10);
      await supabase.from("notices").insert({ ...payload, order_idx: maxIdx + 1, date: today });
    }
    setSaving(false);
    setPendingFiles([]);
    setEditForm(null);
    fetchNotices();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await supabase.from("notices").delete().eq("id", id);
    if (openId === id) setOpenId(null);
    fetchNotices();
  };

  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverIdx(idx); };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx || catFilter !== "전체") { setDragIdx(null); setDragOverIdx(null); return; }
    const newOrder = [...sorted];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    await Promise.all(newOrder.map((item, i) => supabase.from("notices").update({ order_idx: i }).eq("id", item.id)));
    setDragIdx(null);
    setDragOverIdx(null);
    fetchNotices();
  };

  const removeExistingFile = (idx) => setEditForm(f => ({ ...f, files: f.files.filter((_, i) => i !== idx) }));
  const removePendingFile = (idx) => setPendingFiles(fs => fs.filter((_, i) => i !== idx));

  const openEdit = (notice = null) => {
    setEditForm(notice
      ? { id: notice.id, title: notice.title, cat: notice.cat, body: notice.body || "", pinned: notice.pinned || false, files: notice.files || [] }
      : { ...EMPTY_FORM });
    setPendingFiles([]);
  };

  const cats = [...new Set(notices.map(n => n.cat).filter(Boolean))];
  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (a.order_idx ?? 0) - (b.order_idx ?? 0);
  });
  const filtered = catFilter === "전체" ? sorted : sorted.filter(n => n.cat === catFilter);
  const canDrag = adminUser && catFilter === "전체";
  const isNewForm = editForm && !editForm.id;

  const InlineForm = () => (
    <div style={{ padding: "12px 0", position: "relative" }}>
      <div style={{ position: "absolute", top: 8, right: 0, display: "flex", gap: 4 }}>
        <button onClick={() => { setEditForm(null); setPendingFiles([]); }} style={{ ...btnSm(), padding: "4px 7px" }}><X size={12} /></button>
        <button onClick={handleSave} disabled={saving} style={checkBtn}><Check size={12} /></button>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 10, paddingRight: 68 }}>
        <input placeholder="제목" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
          style={inputStyle({ flex: 1, fontSize: 14, fontWeight: 500, color: "#1e293b", padding: "4px 0" })} />
        <input placeholder="카테고리" value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))}
          style={inputStyle({ width: 80, flexShrink: 0, fontSize: 12, color: "#64748b", padding: "4px 0", textAlign: "center" })} />
      </div>
      <textarea placeholder="내용" value={editForm.body} onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))}
        style={inputStyle({ fontSize: 13, color: "#475569", lineHeight: 1.9, resize: "none", height: 80, padding: "4px 0 8px" })} />
      <div style={{ marginTop: 8 }}>
        {editForm.files?.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Paperclip size={11} color="#64748b" />
            <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{f.name}</span>
            <button onClick={() => removeExistingFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X size={11} /></button>
          </div>
        ))}
        {pendingFiles.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <Paperclip size={11} color="#3b82f6" />
            <span style={{ fontSize: 12, color: "#3b82f6", flex: 1 }}>{f.name}</span>
            <button onClick={() => removePendingFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X size={11} /></button>
          </div>
        ))}
        <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
          onChange={e => setPendingFiles(fs => [...fs, ...Array.from(e.target.files)])} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <button onClick={() => fileInputRef.current?.click()}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontFamily: "inherit", padding: 0 }}>
            + 파일 첨부
          </button>
          <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b", cursor: "pointer" }}>
            <input type="checkbox" checked={editForm.pinned} onChange={e => setEditForm(f => ({ ...f, pinned: e.target.checked }))} />
            상단 고정
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 42 }}>
        <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>공지사항</div>
        {adminUser && !editForm && (
          <button onClick={() => openEdit()}
            style={{ background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <Plus size={12} /> 새 공지 작성
          </button>
        )}
      </div>

      {cats.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {["전체", ...cats].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              style={{ background: catFilter === c ? "#3b82f6" : "#f1f5f9", color: catFilter === c ? "#fff" : "#475569", border: "none", padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: catFilter === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div>
        {loading && <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>불러오는 중...</div>}
        {!loading && filtered.length === 0 && !isNewForm && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>등록된 공지사항이 없습니다.</div>
        )}

        {filtered.map((n, idx) => {
          const isEditing = editForm?.id === n.id;
          const isOpen = openId === n.id;
          const isLast = idx === filtered.length - 1;
          return (
            <div key={n.id}
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
                    <button onClick={() => setOpenId(isOpen ? null : n.id)}
                      style={{ flex: 1, background: "none", border: "none", padding: "14px 0", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", textAlign: "left", fontFamily: "inherit", minWidth: 0 }}>
                      <span style={catStyle(n.cat, cats)}>{n.cat}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{n.title}</span>
                      {n.files?.length > 0 && <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />}
                      {isOpen ? <ChevronUp size={15} color="#94a3b8" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="#94a3b8" style={{ flexShrink: 0 }} />}
                    </button>
                    {adminUser && (
                      <div style={{ display: "flex", gap: 4, marginLeft: 8, flexShrink: 0 }}>
                        <button onClick={() => openEdit(n)} style={{ ...btnSm(), padding: "4px 7px" }}><Pencil size={12} /></button>
                        <button onClick={() => handleDelete(n.id)} style={{ ...btnSm("danger"), padding: "4px 7px" }}><Trash2 size={12} /></button>
                      </div>
                    )}
                  </div>
                  {isOpen && (
                    <div style={{ paddingBottom: 16, fontSize: 13, color: "#475569", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                      {n.body}
                      {n.files?.length > 0 && (
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                          {n.files.map((f, i) => (
                            <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#3b82f6", fontSize: 12, textDecoration: "none" }}>
                              <Paperclip size={11} /> {f.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {isNewForm && (
          <div style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
            <InlineForm />
          </div>
        )}
      </div>
    </div>
  );
}
