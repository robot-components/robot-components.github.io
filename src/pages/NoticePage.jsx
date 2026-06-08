import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Paperclip, GripVertical, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";
import PageHeader from "../components/PageHeader";

const NOTICE_HEADER = { label: "공지사항", title: "공지사항" };
const DEFAULT_NOTICE_CONTACT = { title: "문의하기", desc: "공지사항 관련 문의는 아래 이메일로 문의해 주시기 바랍니다.", email: "" };

const CAT_COLORS = ["#dbeafe,#1d4ed8","#dcfce7,#166534","#f3e8ff,#7e22ce","#fef3c7,#92400e","#fee2e2,#991b1b","#f1f5f9,#475569"];
const catStyle = (cat, cats) => {
  const idx = cats.indexOf(cat);
  const [bg, color] = (CAT_COLORS[idx >= 0 ? idx % CAT_COLORS.length : 5]).split(",");
  return { fontSize: 11, padding: "2px 8px", borderRadius: 10, flexShrink: 0, background: bg, color };
};

const iStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 14, width: "100%", outline: "none", fontFamily: "inherit" };
const btnSm = (variant = "default") => ({
  background: variant === "danger" ? "#fee2e2" : variant === "primary" ? "#1e3a5f" : "#f1f5f9",
  color: variant === "danger" ? "#991b1b" : variant === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
});

const EMPTY_FORM = { title: "", cat: "공지", body: "", pinned: false, files: [] };

