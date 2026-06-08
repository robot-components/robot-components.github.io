import { useState, useEffect } from "react";
import { Mail, X, Pencil, Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEFAULT_EQUIPMENT } from "../data/defaults";
import PageHeader from "../components/PageHeader";
import SpecsTable from "../components/SpecsTable";

const EQ_HEADER = { label: "보유 장비", title: "보유 장비 목록" };
const EQ_CONTACT_DEFAULT = { title: "문의하기", desc: "장비 이용 및 시험평가 관련 문의사항은 아래 이메일로 문의해 주시기 바랍니다.", email: "" };

const IS = {
  border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px",
  fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};
const EP = {
  background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 20,
};
const ab = (v = "default") => ({
  background: v === "danger" ? "#fee2e2" : v === "primary" ? "#1e3a5f" : "#f1f5f9",
  color: v === "danger" ? "#991b1b" : v === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer",
  fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
});

const serializeSpecs = (specs = []) =>
  specs.map(sec =>
    `## ${sec.section}\n${(sec.rows || []).map(r => `${r.label} | ${r.value}`).join("\n")}`
  ).join("\n\n");

const parseSpecs = (text) => {
  const sections = [];
  let cur = null;
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith("## ")) {
      cur = { section: t.slice(3), rows: [] };
      sections.push(cur);
    } else if (cur && t.includes(" | ")) {
      const idx = t.indexOf(" | ");
      cur.rows.push({ label: t.slice(0, idx), value: t.slice(idx + 3) });
    }
  }
  return sections;
};

const renderName = (n) =>
  n.split("//").map((p, i, a) => <span key={i}>{p}{i < a.length - 1 && <br />}</span>);

