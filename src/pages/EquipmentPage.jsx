import { useState, useRef } from "react";
import { Edit2, Mail, Plus, Trash2, Save, GripVertical, X } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import { DEFAULT_EQUIPMENT, DEFAULT_EQ_CATS } from "../data/defaults";
import { parseSpecs, specsToText } from "../utils/specUtils";
import { inp, ta, btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import EditSection from "../components/EditSection";
import SpecsTable from "../components/SpecsTable";
import AdminBadge from "../components/AdminBadge";
import AdminBtn from "../components/AdminBtn";
import LoginBox from "../components/LoginBox";

const DEFAULT_EQ_CONTACT = {
  title: "문의하기",
  desc: "장비 이용 및 시험평가 관련 문의 사항은 아래 이메일로 연락해 주세요.",
};

const DEFAULT_EQ_HEADER = {
  label: "보유 장비",
  title: "보유 장비 목록",
  sub: "보유한 시험평가 장비를 소개합니다.",
};

function EquipmentContactEditor({ eqContact, onSave, onCancel }) {
  const [f, setF] = useState({ ...eqContact });
  return (
    <EditSection title="문의하기 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>제목</label><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>내용</label><textarea value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} style={ta(2)} /></div>
      </div>
    </EditSection>
  );
}

function EquipmentHeaderEditor({ eqHeader, onSave, onCancel }) {
  const [f, setF] = useState({ ...eqHeader });
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

const renderName = (n) =>
  n.split("//").map((p, i, a) => <span key={i}>{p}{i < a.length - 1 && <br />}</span>);

export default function EquipmentPage({ adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, onAdminToggle, location }) {
  const [equipment, setEquipment] = useStorage("rtac_eq_v2", DEFAULT_EQUIPMENT);
  const [eqCats, setEqCats] = useStorage("rtac_eq_cats", DEFAULT_EQ_CATS);
  const [eqHeader, setEqHeader] = useStorage("rtac_eq_header", DEFAULT_EQ_HEADER);
  const [eqContact, setEqContact] = useStorage("rtac_eq_contact", DEFAULT_EQ_CONTACT);

  const [eqCat, setEqCat] = useState("전체");
  const [editingHeader, setEditingHeader] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [catEditMode, setCatEditMode] = useState(false);
  const [catDragIdx, setCatDragIdx] = useState(null);
  const [eqModal, setEqModal] = useState(null);
  const [eqEdit, setEqEdit] = useState(null);
  const [eqForm, setEqForm] = useState({ cat: "", name: "", specsText: "", uses: "", image: "", youtube: "" });
  const dragIdx = useRef(null);

  const filteredEq = eqCat === "전체" ? equipment : equipment.filter((e) => e.cat === eqCat);
  const resetEqForm = () => { setEqEdit(null); setEqForm({ cat: eqCats[0] || "", name: "", specsText: "", uses: "", image: "", youtube: "" }); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { alert("4MB 이하 파일만 가능합니다."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setEqForm((f) => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const EqFormFields = () => (
    <div style={{ display: "grid", gap: 10 }}>
      <div>
        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>카테고리</label>
        <select value={eqForm.cat} onChange={(e) => setEqForm({ ...eqForm, cat: e.target.value })} style={inp()}>
          {eqCats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>장비명</label>
        <input value={eqForm.name} onChange={(e) => setEqForm({ ...eqForm, name: e.target.value })} style={inp()} />
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>줄바꿈은 // 입력</div>
      </div>
      <div>
        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>장비 사진</label>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 100, height: 67, borderRadius: 6, overflow: "hidden", background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {eqForm.image ? <img src={eqForm.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 11, color: "#94a3b8" }}>미리보기</span>}
          </div>
          <div style={{ flex: 1 }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ ...inp(), padding: "6px 8px", fontSize: 12 }} />
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>JPG, PNG · 최대 4MB</div>
            {eqForm.image && <button onClick={() => setEqForm((f) => ({ ...f, image: "" }))} style={{ ...btn("#fee2e2", "#991b1b"), fontSize: 11, padding: "4px 8px", marginTop: 6 }}><Trash2 size={11} />삭제</button>}
          </div>
        </div>
      </div>
      <div>
        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>주요 사양</label>
        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>섹션명: 으로 구분, "항목명 | 값" 형식</div>
        <textarea value={eqForm.specsText} onChange={(e) => setEqForm({ ...eqForm, specsText: e.target.value })} style={ta(8)} />
      </div>
      <div>
        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>주요 용도 (줄바꿈으로 구분)</label>
        <textarea value={eqForm.uses} onChange={(e) => setEqForm({ ...eqForm, uses: e.target.value })} style={ta(4)} />
      </div>
      <div>
        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>i-Tube 링크 (선택)</label>
        <input value={eqForm.youtube} onChange={(e) => setEqForm({ ...eqForm, youtube: e.target.value })} placeholder="https://i-tube.re.kr/..." style={inp()} />
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PageHeader label={eqHeader.label} title={eqHeader.title} sub={eqHeader.sub} />
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
        <EquipmentHeaderEditor
          eqHeader={eqHeader}
          onSave={(v) => { setEqHeader(v); setEditingHeader(false); }}
          onCancel={() => setEditingHeader(false)}
        />
      )}

      {adminMode && eqEdit === "new" && (
        <EditSection title="새 장비 추가" onSave={() => { setEquipment([...equipment, { id: Date.now(), ...eqForm, specs: parseSpecs(eqForm.specsText) }]); resetEqForm(); }} onCancel={resetEqForm}>
          <EqFormFields />
        </EditSection>
      )}
      {adminMode && eqEdit && eqEdit !== "new" && (() => {
        const eq = equipment.find((e) => e.id === eqEdit);
        return eq ? (
          <EditSection title="장비 수정" onSave={() => { setEquipment(equipment.map((e) => e.id === eqEdit ? { ...e, ...eqForm, specs: parseSpecs(eqForm.specsText) } : e)); resetEqForm(); }} onCancel={resetEqForm}>
            <EqFormFields />
          </EditSection>
        ) : null;
      })()}

      {/* 카테고리 필터 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {["전체", ...eqCats].map((c) => (
            <button key={c} onClick={() => !catEditMode && setEqCat(c)} style={{ background: eqCat === c && !catEditMode ? "#1e3a5f" : "#fff", color: eqCat === c && !catEditMode ? "#fff" : "#475569", border: `1px solid ${eqCat === c && !catEditMode ? "#1e3a5f" : "#e2e8f0"}`, padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: eqCat === c && !catEditMode ? 600 : 400 }}>{c}</button>
          ))}
          {adminMode && !catEditMode && (
            <button onClick={() => setCatEditMode(true)} style={{ ...btn("#f8fafc", "#475569"), border: "1px solid #e2e8f0", fontSize: 12, padding: "6px 12px" }}><Edit2 size={13} />카테고리 편집</button>
          )}
        </div>
        {adminMode && catEditMode && (
          <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 16, marginTop: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e", marginBottom: 10 }}>카테고리 편집</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {eqCats.map((c, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setCatDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (catDragIdx === null || catDragIdx === i) return;
                    const a = [...eqCats]; const [m] = a.splice(catDragIdx, 1); a.splice(i, 0, m);
                    setEqCats(a); setCatDragIdx(null);
                  }}
                  style={{ display: "flex", gap: 8, alignItems: "center", background: "#fff", borderRadius: 6, border: "1px solid #e2e8f0", padding: "6px 10px", cursor: "grab" }}
                >
                  <GripVertical size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                  <input value={c} onChange={(e) => { const a = [...eqCats]; a[i] = e.target.value; setEqCats(a); }} style={{ ...inp(), flex: 1, padding: "5px 8px" }} />
                  <button onClick={() => { if (eqCats.length <= 1) { alert("최소 1개 이상이어야 합니다."); return; } const a = eqCats.filter((_, x) => x !== i); setEqCats(a); if (eqCat === c) setEqCat("전체"); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "5px 7px" }}><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEqCats([...eqCats, "새 카테고리"])} style={{ ...btn("#f1f5f9", "#475569"), fontSize: 12 }}><Plus size={12} />카테고리 추가</button>
              <button onClick={() => setCatEditMode(false)} style={{ ...btn(), fontSize: 12 }}><Save size={12} />완료</button>
            </div>
          </div>
        )}
      </div>

      {adminMode && (
        <button onClick={() => { setEqForm({ cat: eqCats[0] || "", name: "", specsText: "", uses: "", image: "", youtube: "" }); setEqEdit("new"); }} style={{ ...btn(), marginBottom: 16 }}><Plus size={14} />장비 추가</button>
      )}

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {filteredEq.map((eq) => (
          <div
            key={eq.id}
            draggable={adminMode}
            onDragStart={() => { if (adminMode) dragIdx.current = equipment.findIndex((e) => e.id === eq.id); }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = dragIdx.current;
              const to = equipment.findIndex((e) => e.id === eq.id);
              if (from === null || from === to) return;
              const a = [...equipment]; const [m] = a.splice(from, 1); a.splice(to, 0, m);
              setEquipment(a); dragIdx.current = null;
            }}
            style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", cursor: adminMode ? "grab" : "default" }}
          >
            <div style={{ background: "#f1f5f9", aspectRatio: "3/2", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12, overflow: "hidden" }}>
              {eq.image ? <img src={eq.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "장비 사진"}
            </div>
            <div style={{ padding: 18 }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>{eq.cat}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "8px 0 14px", lineHeight: 1.5, height: "3em", overflow: "hidden" }}>{renderName(eq.name)}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEqModal(eq)} style={{ ...btn(), flex: 1, justifyContent: "center", fontSize: 12 }}>상세 보기</button>
                {adminMode && (
                  <>
                    <button onClick={() => { setEqForm({ cat: eq.cat, name: eq.name, specsText: specsToText(eq.specs), uses: eq.uses, image: eq.image || "", youtube: eq.youtube || "" }); setEqEdit(eq.id); }} style={{ ...btn("#f1f5f9", "#475569"), padding: "8px 10px" }}><Edit2 size={13} /></button>
                    <button onClick={() => { if (confirm("삭제하시겠습니까?")) setEquipment(equipment.filter((e) => e.id !== eq.id)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "8px 10px" }}><Trash2 size={13} /></button>
                  </>
                )}
              </div>
            </div>
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
          <EquipmentContactEditor
            eqContact={eqContact}
            onSave={(v) => { setEqContact(v); setEditingContact(false); }}
            onCancel={() => setEditingContact(false)}
          />
        </div>
      )}

      {/* 문의하기 표시 */}
      {!editingContact && (
        <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, marginTop: adminMode ? 12 : 32, border: "1px solid #bfdbfe" }}>
          <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{eqContact.title}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{eqContact.desc}</div>
            <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{location.email}</div>
          </div>
        </div>
      )}

      {/* 장비 상세 모달 */}
      {eqModal && (
        <div onClick={() => setEqModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 560, width: "100%", maxHeight: "82vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 13, padding: "2px 8px", borderRadius: 10 }}>{eqModal.cat}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "8px 0 0", lineHeight: 1.4 }}>{renderName(eqModal.name)}</h3>
              </div>
              <button onClick={() => setEqModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            {eqModal.image && <img src={eqModal.image} style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", borderRadius: 8, marginBottom: 20 }} />}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 10 }}>주요 사양</div>
              <SpecsTable specs={eqModal.specs} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 8 }}>주요 용도</div>
              {(eqModal.uses || "").split("\n").filter(Boolean).map((u, i) => (
                <div key={i} style={{ fontSize: 12, color: "#334155", padding: "6px 0", borderBottom: "0.5px solid #f1f5f9" }}>• {u}</div>
              ))}
            </div>
            {eqModal.youtube && (
              <a href={eqModal.youtube} target="_blank" rel="noopener noreferrer" style={{ ...btn(), marginTop: 20, justifyContent: "center", textDecoration: "none", display: "flex" }}>
                i-Tube 바로가기 →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
