import { useState } from "react";
import { Edit2, Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import { DEFAULT_NOTICES, DEFAULT_NOTICE_CATS } from "../data/defaults";
import { inp, ta, btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import EditSection from "../components/EditSection";
import AdminBadge from "../components/AdminBadge";
import AdminBtn from "../components/AdminBtn";
import LoginBox from "../components/LoginBox";

const DEFAULT_NOTICE_HEADER = {
  label: "공지사항",
  title: "공지사항",
  sub: "센터 운영 관련 공지 및 사업 안내를 확인하세요.",
};

function NoticeHeaderEditor({ noticeHeader, onSave, onCancel }) {
  const [f, setF] = useState({ ...noticeHeader });
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

const noticeCatStyle = (cat, cats = []) => {
  const colors = ["#dbeafe,#1d4ed8","#dcfce7,#166534","#f3e8ff,#7e22ce","#fef3c7,#92400e","#fee2e2,#991b1b","#f1f5f9,#475569"];
  const idx = cats.indexOf(cat);
  const [bg, color] = (colors[idx >= 0 ? idx % colors.length : 0]).split(",");
  return { fontSize: 11, padding: "2px 8px", borderRadius: 10, flexShrink: 0, background: bg, color };
};

export default function NoticePage({ adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, onAdminToggle }) {
  const [notices, setNotices] = useStorage("rtac_notices", DEFAULT_NOTICES);
  const [noticeCats, setNoticeCats] = useStorage("rtac_notice_cats", DEFAULT_NOTICE_CATS);
  const [noticeHeader, setNoticeHeader] = useStorage("rtac_notice_header", DEFAULT_NOTICE_HEADER);

  const [editingHeader, setEditingHeader] = useState(false);
  const [noticeCatEditMode, setNoticeCatEditMode] = useState(false);
  const [noticeCatDragIdx, setNoticeCatDragIdx] = useState(null);
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [noticeEdit, setNoticeEdit] = useState(null);
  const [noticeForm, setNoticeForm] = useState({ cat: "공지", title: "", body: "" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PageHeader label={noticeHeader.label} title={noticeHeader.title} sub={noticeHeader.sub} />
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
        <NoticeHeaderEditor
          noticeHeader={noticeHeader}
          onSave={(v) => { setNoticeHeader(v); setEditingHeader(false); }}
          onCancel={() => setEditingHeader(false)}
        />
      )}

      {/* 관리자 도구 */}
      {adminMode && (
        <div style={{ marginBottom: 20 }}>
          {/* 카테고리 편집 */}
          <div style={{ marginBottom: 12 }}>
            {noticeCatEditMode ? (
              <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 16, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 10 }}>카테고리 편집</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                  {noticeCats.map((c, i) => (
                    <div
                      key={i}
                      draggable
                      onDragStart={() => setNoticeCatDragIdx(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (noticeCatDragIdx === null || noticeCatDragIdx === i) return;
                        const a = [...noticeCats]; const [m] = a.splice(noticeCatDragIdx, 1); a.splice(i, 0, m);
                        setNoticeCats(a); setNoticeCatDragIdx(null);
                      }}
                      style={{ display: "flex", gap: 8, alignItems: "center", background: "#fff", borderRadius: 6, border: "1px solid #e2e8f0", padding: "6px 10px", cursor: "grab" }}
                    >
                      <GripVertical size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <input value={c} onChange={(e) => { const a = [...noticeCats]; a[i] = e.target.value; setNoticeCats(a); }} style={{ ...inp(), flex: 1, padding: "5px 8px" }} />
                      <button onClick={() => { if (noticeCats.length <= 1) { alert("최소 1개 이상이어야 합니다."); return; } setNoticeCats(noticeCats.filter((_, x) => x !== i)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "5px 7px" }}><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setNoticeCats([...noticeCats, "새 카테고리"])} style={{ ...btn("#f1f5f9", "#475569"), fontSize: 12 }}><Plus size={12} />카테고리 추가</button>
                  <button onClick={() => setNoticeCatEditMode(false)} style={{ ...btn(), fontSize: 12 }}><Save size={12} />완료</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setNoticeCatEditMode(true)} style={{ ...btn("#f8fafc", "#475569"), border: "1px solid #e2e8f0", fontSize: 12, marginBottom: 12 }}><Edit2 size={13} />카테고리 편집</button>
            )}
          </div>

          {/* 공지 등록/수정 폼 */}
          {noticeEdit !== null ? (
            <EditSection
              title={noticeEdit === "new" ? "공지 등록" : "공지 수정"}
              onSave={() => {
                if (!noticeForm.title || !noticeForm.body) { alert("제목과 내용을 입력해 주세요."); return; }
                if (noticeEdit === "new") setNotices([{ id: Date.now(), ...noticeForm, date: new Date().toISOString().slice(0, 10) }, ...notices]);
                else setNotices(notices.map((n) => n.id === noticeEdit ? { ...n, ...noticeForm } : n));
                setNoticeEdit(null); setNoticeForm({ cat: noticeCats[0] || "", title: "", body: "" });
              }}
              onCancel={() => { setNoticeEdit(null); setNoticeForm({ cat: noticeCats[0] || "", title: "", body: "" }); }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                {noticeCats.map((c) => (
                  <button key={c} onClick={() => setNoticeForm({ ...noticeForm, cat: c })} style={{ ...btn(noticeForm.cat === c ? "#1e3a5f" : "#f1f5f9", noticeForm.cat === c ? "#fff" : "#475569"), fontSize: 12 }}>{c}</button>
                ))}
              </div>
              <input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="제목" style={{ ...inp(), marginBottom: 10 }} />
              <textarea value={noticeForm.body} onChange={(e) => setNoticeForm({ ...noticeForm, body: e.target.value })} placeholder="내용" style={ta(4)} />
            </EditSection>
          ) : (
            <button onClick={() => { setNoticeForm({ cat: noticeCats[0] || "", title: "", body: "" }); setNoticeEdit("new"); }} style={btn()}><Plus size={14} />공지 등록</button>
          )}
        </div>
      )}

      {/* 공지 상세 or 목록 */}
      {noticeDetail ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 32 }}>
          <button onClick={() => setNoticeDetail(null)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "inherit", padding: 0 }}>← 목록으로 돌아가기</button>
          <span style={noticeCatStyle(noticeDetail.cat, noticeCats)}>{noticeDetail.cat}</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: "12px 0 6px", lineHeight: 1.4 }}>{noticeDetail.title}</h2>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>{noticeDetail.date}</div>
          <div style={{ borderTop: "0.5px solid #f1f5f9", paddingTop: 24, fontSize: 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap", textAlign: "left" }}>{noticeDetail.body}</div>
        </div>
      ) : (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          {notices.map((n, idx) => (
            <div key={n.id} style={{ background: "#fff", borderBottom: idx < notices.length - 1 ? "0.5px solid #f1f5f9" : "none", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => setNoticeDetail(n)}>
                <span style={noticeCatStyle(n.cat, noticeCats)}>{n.cat}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{n.date}</span>
                {adminMode && (
                  <>
                    <button onClick={() => { setNoticeForm({ cat: n.cat, title: n.title, body: n.body }); setNoticeEdit(n.id); }} style={{ ...btn("#f1f5f9", "#475569"), padding: "4px 8px", fontSize: 12 }}><Edit2 size={12} /></button>
                    <button onClick={() => { if (confirm("삭제하시겠습니까?")) setNotices(notices.filter((x) => x.id !== n.id)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "4px 8px", fontSize: 12 }}><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
