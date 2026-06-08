import { useState, useEffect } from "react";
import { Mail, X, Pencil, Plus, Trash2 } from "lucide-react";
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
  const [eqModal, setEqModal] = useState(null);
  const [ed, setEd] = useState(null); // { sec: 'item'|'contact', itemId, data }
  const [saving, setSaving] = useState(false);

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
    setEd(null);
    loadSettings();
  };

  const openEd = (sec, itemId = null, data = null) =>
    setEd({ sec, itemId, data: data ? JSON.parse(JSON.stringify(data)) : {} });

  const isEd = (sec, itemId) =>
    ed?.sec === sec && (itemId === undefined ? true : ed?.itemId === itemId);

  const patch = (p) => setEd(e => ({ ...e, data: { ...e.data, ...p } }));

  const saveItem = async (itemId) => {
    const d = { ...ed.data };
    if (d.specsText !== undefined) { d.specs = parseSpecs(d.specsText); delete d.specsText; }
    const newItems = itemId === "new"
      ? [...equipment, { ...d, id: Date.now() }]
      : equipment.map(it => it.id === itemId ? { ...d } : it);
    await saveKey("equipment_items", { items: newItems });
  };

  const delItem = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await saveKey("equipment_items", { items: equipment.filter(it => it.id !== id) });
  };

  const cats = [...new Set(equipment.map(e => e.cat).filter(Boolean))];
  const filtered = eqCat === "전체" ? equipment : equipment.filter(e => e.cat === eqCat);

  const SaveRow = ({ onSave }) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
      <button onClick={() => setEd(null)} style={ab()}>취소</button>
      <button onClick={onSave} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
    </div>
  );

  const ItemForm = ({ itemId }) => (
    <div style={EP}>
      <div style={{ fontWeight: 600, fontSize: 13, color: "#1e3a5f", marginBottom: 12 }}>
        {itemId === "new" ? "새 장비 추가" : "장비 편집"}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
          <input placeholder="카테고리" value={ed.data.cat || ""} onChange={e => patch({ cat: e.target.value })} style={IS} />
          <input placeholder="장비명 (줄바꿈은 //)" value={ed.data.name || ""} onChange={e => patch({ name: e.target.value })} style={IS} />
        </div>
        <input placeholder="이미지 경로 (예: /images/equipment/xxx.jpg)" value={ed.data.image || ""} onChange={e => patch({ image: e.target.value })} style={{ ...IS, width: "100%" }} />
        <input placeholder="i-Tube 링크 URL" value={ed.data.itube || ""} onChange={e => patch({ itube: e.target.value })} style={{ ...IS, width: "100%" }} />
        <div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
            주요 사양 — <code style={{ fontSize: 11 }}>## 섹션명</code> 으로 구분, 항목은 <code style={{ fontSize: 11 }}>레이블 | 값</code>
          </div>
          <textarea
            placeholder={"## 고속축\n모터 용량 | 1.41 kW\n모터 회전 속도 범위 | 10 ~ 4,200 min⁻¹\n\n## 저속축\n모터 용량 | 5.1 kW"}
            value={ed.data.specsText || ""}
            onChange={e => patch({ specsText: e.target.value })}
            style={{ ...IS, width: "100%", height: 160, resize: "vertical", fontFamily: "monospace", fontSize: 12 }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>주요 용도 (줄당 하나)</div>
          <textarea
            placeholder={"전압, 전류, 토크, 회전속도 등 기본 성능 측정\n구동 응답 및 위치 제어 성능 측정"}
            value={ed.data.uses || ""}
            onChange={e => patch({ uses: e.target.value })}
            style={{ ...IS, width: "100%", height: 100, resize: "vertical" }}
          />
        </div>
      </div>
      <SaveRow onSave={() => saveItem(itemId)} />
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
          <button onClick={() => openEd("item", "new", { cat: "", name: "", image: "", itube: "", specsText: "", uses: "" })} style={ab()}>
            <Plus size={12} /> 장비 추가
          </button>
        )}
      </div>

      {/* 새 장비 추가 폼 */}
      {isEd("item", "new") && (
        <div style={{ marginBottom: 20 }}>
          <ItemForm itemId="new" />
        </div>
      )}

      {/* 장비 그리드 */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
        {filtered.map((eq) => (
          <div key={eq.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ background: "#f1f5f9", aspectRatio: "3/2", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12, overflow: "hidden" }}>
              {eq.image
                ? <img src={eq.image} alt={eq.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "장비 사진"}
            </div>
            <div style={{ padding: 18 }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, padding: "2px 8px", borderRadius: 10 }}>{eq.cat}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "8px 0 14px", lineHeight: 1.5, height: "3em", overflow: "hidden" }}>{renderName(eq.name)}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEqModal(eq)}
                  style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "7px 0", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 500 }}>
                  상세 보기
                </button>
                {adminUser && (
                  <>
                    <button onClick={() => openEd("item", eq.id, { ...eq, specsText: serializeSpecs(eq.specs) })}
                      style={{ ...ab(), padding: "7px 10px" }}><Pencil size={12} /></button>
                    <button onClick={() => delItem(eq.id)}
                      style={{ ...ab("danger"), padding: "7px 10px" }}><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 아이템 편집 폼 (그리드 아래 전체 너비) */}
      {isEd("item") && ed.itemId !== "new" && (
        <div style={{ marginTop: 16 }}>
          <ItemForm itemId={ed.itemId} />
        </div>
      )}

      {/* 문의하기 */}
      <div style={{ marginTop: 32, position: "relative" }}>
        {adminUser && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
            <button onClick={() => openEd("contact", null, { ...contact })} style={ab()}>
              <Pencil size={12} /> 편집
            </button>
          </div>
        )}
        {isEd("contact") ? (
          <div style={EP}>
            <div style={{ display: "grid", gap: 8 }}>
              <input placeholder="제목" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={{ ...IS, width: "100%" }} />
              <textarea placeholder="설명" value={ed.data.desc || ""} onChange={e => patch({ desc: e.target.value })}
                style={{ ...IS, width: "100%", height: 70, resize: "vertical" }} />
              <input placeholder="이메일" value={ed.data.email || ""} onChange={e => patch({ email: e.target.value })} style={{ ...IS, width: "100%" }} />
            </div>
            <SaveRow onSave={() => saveKey("equipment_contact", ed.data)} />
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

      {/* 장비 상세 모달 */}
      {eqModal && (
        <div onClick={() => setEqModal(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 560, width: "100%", maxHeight: "82vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 13, padding: "2px 8px", borderRadius: 10 }}>{eqModal.cat}</span>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e3a5f", margin: "8px 0 0", lineHeight: 1.4 }}>{eqModal.name.replace(/\/\//g, " ")}</h3>
              </div>
              <button onClick={() => setEqModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            {eqModal.image && (
              <img src={eqModal.image} alt={eqModal.name} style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", borderRadius: 8, marginBottom: 20 }} />
            )}
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
            {eqModal.itube && (
              <a href={eqModal.itube} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", justifyContent: "center", marginTop: 20, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
                i-Tube 바로가기 →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
