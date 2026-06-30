import { useState, useEffect } from "react";
import { X, Pencil, Plus, Trash2, Check, GripVertical, Settings, Bot, Box, Package } from "lucide-react";

const ActuatorIcon = ({ size = 18, color = "currentColor", strokeWidth = 1.5 }) => {
  const boltAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  const spokeAngles = [0, 60, 120, 180, 240, 300];
  const bolt = (deg) => {
    const r = deg * Math.PI / 180;
    return [+(12 + 8.5 * Math.sin(r)).toFixed(2), +(12 - 8.5 * Math.cos(r)).toFixed(2)];
  };
  const spoke = (deg, radius) => {
    const r = deg * Math.PI / 180;
    return [+(12 + radius * Math.sin(r)).toFixed(2), +(12 - radius * Math.cos(r)).toFixed(2)];
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10.5" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      {boltAngles.map((deg, i) => { const [x, y] = bolt(deg); return <circle key={i} cx={x} cy={y} r="0.9" fill={color} stroke="none" />; })}
      {spokeAngles.map((deg, i) => { const [x1, y1] = spoke(deg, 2.5); const [x2, y2] = spoke(deg, 5.5); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />; })}
    </svg>
  );
};

const CAT_ICONS = [ActuatorIcon, Settings, Bot, Box];
import { supabase } from "../lib/supabase";
import { DEFAULT_EQUIPMENT } from "../data/defaults";
import useIsMobile from "../hooks/useIsMobile";

const IS = {
  border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px",
  fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};
const ab = (v = "default") => ({
  background: v === "danger" ? "#fee2e2" : v === "primary" ? "#3b82f6" : "#f1f5f9",
  color: v === "danger" ? "#991b1b" : v === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer",
  fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
});

const renderName = (n) =>
  n.split("//").map((p, i, a) => <span key={i}>{p}{i < a.length - 1 && <br />}</span>);