export default function NoticePage({ adminUser }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("전체");
  const [detail, setDetail] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const fileInputRef = useRef(null);

  const [contact, setContact] = useState(DEFAULT_NOTICE_CONTACT);
  const [contactEd, setContactEd] = useState(false);
  const [contactData, setContactData] = useState(DEFAULT_NOTICE_CONTACT);
  const [contactSaving, setContactSaving] = useState(false);

  useEffect(() => { fetchNotices(); loadContact(); }, []);

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
      if (error) {
        alert(`파일 업로드 실패: ${file.name}\n${error.message}`);
        continue;
      }
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
    if (detail?.id === id) setDetail(null);
    fetchNotices();
  };

  // 드래그 앤 드롭
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
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const newOrder = [...sorted];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    await Promise.all(newOrder.map((item, i) =>
      supabase.from("notices").update({ order_idx: i }).eq("id", item.id)
    ));
    setDragIdx(null);
    setDragOverIdx(null);
    fetchNotices();
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const loadContact = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "notice_contact").single();
    if (data?.value) setContact(data.value);
  };

  const saveContact = async () => {
    setContactSaving(true);
    await supabase.from("site_settings").upsert({ key: "notice_contact", value: contactData });
    setContact(contactData);
    setContactSaving(false);
    setContactEd(false);
  };

  const removeExistingFile = (idx) => setEditForm(f => ({ ...f, files: f.files.filter((_, i) => i !== idx) }));
  const removePendingFile = (idx) => setPendingFiles(fs => fs.filter((_, i) => i !== idx));

  const openEdit = (notice = null) => {
    setEditForm(notice ? { id: notice.id, title: notice.title, cat: notice.cat, body: notice.body || "", pinned: notice.pinned || false, files: notice.files || [] } : { ...EMPTY_FORM });
    setPendingFiles([]);
  };

  const cats = [...new Set(notices.map(n => n.cat).filter(Boolean))];
  const sorted = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (a.order_idx ?? 0) - (b.order_idx ?? 0);
  });
  const filtered = catFilter === "전체" ? sorted : sorted.filter(n => n.cat === catFilter);
  const canDrag = adminUser && catFilter === "전체";

  return (
    <div>
      <PageHeader label={NOTICE_HEADER.label} title={NOTICE_HEADER.title} />

      {/* 카테고리 필터 + 작성 버튼 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {["전체", ...cats].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            style={{ background: catFilter === c ? "#1e3a5f" : "#fff", color: catFilter === c ? "#fff" : "#475569", border: `1px solid ${catFilter === c ? "#1e3a5f" : "#e2e8f0"}`, padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: catFilter === c ? 600 : 400 }}>
            {c}
          </button>
        ))}
        {adminUser && !editForm && (
          <button onClick={() => openEdit()}
            style={{ marginLeft: "auto", background: "#1e3a5f", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <Plus size={14} /> 새 공지 작성
          </button>
        )}
      </div>

      {/* 작성/편집 폼 */}
      {adminUser && editForm && (
        <div style={{ background: "#fff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{editForm.id ? "공지 편집" : "새 공지 작성"}</h3>
            <button onClick={() => { setEditForm(null); setPendingFiles([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 10, marginBottom: 10 }}>
            <input placeholder="제목" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} style={iStyle} />
            <input placeholder="카테고리" value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))} style={iStyle} />
          </div>
          <textarea placeholder="내용" value={editForm.body} onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))}
            style={{ ...iStyle, height: 140, resize: "vertical", marginBottom: 10 }} />
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 10, background: "#f8fafc" }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>첨부파일</div>
            {editForm.files?.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 10px" }}>
                <Paperclip size={12} color="#64748b" />
                <span style={{ fontSize: 13, color: "#334155", flex: 1 }}>{f.name}</span>
                <button onClick={() => removeExistingFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X size={13} /></button>
              </div>
            ))}
            {pendingFiles.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "6px 10px" }}>
                <Paperclip size={12} color="#3b82f6" />
                <span style={{ fontSize: 13, color: "#1d4ed8", flex: 1 }}>{f.name}</span>
                <button onClick={() => removePendingFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X size={13} /></button>
              </div>
            ))}
            <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
              onChange={e => setPendingFiles(fs => [...fs, ...Array.from(e.target.files)])} />
            <button onClick={() => fileInputRef.current?.click()}
              style={{ background: "none", border: "1px dashed #cbd5e1", color: "#64748b", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", width: "100%", marginTop: 4 }}>
              + 파일 추가
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569", cursor: "pointer" }}>
              <input type="checkbox" checked={editForm.pinned} onChange={e => setEditForm(f => ({ ...f, pinned: e.target.checked }))} />
              상단 고정
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setEditForm(null); setPendingFiles([]); }} style={{ ...btnSm(), padding: "7px 16px" }}>취소</button>
              <button onClick={handleSave} disabled={saving} style={{ ...btnSm("primary"), padding: "7px 18px", fontSize: 13 }}>
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 보기 */}
      {detail ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 32 }}>
          <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "inherit", padding: 0 }}>← 목록으로</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={catStyle(detail.cat, cats)}>{detail.cat}</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px", lineHeight: 1.4 }}>{detail.title}</h2>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>{detail.date}</div>
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 24, fontSize: 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{detail.body}</div>
          {detail.files?.length > 0 && (
            <div style={{ marginTop: 24, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 10 }}>첨부파일</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {detail.files.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", padding: "9px 16px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500, width: "fit-content" }}>
                    <Paperclip size={13} /> {f.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          {loading && <div style={{ background: "#fff", padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>불러오는 중...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ background: "#fff", padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>등록된 공지사항이 없습니다.</div>
          )}
          {filtered.map((n, idx) => (
            <div
              key={n.id}
              draggable={canDrag}
              onDragStart={canDrag ? e => handleDragStart(e, idx) : undefined}
              onDragOver={canDrag ? e => handleDragOver(e, idx) : undefined}
              onDrop={canDrag ? e => handleDrop(e, idx) : undefined}
              onDragEnd={canDrag ? handleDragEnd : undefined}
              style={{
                background: n.pinned ? "#dbeafe" : "#fff",
                borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
                borderTop: dragOverIdx === idx && dragIdx !== idx ? "2px solid #3b82f6" : "2px solid transparent",
                padding: "11px 18px",
                display: "flex", alignItems: "center", gap: 10,
                opacity: dragIdx === idx ? 0.4 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {canDrag && (
                <GripVertical size={14} color="#cbd5e1" style={{ flexShrink: 0, cursor: "grab" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => setDetail(n)}>
                <span style={catStyle(n.cat, cats)}>{n.cat}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
                {n.files?.length > 0 && <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />}
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{n.date}</span>
              {adminUser && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => openEdit(n)} title="편집" style={{ ...btnSm(), padding: "4px 7px" }}><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(n.id)} title="삭제" style={{ ...btnSm("danger"), padding: "4px 7px" }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* 문의하기 */}
      <div style={{ marginTop: 32, position: "relative" }}>
        {adminUser && !contactEd && (
          <button onClick={() => { setContactData({ ...contact }); setContactEd(true); }}
            style={{ position: "absolute", top: 12, right: 12, zIndex: 1, background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Pencil size={12} /> 편집
          </button>
        )}
        {contactEd ? (
          <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <input placeholder="제목" value={contactData.title} onChange={e => setContactData(d => ({ ...d, title: e.target.value }))} style={{ ...iStyle, fontSize: 13 }} />
              <textarea placeholder="설명" value={contactData.desc} onChange={e => setContactData(d => ({ ...d, desc: e.target.value }))}
                style={{ ...iStyle, fontSize: 13, height: 70, resize: "vertical" }} />
              <input placeholder="이메일" value={contactData.email} onChange={e => setContactData(d => ({ ...d, email: e.target.value }))} style={{ ...iStyle, fontSize: 13 }} />
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
              {contact.email && <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{contact.email}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
