import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, GripVertical, X, Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import { DEFAULT_KOLAS } from "../data/defaults";
import useIsMobile from "../hooks/useIsMobile";

const ab = (v = "default") => ({
  background: v === "danger" ? "#fee2e2" : v === "primary" ? "#3b82f6" : "#f1f5f9",
  color: v === "danger" ? "#991b1b" : v === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer",
  fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
});

export default function KolasPage({ adminUser }) {
  const isMobile = useIsMobile();
  const [items, setItems] = useState(DEFAULT_KOLAS);
  const [ed, setEd] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", "kolas_items").limit(1);
    if (error) { console.error(error); return; }
    if (data?.[0]?.value?.items) setItems(data[0].value.items);
  };

  const saveKey = async (key, value) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({ key, value });
      if (error) throw error;
      setEd(null);
      await loadSettings();
    } finally {
      setSaving(false);
    }
  };

  const openEd = (itemId, data) => setEd({ itemId, data: JSON.parse(JSON.stringify(data)) });
  const isEd = (itemId) => ed?.itemId === itemId;
  const patch = (p) => setEd(e => ({ ...e, data: { ...e.data, ...p } }));

  const saveItem = async (itemId) => {
    const d = { ...ed.data };
    const newItems = itemId === "new"
      ? [...items, { ...d, id: Date.now() }]
      : items.map(it => it.id === itemId ? d : it);
    await saveKey("kolas_items", { items: newItems });
  };

  const delItem = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await saveKey("kolas_items", { items: items.filter(it => it.id !== id) });
  };

  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverIdx(idx); };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };
  const handleDrop = async (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const newOrder = [...items];
    const [moved] = newOrder.splice(dragIdx, 1);
    newOrder.splice(dropIdx, 0, moved);
    setItems(newOrder);
    setDragIdx(null);
    setDragOverIdx(null);
    await supabase.from("site_settings").upsert({ key: "kolas_items", value: { items: newOrder } });
  };

  const CardForm = ({ itemId }) => (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #bfdbfe", padding: "60px 30px 48px", position: "relative", textAlign: "center" }}>
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
        <button onClick={() => setEd(null)} style={{ ...ab(), padding: "4px 7px" }}><X size={12} /></button>
        <button onClick={() => saveItem(itemId)} disabled={saving}
          style={{ background: "#dcfce7", color: "#15803d", border: "none", borderRadius: 6, padding: "4px 7px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
          <Check size={12} />
        </button>
      </div>
      <div style={{ marginBottom: 40 }}>
        <input
          placeholder="규격 코드"
          value={ed.data.code || ""}
          onChange={e => patch({ code: e.target.value })}
          className="kolas-code-input"
          style={{
            background: "#3b82f6", color: "#fff", borderRadius: 6,
            padding: "10px 20px", fontSize: 18,
            fontFamily: "'Giants Regular', sans-serif", fontWeight: 400, lineHeight: 1,
            border: "none", outline: "none", textAlign: "center", minWidth: 140,
          }}
        />
      </div>
      <input
        placeholder="규격명"
        value={ed.data.title || ""}
        onChange={e => patch({ title: e.target.value })}
        style={{
          display: "block", width: "100%", fontSize: 15, fontWeight: 700, color: "#1e3a5f",
          border: "none", borderBottom: "1px solid #e2e8f0", outline: "none",
          textAlign: "center", background: "transparent", lineHeight: 1.5,
          padding: "4px 0", marginBottom: 16, fontFamily: "inherit", boxSizing: "border-box",
        }}
      />
      <textarea
        placeholder="설명"
        value={ed.data.desc || ""}
        onChange={e => patch({ desc: e.target.value })}
        style={{
          display: "block", width: "100%", fontSize: 13, color: "#475569", lineHeight: 1.7,
          border: "none", borderBottom: "1px solid #e2e8f0", outline: "none",
          textAlign: "center", background: "transparent", resize: "none",
          height: 80, fontFamily: "inherit", boxSizing: "border-box",
        }}
      />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 42 }}>
        <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>KOLAS 인정 규격</div>
        {adminUser && !isEd("new") && (
          <button onClick={() => openEd("new", { code: "", title: "", desc: "" })} style={ab()}>
            <Plus size={12} /> 규격 추가
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 24 }}>
        {isEd("new") && <CardForm itemId="new" />}

        {items.map((k, idx) => isEd(k.id) ? (
          <CardForm key={k.id} itemId={k.id} />
        ) : (
          <div key={k.id}
            draggable={!!adminUser}
            onDragStart={adminUser ? e => handleDragStart(e, idx) : undefined}
            onDragOver={adminUser ? e => handleDragOver(e, idx) : undefined}
            onDrop={adminUser ? e => handleDrop(e, idx) : undefined}
            onDragEnd={adminUser ? handleDragEnd : undefined}
            style={{
              background: "#fff", borderRadius: 12, padding: "100px 30px", position: "relative", textAlign: "center",
              border: dragOverIdx === idx && dragIdx !== idx ? "2px solid #3b82f6" : "1px solid #e2e8f0",
              opacity: dragIdx === idx ? 0.4 : 1,
              transition: "opacity 0.15s",
              cursor: adminUser ? "grab" : "default",
            }}>
            {adminUser && (
              <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 4 }}>
                <button onClick={() => openEd(k.id, { ...k })} style={{ ...ab(), padding: "4px 7px" }} onMouseDown={e => e.stopPropagation()}><Pencil size={11} /></button>
                <button onClick={() => delItem(k.id)} style={{ ...ab("danger"), padding: "4px 7px" }} onMouseDown={e => e.stopPropagation()}><Trash2 size={11} /></button>
              </div>
            )}
            {adminUser && (
              <div style={{ position: "absolute", top: 14, left: 14 }}>
                <GripVertical size={14} color="#cbd5e1" />
              </div>
            )}
            <div style={{ display: "inline-block", background: "#3b82f6", color: "#fff", borderRadius: 6, padding: "10px 20px", fontSize: 18, fontFamily: "'Giants Regular', sans-serif", fontWeight: 400, lineHeight: 1, marginBottom: 40 }}>{k.code}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", lineHeight: 1.5, margin: "0 0 14px" }}>{k.title}</h3>
            {k.desc && (
              <div>
                {k.desc.split("\n").filter(l => l.trim()).map((line, li, arr) => (
                  <div key={li} style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: li < arr.length - 1 ? 8 : 0 }}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
