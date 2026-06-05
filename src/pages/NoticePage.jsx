import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, Paperclip } from "lucide-react";
import { supabase } from "../lib/supabase";
import PageHeader from "../components/PageHeader";

const NOTICE_HEADER = { label: "공지사항", title: "공지사항" };

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
      const path = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("notice-files").upload(path, file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("notice-files").getPublicUrl(path);
        results.push({ name: file.name, url: publicUrl });
      }
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

  const handleMove = async (id, dir) => {
    const sorted = [...notices].sort((a, b) => (a.order_idx ?? 0) - (b.order_idx ?? 0));
    const i = sorted.findIndex(n => n.id === id);
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= sorted.length) return;
    const oi = sorted[i].order_idx ?? i;
    const oj = sorted[j].order_idx ?? j;
    await supabase.from("notices").update({ order_idx: oj }).eq("id", sorted[i].id);
    await supabase.from("notices").update({ order_idx: oi }).eq("id", sorted[j].id);
    fetchNotices();
  };

  const removeExistingFile = (idx) => {
    setEditForm(f => ({ ...f, files: f.files.filter((_, i) => i !== idx) }));
  };
  const removePendingFile = (idx) => {
    setPendingFiles(fs => fs.filter((_, i) => i !== idx));
  };

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

          {/* 첨부파일 영역 */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, marginBottom: 10, background: "#f8fafc" }}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>첨부파일</div>

            {/* 기존 첨부파일 */}
            {editForm.files?.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "6px 10px" }}>
                <Paperclip size={12} color="#64748b" />
                <span style={{ fontSize: 13, color: "#334155", flex: 1 }}>{f.name}</span>
                <button onClick={() => removeExistingFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X size={13} /></button>
              </div>
            ))}

            {/* 새로 선택한 파일 */}
            {pendingFiles.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "6px 10px" }}>
                <Paperclip size={12} color="#3b82f6" />
                <span style={{ fontSize: 13, color: "#1d4ed8", flex: 1 }}>{f.name}</span>
                <button onClick={() => removePendingFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}><X size={13} /></button>
              </div>
            ))}

            {/* 파일 선택 버튼 */}
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
              <button onClick={handleSave} disabled={saving}
                style={{ ...btnSm("primary"), padding: "7px 18px", fontSize: 13 }}>
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
                  <a key={i} href={f.url} download target="_blank" rel="noopener noreferrer"
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
            <div key={n.id} style={{ background: "#fff", borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none", padding: "13px 18px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => setDetail(n)}>
                <span style={catStyle(n.cat, cats)}>{n.cat}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
                {n.files?.length > 0 && <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />}
              </div>
              <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{n.date}</span>
              {adminUser && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => handleMove(n.id, "up")} disabled={idx === 0} title="위로"
                    style={{ ...btnSm(), padding: "4px 6px", opacity: idx === 0 ? 0.3 : 1 }}><ChevronUp size={13} /></button>
                  <button onClick={() => handleMove(n.id, "down")} disabled={idx === filtered.length - 1} title="아래로"
                    style={{ ...btnSm(), padding: "4px 6px", opacity: idx === filtered.length - 1 ? 0.3 : 1 }}><ChevronDown size={13} /></button>
                  <button onClick={() => openEdit(n)} title="편집"
                    style={{ ...btnSm(), padding: "4px 7px" }}><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(n.id)} title="삭제"
                    style={{ ...btnSm("danger"), padding: "4px 7px" }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
