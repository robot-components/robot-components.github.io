import { useState } from "react";
import { Edit2, Mail, Plus, Trash2, Save, XCircle } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import { DEFAULT_KOLAS } from "../data/defaults";
import { inp, ta, btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import EditSection from "../components/EditSection";
import AdminBadge from "../components/AdminBadge";
import AdminBtn from "../components/AdminBtn";
import LoginBox from "../components/LoginBox";

const DEFAULT_KOLAS_HEADER = {
  label: "KOLAS",
  title: "KOLAS 인정 규격 안내",
  sub: "공인시험기관으로서 아래 규격에 따른 공인 시험성적서를 발급합니다.",
};

const DEFAULT_KOLAS_CONTACT = {
  title: "문의하기",
  desc: "공인 시험성적서 발급 및 시험평가 관련 문의 사항은 아래 이메일로 연락해 주세요.",
};

const KOLAS_FIELDS = [["code", "규격 코드"], ["title", "규격명"], ["desc", "설명"]];

function KolasHeaderEditor({ kolasHeader, onSave, onCancel }) {
  const [f, setF] = useState({ ...kolasHeader });
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

function KolasSummaryEditor({ site, setSite, onDone }) {
  const [v, setV] = useState(site.kolasSummary);
  return (
    <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 20, marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #fde68a" }}>KOLAS 개요 수정</div>
      <textarea value={v} onChange={(e) => setV(e.target.value)} style={ta(3)} />
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => { setSite({ ...site, kolasSummary: v }); onDone(); }} style={btn()}><Save size={13} />저장</button>
        <button onClick={onDone} style={btn("#f1f5f9", "#64748b")}><XCircle size={13} />취소</button>
      </div>
    </div>
  );
}

function KolasContactEditor({ kolasContact, onSave, onCancel }) {
  const [f, setF] = useState({ ...kolasContact });
  return (
    <EditSection title="문의하기 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>제목</label><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>내용</label><textarea value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} style={ta(2)} /></div>
      </div>
    </EditSection>
  );
}

export default function KolasPage({ adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, onAdminToggle, site, setSite, location }) {
  const [kolas, setKolas] = useStorage("rtac_kolas", DEFAULT_KOLAS);
  const [kolasHeader, setKolasHeader] = useStorage("rtac_kolas_header", DEFAULT_KOLAS_HEADER);
  const [kolasContact, setKolasContact] = useStorage("rtac_kolas_contact", DEFAULT_KOLAS_CONTACT);

  const [editingHeader, setEditingHeader] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [kolasEdit, setKolasEdit] = useState(null);
  const [kolasForm, setKolasForm] = useState({ code: "", title: "", desc: "" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PageHeader label={kolasHeader.label} title={kolasHeader.title} sub={kolasHeader.sub} />
        <AdminBtn adminMode={adminMode} onToggle={onAdminToggle} />
      </div>
      <LoginBox showLogin={showLogin} adminMode={adminMode} adminPw={adminPw} onAdminPwChange={onAdminPwChange} onLogin={onLogin} onClose={onLoginClose} />
      {adminMode && <AdminBadge onLogout={onLogout} />}

      {/* 관리자 버튼 묶음 */}
      {adminMode && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {!editingHeader && !editingSummary && (
            <button onClick={() => setEditingHeader(true)} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "1px solid #e2e8f0", fontSize: 12 }}><Edit2 size={13} />헤더 수정</button>
          )}
          {!editingHeader && !editingSummary && (
            <button onClick={() => setEditingSummary(true)} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "1px solid #e2e8f0", fontSize: 12 }}><Edit2 size={13} />개요 수정</button>
          )}
          {!editingHeader && !editingSummary && kolasEdit === null && (
            <button onClick={() => { setKolasForm({ code: "", title: "", desc: "" }); setKolasEdit("new"); }} style={{ ...btn(), fontSize: 12 }}><Plus size={13} />규격 추가</button>
          )}
        </div>
      )}

      {/* 헤더 수정 폼 */}
      {adminMode && editingHeader && (
        <KolasHeaderEditor
          kolasHeader={kolasHeader}
          onSave={(v) => { setKolasHeader(v); setEditingHeader(false); }}
          onCancel={() => setEditingHeader(false)}
        />
      )}

      {/* 개요 수정 폼 */}
      {adminMode && editingSummary && (
        <KolasSummaryEditor site={site} setSite={setSite} onDone={() => setEditingSummary(false)} />
      )}

      {/* 규격 추가 폼 */}
      {adminMode && kolasEdit === "new" && (
        <EditSection
          title="규격 추가"
          onSave={() => { setKolas([...kolas, { id: Date.now(), ...kolasForm }]); setKolasEdit(null); }}
          onCancel={() => setKolasEdit(null)}
        >
          {KOLAS_FIELDS.map(([k, l]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{l}</label>
              {k === "desc"
                ? <textarea value={kolasForm[k]} onChange={(e) => setKolasForm({ ...kolasForm, [k]: e.target.value })} style={ta(2)} />
                : <input value={kolasForm[k]} onChange={(e) => setKolasForm({ ...kolasForm, [k]: e.target.value })} style={inp()} />
              }
            </div>
          ))}
        </EditSection>
      )}

      {/* KOLAS 개요 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 22px", marginBottom: 24, fontSize: 14, color: "#475569", lineHeight: 1.9 }}>{site.kolasSummary}</div>

      {/* 규격 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {kolas.map((k) => (
          <div key={k.id}>
            {adminMode && kolasEdit === k.id ? (
              <EditSection
                title="규격 수정"
                onSave={() => { setKolas(kolas.map((x) => x.id === k.id ? { ...x, ...kolasForm } : x)); setKolasEdit(null); }}
                onCancel={() => setKolasEdit(null)}
              >
                {KOLAS_FIELDS.map(([f, l]) => (
                  <div key={f} style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{l}</label>
                    {f === "desc"
                      ? <textarea value={kolasForm[f]} onChange={(e) => setKolasForm({ ...kolasForm, [f]: e.target.value })} style={ta(2)} />
                      : <input value={kolasForm[f]} onChange={(e) => setKolasForm({ ...kolasForm, [f]: e.target.value })} style={inp()} />
                    }
                  </div>
                ))}
              </EditSection>
            ) : (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 22 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ background: "#1e3a5f", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, width: 175, textAlign: "center" }}>{k.code}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px" }}>{k.title}</h3>
                    <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.7 }}>{k.desc}</p>
                  </div>
                  {adminMode && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setKolasForm({ code: k.code, title: k.title, desc: k.desc }); setKolasEdit(k.id); }} style={{ ...btn("#f1f5f9", "#475569"), padding: "6px 8px" }}><Edit2 size={13} /></button>
                      <button onClick={() => { if (confirm("삭제하시겠습니까?")) setKolas(kolas.filter((x) => x.id !== k.id)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "6px 8px" }}><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
              </div>
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
          <KolasContactEditor
            kolasContact={kolasContact}
            onSave={(v) => { setKolasContact(v); setEditingContact(false); }}
            onCancel={() => setEditingContact(false)}
          />
        </div>
      )}

      {/* 문의하기 표시 */}
      {!editingContact && (
        <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: adminMode ? 12 : 32, border: "1px solid #bfdbfe" }}>
          <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{kolasContact.title}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{kolasContact.desc}</div>
            <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{location.email}</div>
          </div>
        </div>
      )}
    </div>
  );
}