export default function EquipmentPage({ location, adminUser }) {
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);
  const [contact, setContact] = useState({ ...EQ_CONTACT_DEFAULT, email: location?.email || "" });
  const [eqCat, setEqCat] = useState("전체");

  // modal: { mode: 'view'|'edit'|'add', item: eq|null }
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  // drag state (only active in 전체 view)
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // contact edit
  const [contactEd, setContactEd] = useState(false);
  const [contactData, setContactData] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*")
      .in("key", ["equipment_items", "equipment_contact"]);
    if (!data) return;
    const m = Object.fromEntries(data.map(r => [r.key, r.value]));
    if (m.equipment_items?.items) setEquipment(m.equipment_items.items);
    if (m.equipment_contact) setContact(m.equipment_contact);
  };

  const saveKey = async (key, value) => {
    setSaving(true);
    await supabase.from("site_settings").upsert({ key, value });
    setSaving(false);
  };

  // ── 모달 helpers ──
  const openView = (eq) => setModal({ mode: "view", item: eq });
  const openEdit = (eq) => {
    setEditData({ ...JSON.parse(JSON.stringify(eq)), specsText: serializeSpecs(eq.specs) });
    setModal({ mode: "edit", item: eq });
  };
  const openAdd = () => {
    setEditData({ cat: "", name: "", image: "", itube: "", specsText: "", uses: "" });
    setModal({ mode: "add", item: null });
  };
  const closeModal = () => { setModal(null); setEditData(null); };
  const patchEd = (p) => setEditData(d => ({ ...d, ...p }));

  const saveEdit = async () => {
    const d = { ...editData };
    if (d.specsText !== undefined) { d.specs = parseSpecs(d.specsText); delete d.specsText; }
    const newItems = equipment.map(it => it.id === d.id ? d : it);
    await saveKey("equipment_items", { items: newItems });
    setEquipment(newItems);
    closeModal();
    loadSettings();
  };

  const saveAdd = async () => {
    const d = { ...editData, id: Date.now() };
    if (d.specsText !== undefined) { d.specs = parseSpecs(d.specsText); delete d.specsText; }
    const newItems = [...equipment, d];
    await saveKey("equipment_items", { items: newItems });
    setEquipment(newItems);
    closeModal();
    loadSettings();
  };

  const delItem = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    const newItems = equipment.filter(it => it.id !== id);
    await saveKey("equipment_items", { items: newItems });
    setEquipment(newItems);
    closeModal();
    loadSettings();
  };

  // ── 드래그 앤 드롭 ──
  const canDrag = adminUser && eqCat === "전체";

  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const newOrder = [...equipment];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    setEquipment(newOrder);
    setDragIdx(null);
    setDragOverIdx(null);
    await saveKey("equipment_items", { items: newOrder });
    loadSettings();
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  // ── contact edit ──
  const saveContact = async () => {
    await saveKey("equipment_contact", contactData);
    setContact(contactData);
    setContactEd(false);
    loadSettings();
  };

  const cats = [...new Set(equipment.map(e => e.cat).filter(Boolean))];
  const filtered = eqCat === "전체" ? equipment : equipment.filter(e => e.cat === eqCat);

  // ── 편집 폼 (모달 내부) ──
  const EditForm = ({ onSave }) => (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
        <input placeholder="카테고리" value={editData.cat || ""} onChange={e => patchEd({ cat: e.target.value })} style={IS} />
        <input placeholder="장비명 (줄바꿈은 //)" value={editData.name || ""} onChange={e => patchEd({ name: e.target.value })} style={IS} />
      </div>
      <input placeholder="이미지 경로 (예: /images/equipment/xxx.jpg)" value={editData.image || ""} onChange={e => patchEd({ image: e.target.value })} style={{ ...IS, width: "100%" }} />
      <input placeholder="i-Tube 링크 URL" value={editData.itube || ""} onChange={e => patchEd({ itube: e.target.value })} style={{ ...IS, width: "100%" }} />
      <div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
          주요 사양 — <code style={{ fontSize: 11 }}>## 섹션명</code> 줄 구분, 항목은 <code style={{ fontSize: 11 }}>레이블 | 값</code>
        </div>
        <textarea
          placeholder={"## 고속축\n모터 용량 | 1.41 kW\n\n## 저속축\n모터 용량 | 5.1 kW"}
          value={editData.specsText || ""}
          onChange={e => patchEd({ specsText: e.target.value })}
          style={{ ...IS, width: "100%", height: 150, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>주요 용도 (줄당 하나)</div>
        <textarea
          value={editData.uses || ""}
          onChange={e => patchEd({ uses: e.target.value })}
          style={{ ...IS, width: "100%", height: 90, resize: "vertical" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
        <button onClick={closeModal} style={ab()}>취소</button>
        <button onClick={onSave} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader label={EQ_HEADER.label} title={EQ_HEADER.title} />

      {/* 카테고리 필터 + 추가 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["전체", ...cats].map((c) => (
            <button key={c} onClick={() => setEqCat(c)}
              style={{ background: eqCat === c ? "#1e3a5f" : "#fff", color: eqCat === c ? "#fff" : "#475569", border: `1px solid ${eqCat === c ? "#1e3a5f" : "#e2e8f0"}`, padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: eqCat === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
        {adminUser && (
          <button onClick={openAdd} style={ab()}>
            <Plus size={12} /> 장비 추가
          </button>
        )}
      </div>

      {canDrag && (
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
          <GripVertical size={13} /> 드래그로 순서를 변경할 수 있습니다
        </div>
      )}

      {/* 장비 그리드 */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {filtered.map((eq, idx) => (
          <div
            key={eq.id}
            draggable={canDrag}
            onDragStart={canDrag ? (e) => handleDragStart(e, idx) : undefined}
            onDragOver={canDrag ? (e) => handleDragOver(e, idx) : undefined}
            onDrop={canDrag ? (e) => handleDrop(e, idx) : undefined}
            onDragEnd={canDrag ? handleDragEnd : undefined}
            style={{
              background: "#fff", borderRadius: 12, overflow: "hidden",
              border: dragOverIdx === idx && dragIdx !== idx
                ? "2px solid #3b82f6"
                : "1px solid #e2e8f0",
              opacity: dragIdx === idx ? 0.5 : 1,
              cursor: canDrag ? "grab" : "default",
            }}
          >
            <div style={{ background: "#f1f5f9", aspectRatio: "3/2", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12, overflow: "hidden", position: "relative" }}>
              {eq.image
                ? <img src={eq.image} alt={eq.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "장비 사진"}
              {canDrag && (
                <div style={{ position: "absolute", top: 6, left: 6, color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.25)", borderRadius: 4, padding: "2px 4px", display: "flex" }}>
                  <GripVertical size={14} />
                </div>
              )}
            </div>
            <div style={{ padding: 18 }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>{eq.cat}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "8px 0 14px", lineHeight: 1.5, height: "3em", overflow: "hidden" }}>{renderName(eq.name)}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openView(eq)}
                  style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "7px 0", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500 }}>
                  상세 보기
                </button>
                {adminUser && (
                  <>
                    <button onClick={() => openEdit(eq)} style={{ ...ab(), padding: "7px 10px" }}><Pencil size={12} /></button>
                    <button onClick={() => delItem(eq.id)} style={{ ...ab("danger"), padding: "7px 10px" }}><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 문의하기 */}
      <div style={{ marginTop: 32, position: "relative" }}>
        {adminUser && !contactEd && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
            <button onClick={() => { setContactData({ ...contact }); setContactEd(true); }} style={ab()}>
              <Pencil size={12} /> 편집
            </button>
          </div>
        )}
        {contactEd ? (
          <div style={EP}>
            <div style={{ display: "grid", gap: 8 }}>
              <input placeholder="제목" value={contactData.title || ""} onChange={e => setContactData(d => ({ ...d, title: e.target.value }))} style={{ ...IS, width: "100%" }} />
              <textarea placeholder="설명" value={contactData.desc || ""} onChange={e => setContactData(d => ({ ...d, desc: e.target.value }))}
                style={{ ...IS, width: "100%", height: 70, resize: "vertical" }} />
              <input placeholder="이메일" value={contactData.email || ""} onChange={e => setContactData(d => ({ ...d, email: e.target.value }))} style={{ ...IS, width: "100%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button onClick={() => setContactEd(false)} style={ab()}>취소</button>
              <button onClick={saveContact} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
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

      {/* ── 모달 (상세 보기 / 편집 / 추가) ── */}
      {modal && (
        <div onClick={closeModal}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 560, width: "100%", maxHeight: "88vh", overflowY: "auto" }}>

            {/* 모달 헤더 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                {modal.mode === "add" ? (
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>새 장비 추가</h3>
                ) : (
                  <>
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 13, padding: "2px 8px", borderRadius: 10 }}>{modal.item.cat}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "8px 0 0", lineHeight: 1.4 }}>
                      {modal.mode === "edit" ? "장비 편집" : modal.item.name.replace(/\/\//g, " ")}
                    </h3>
                  </>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {adminUser && modal.mode === "view" && (
                  <button onClick={() => openEdit(modal.item)} style={ab()}><Pencil size={12} /> 편집</button>
                )}
                <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}><X size={20} /></button>
              </div>
            </div>

            {/* 상세 보기 */}
            {modal.mode === "view" && (
              <>
                {modal.item.image && (
                  <img src={modal.item.image} alt={modal.item.name}
                    style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", borderRadius: 8, marginBottom: 20 }} />
                )}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 10 }}>주요 사양</div>
                  <SpecsTable specs={modal.item.specs} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 8 }}>주요 용도</div>
                  {(modal.item.uses || "").split("\n").filter(Boolean).map((u, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#334155", padding: "6px 0", borderBottom: "0.5px solid #f1f5f9" }}>• {u}</div>
                  ))}
                </div>
                {modal.item.itube && (
                  <a href={modal.item.itube} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", justifyContent: "center", marginTop: 20, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
                    i-Tube 바로가기 →
                  </a>
                )}
              </>
            )}

            {/* 편집 폼 */}
            {modal.mode === "edit" && editData && <EditForm onSave={saveEdit} />}

            {/* 추가 폼 */}
            {modal.mode === "add" && editData && <EditForm onSave={saveAdd} />}
          </div>
        </div>
      )}
    </div>
  );
}
