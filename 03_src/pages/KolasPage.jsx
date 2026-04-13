import { useState } from "react";
import { Edit2, Plus, Trash2, Save, XCircle } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import { DEFAULT_KOLAS } from "../data/defaults";
import { inp, ta, btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import ContactBanner from "../components/ContactBanner";
import EditSection from "../components/EditSection";
import AdminBadge from "../components/AdminBadge";
import AdminBtn from "../components/AdminBtn";
import LoginBox from "../components/LoginBox";

function KolasSummaryEditor({ site, setSite, onDone }) {
  const [v, setV] = useState(site.kolasSummary);
  return (
    <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 20, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 14 }}>KOLAS 개요 수정</div>
      <textarea value={v} onChange={(e) => setV(e.target.value)} style={ta(3)} />
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button onClick={() => { setSite({ ...site, kolasSummary: v }); onDone(); }} style={btn()}><Save size={13} />저장</button>
        <button onClick={onDone} style={btn("#f1f5f9", "#475569")}><XCircle size={13} />취소</button>
      </div>
    </div>
  );
}

const KOLAS_FIELDS = [["code","규격 코드"],["title","규격명"],["target","적용 대상"],["desc","설명"]];

export default function KolasPage({ adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, onAdminToggle, site, setSite, location }) {
  const [kolas, setKolas] = useStorage("rtac_kolas", DEFAULT_KOLAS);
  const [kolasEdit, setKolasEdit] = useState(null);
  const [kolasForm, setKolasForm] = useState({ code: "", title: "", target: "", desc: "" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PageHeader label="KOLAS" title="KOLAS 인정 규격 안내" sub="공인시험기관으로서 아래 규격에 따른 공인 시험성적서를 발급합니다." />
        <AdminBtn adminMode={adminMode} onToggle={onAdminToggle} />
      </div>
      <LoginBox showLogin={showLogin} adminMode={adminMode} adminPw={adminPw} onAdminPwChange={onAdminPwChange} onLogin={onLogin} onClose={onLoginClose} />
      {adminMode && <AdminBadge onLogout={onLogout} />}

      {adminMode && (
        <div style={{ marginBottom: 16 }}>
          {kolasEdit === "summary"
            ? <KolasSummaryEditor site={site} setSite={setSite} onDone={() => setKolasEdit(null)} />
            : <button onClick={() => setKolasEdit("summary")} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "0.5px solid #cbd5e1" }}><Edit2 size={13} />개요 수정</button>
          }
        </div>
      )}

      {adminMode && kolasEdit !== "summary" && (
        <button onClick={() => { setKolasForm({ code: "", title: "", target: "", desc: "" }); setKolasEdit("new"); }} style={{ ...btn(), marginBottom: 16 }}><Plus size={14} />규격 추가</button>
      )}

      {adminMode && kolasEdit === "new" && (
        <EditSection title="규격 추가" onSave={() => { setKolas([...kolas, { id: Date.now(), ...kolasForm }]); setKolasEdit(null); }} onCancel={() => setKolasEdit(null)}>
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

      <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e2e8f0", padding: "18px 22px", marginBottom: 24, fontSize: 14, color: "#475569", lineHeight: 1.9, textAlign: "left" }}>{site.kolasSummary}</div>

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
              <div style={{ background: "#fff", borderRadius: 12, border: "0.5px solid #e2e8f0", padding: 22 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ background: "#1e3a5f", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, width: 180, textAlign: "center" }}>{k.code}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px" }}>{k.title}</h3>
                    <p style={{ fontSize: 13, color: "#475569", margin: "0 0 10px", lineHeight: 1.7, textAlign: "left" }}>{k.desc}</p>
                    <div style={{ background: "#f0fdf4", borderRadius: 6, padding: "8px 12px" }}>
                      <span style={{ fontSize: 12, color: "#166534", fontWeight: 600 }}>적용 대상 </span>
                      <span style={{ fontSize: 12, color: "#166534" }}>{k.target}</span>
                    </div>
                  </div>
                  {adminMode && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setKolasForm({ code: k.code, title: k.title, target: k.target, desc: k.desc }); setKolasEdit(k.id); }} style={{ ...btn("#f1f5f9", "#475569"), padding: "6px 8px" }}><Edit2 size={13} /></button>
                      <button onClick={() => { if (confirm("삭제하시겠습니까?")) setKolas(kolas.filter((x) => x.id !== k.id)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "6px 8px" }}><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <ContactBanner email={location.email} />
    </div>
  );
}
