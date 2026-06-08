import { useState, useEffect } from "react";
import { Mail, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEFAULT_KOLAS, DEFAULT_SITE } from "../data/defaults";
import PageHeader from "../components/PageHeader";

const KOLAS_HEADER = { label: "KOLAS", title: "KOLAS 인정 규격 안내" };
const KOLAS_CONTACT = { title: "문의하기", desc: "공인 시험성적서 발급 및 시험평가 관련 문의사항은 아래 이메일로 문의해 주시기 바랍니다." };

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

export default function KolasPage({ location, adminUser }) {
  const [summary, setSummary] = useState(DEFAULT_SITE.kolasSummary);
  const [items, setItems] = useState(DEFAULT_KOLAS);
  const [contact, setContact] = useState(KOLAS_CONTACT);
  const [ed, setEd] = useState(null); // { sec: 'summary'|'item'|'contact', itemId, data }
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*")
      .in("key", ["kolas_summary", "kolas_items", "kolas_contact"]);
    if (!data) return;
    const m = Object.fromEntries(data.map(r => [r.key, r.value]));
    if (m.kolas_summary?.text) setSummary(m.kolas_summary.text);
    if (m.kolas_items?.items) setItems(m.kolas_items.items);
    if (m.kolas_contact) setContact(m.kolas_contact);
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
    const newItems = itemId === "new"
      ? [...items, { ...d, id: Date.now() }]
      : items.map(it => it.id === itemId ? { ...d } : it);
    await saveKey("kolas_items", { items: newItems });
  };

  const delItem = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await saveKey("kolas_items", { items: items.filter(it => it.id !== id) });
  };

  const SaveRow = ({ onSave }) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
      <button onClick={() => setEd(null)} style={ab()}>취소</button>
      <button onClick={onSave} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
    </div>
  );

  const ItemForm = ({ itemId }) => (
    <div style={EP}>
      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="규격 코드 (예: KS B ISO 9283)" value={ed.data.code || ""} onChange={e => patch({ code: e.target.value })} style={{ ...IS, width: "100%" }} />
        <input placeholder="규격명" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={{ ...IS, width: "100%" }} />
        <textarea placeholder="설명" value={ed.data.desc || ""} onChange={e => patch({ desc: e.target.value })}
          style={{ ...IS, width: "100%", height: 80, resize: "vertical" }} />
      </div>
      <SaveRow onSave={() => saveItem(itemId)} />
    </div>
  );

  return (
    <div>
      <PageHeader label={KOLAS_HEADER.label} title={KOLAS_HEADER.title} />

      {/* KOLAS 개요 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>KOLAS 개요</span>
          {adminUser && (
            <button onClick={() => openEd("summary", null, { text: summary })} style={ab()}>
              <Pencil size={12} /> 편집
            </button>
          )}
        </div>
        {isEd("summary") ? (
          <div style={EP}>
            <textarea value={ed.data.text || ""} onChange={e => patch({ text: e.target.value })}
              style={{ ...IS, width: "100%", height: 100, resize: "vertical" }} />
            <SaveRow onSave={() => saveKey("kolas_summary", { text: ed.data.text })} />
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 22px", fontSize: 14, color: "#475569", lineHeight: 1.9 }}>
            {summary}
          </div>
        )}
      </div>

      {/* 규격 목록 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>규격 목록</span>
          {adminUser && (
            <button onClick={() => openEd("item", "new", { code: "", title: "", desc: "" })} style={ab()}>
              <Plus size={12} /> 규격 추가
            </button>
          )}
        </div>

        {isEd("item", "new") && (
          <div style={{ marginBottom: 14 }}>
            <ItemForm itemId="new" />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((k) => isEd("item", k.id) ? (
            <ItemForm key={k.id} itemId={k.id} />
          ) : (
            <div key={k.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 22, position: "relative" }}>
              {adminUser && (
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
                  <button onClick={() => openEd("item", k.id, { ...k })} style={ab()}><Pencil size={11} /></button>
                  <button onClick={() => delItem(k.id)} style={ab("danger")}><Trash2 size={11} /></button>
                </div>
              )}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ background: "#1e3a5f", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, width: 175, textAlign: "center" }}>{k.code}</div>
                <div style={{ flex: 1, paddingRight: adminUser ? 80 : 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px" }}>{k.title}</h3>
                  <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.7 }}>{k.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 문의하기 */}
      <div style={{ marginTop: 32, position: "relative" }}>
        {adminUser && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
            <button onClick={() => openEd("contact", null, { ...contact, email: contact.email || location.email })} style={ab()}>
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
            <SaveRow onSave={() => saveKey("kolas_contact", ed.data)} />
          </div>
        ) : (
          <div style={{ background: "#eff6ff", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 14, border: "1px solid #bfdbfe" }}>
            <Mail size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 4 }}>{contact.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{contact.desc}</div>
              <div style={{ fontSize: 13, color: "#3b82f6", fontWeight: 500, marginTop: 4 }}>{contact.email || location.email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