export default function EquipmentPage({ adminUser }) {
  const isMobile = useIsMobile();
  const [equipment, setEquipment] = useState(DEFAULT_EQUIPMENT);
  const [editData, setEditData] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "equipment_items").limit(1);
    if (data?.[0]?.value?.items) setEquipment(data[0].value.items);
  };

  const saveKey = async (key, value) => {
    const { error } = await supabase.from("site_settings").upsert({ key, value });
    if (error) console.error(error);
  };

  const openEdit = (eq) =>
    setEditData({ id: eq.id, cat: eq.cat || "", name: eq.name || "", image: eq.image || "", itube: eq.itube || "" });
  const openAdd = () =>
    setEditData({ cat: "", name: "", image: "", itube: "" });
  const closeEdit = () => setEditData(null);
  const patchEd = (p) => setEditData(d => ({ ...d, ...p }));

  const saveEdit = () => {
    const newItems = equipment.map(it => it.id === editData.id ? { ...it, ...editData } : it);
    setEquipment(newItems);
    closeEdit();
    saveKey("equipment_items", { items: newItems });
  };

  const saveAdd = () => {
    const newItems = [...equipment, { ...editData, id: Date.now() }];
    setEquipment(newItems);
    closeEdit();
    saveKey("equipment_items", { items: newItems });
  };

  const delItem = (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    const newItems = equipment.filter(it => it.id !== id);
    setEquipment(newItems);
    saveKey("equipment_items", { items: newItems });
  };

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  };
  const handleDragEnd = () => { setDragId(null); setDragOverId(null); };
  const handleDrop = (e, dropId) => {
    e.preventDefault();
    if (!dragId || dragId === dropId) { setDragId(null); setDragOverId(null); return; }
    const dragItem = equipment.find(eq => eq.id === dragId);
    const dropItem = equipment.find(eq => eq.id === dropId);
    if (!dragItem || !dropItem || dragItem.cat !== dropItem.cat) { setDragId(null); setDragOverId(null); return; }
    const newItems = [...equipment];
    const from = newItems.findIndex(eq => eq.id === dragId);
    const to = newItems.findIndex(eq => eq.id === dropId);
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setEquipment(newItems);
    setDragId(null);
    setDragOverId(null);
    saveKey("equipment_items", { items: newItems });
  };

  const cats = [...new Set(equipment.map(e => e.cat).filter(Boolean))];
  const isAdd = editData && !editData.id;
  const isEdit = (id) => editData?.id === id;

  const CardForm = ({ onSave }) => (
    <div style={{ border: "1px solid #bfdbfe", position: "relative", background: "#fff" }}>
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 1, display: "flex", gap: 4 }}>
        <button onClick={closeEdit} style={{ ...ab(), padding: "4px 7px" }}><X size={12} /></button>
        <button onClick={onSave}
          style={{ background: "#dcfce7", color: "#15803d", border: "none", borderRadius: 6, padding: "4px 7px", cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
          <Check size={12} />
        </button>
      </div>
      <div style={{ padding: "36px 12px 14px", display: "grid", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 8 }}>
          <input placeholder="카테고리" value={editData.cat || ""} onChange={e => patchEd({ cat: e.target.value })} style={IS} />
          <input placeholder="장비명 (줄바꿈은 //)" value={editData.name || ""} onChange={e => patchEd({ name: e.target.value })} style={IS} />
        </div>
        <input placeholder="이미지 경로 (/images/equipment/xxx.jpg)" value={editData.image || ""} onChange={e => patchEd({ image: e.target.value })} style={{ ...IS, width: "100%" }} />
        <input placeholder="i-Tube 링크 URL" value={editData.itube || ""} onChange={e => patchEd({ itube: e.target.value })} style={{ ...IS, width: "100%" }} />
      </div>
    </div>
  );

  const EquipCard = ({ eq }) => {
    const dragging = dragId === eq.id;
    const dragOver = dragOverId === eq.id && dragId !== eq.id;
    return (
      <div
        draggable={!!adminUser}
        onDragStart={adminUser ? e => handleDragStart(e, eq.id) : undefined}
        onDragOver={adminUser ? e => handleDragOver(e, eq.id) : undefined}
        onDrop={adminUser ? e => handleDrop(e, eq.id) : undefined}
        onDragEnd={adminUser ? handleDragEnd : undefined}
        style={{ opacity: dragging ? 0.4 : 1, transition: "opacity 0.15s", outline: dragOver ? "2px solid #3b82f6" : "none" }}
      >
        <div
          onClick={() => eq.itube && window.open(eq.itube, "_blank", "noopener,noreferrer")}
          style={{ aspectRatio: "4/3", background: "#f1f5f9", overflow: "hidden", position: "relative", cursor: eq.itube ? "pointer" : "default" }}
          onMouseEnter={e => { if (eq.itube) { e.currentTarget.querySelector(".hover-overlay").style.background = "rgba(0,0,0,0.22)"; e.currentTarget.querySelector(".hover-label").style.opacity = 1; } }}
          onMouseLeave={e => { if (eq.itube) { e.currentTarget.querySelector(".hover-overlay").style.background = "rgba(0,0,0,0)"; e.currentTarget.querySelector(".hover-label").style.opacity = 0; } }}
        >
          {eq.image
            ? <img src={eq.image} alt={eq.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12 }}>장비 사진</div>
          }
          <div className="hover-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.15s", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span className="hover-label" style={{ opacity: 0, fontSize: 12, color: "#fff", fontWeight: 600, letterSpacing: 0.5, transition: "opacity 0.15s" }}>i-Tube →</span>
          </div>
          {adminUser && (
            <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => openEdit(eq)} style={{ ...ab(), padding: "4px 8px" }}><Pencil size={11} /></button>
              <button onClick={() => delItem(eq.id)} style={{ ...ab("danger"), padding: "4px 8px" }}><Trash2 size={11} /></button>
            </div>
          )}
          {adminUser && (
            <div style={{ position: "absolute", top: 6, left: 6, cursor: "grab" }} onClick={e => e.stopPropagation()}>
              <GripVertical size={14} color="rgba(255,255,255,0.8)" />
            </div>
          )}
        </div>
        <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: "#1e3a5f", lineHeight: 1.5 }}>
          {renderName(eq.name)}
        </div>
      </div>
    );
  };

  const renderGrid = (items) => (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? "16px 16px" : "24px 28px" }}>
      {items.map(eq => isEdit(eq.id)
        ? <CardForm key={eq.id} onSave={saveEdit} />
        : <EquipCard key={eq.id} eq={eq} />
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
        <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>보유 장비 목록</div>
        {adminUser && !editData && (
          <button onClick={openAdd} style={ab()}>
            <Plus size={12} /> 장비 추가
          </button>
        )}
      </div>

      {isAdd && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? "16px 16px" : "24px 28px", marginBottom: 52 }}>
          <CardForm onSave={saveAdd} />
        </div>
      )}

      {cats.map((cat, ci) => (
        <div key={cat} style={{ marginBottom: ci < cats.length - 1 ? 64 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid #e2e8f0" }}>
            {(() => { const Icon = CAT_ICONS[ci % CAT_ICONS.length]; return <Icon size={18} color="#3b82f6" strokeWidth={1.5} />; })()}
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", lineHeight: 1 }}>{cat}</span>
          </div>
          {renderGrid(equipment.filter(e => e.cat === cat))}
        </div>
      ))}

      {equipment.filter(e => !e.cat).length > 0 && (
        <div style={{ marginTop: cats.length > 0 ? 64 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 14, borderBottom: "1px solid #e2e8f0" }}>
            <Package size={18} color="#3b82f6" strokeWidth={1.5} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", lineHeight: 1 }}>기타</span>
          </div>
          {renderGrid(equipment.filter(e => !e.cat))}
        </div>
      )}
    </div>
  );
}
