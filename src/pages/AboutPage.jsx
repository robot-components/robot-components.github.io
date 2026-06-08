import { useState, useEffect } from "react";
import { ChevronRight, MapPin, Mail, Globe, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  DEFAULT_HERO, DEFAULT_INTRO, DEFAULT_SUPPORT, DEFAULT_WORKS,
  DEFAULT_PROCESS, DEFAULT_LOCATION, SUPPORT_COLORS,
} from "../data/defaults";
import { PAGES } from "../data/pages";
import SectionHeader from "../components/SectionHeader";

const IS = {
  border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px",
  fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};
const EP = {
  background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 12,
  padding: 20, marginBottom: 16,
};
const ab = (v = "default") => ({
  background: v === "danger" ? "#fee2e2" : v === "primary" ? "#1e3a5f" : "#f1f5f9",
  color: v === "danger" ? "#991b1b" : v === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer",
  fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
});

const serializeBlocks = (blocks = []) =>
  blocks.map(b => b.type === "section" ? `## ${b.text}` : b.text).join("\n");
const parseBlocks = (text) =>
  text.split("\n").filter(l => l.trim()).map(l =>
    l.startsWith("## ") ? { type: "section", text: l.slice(3) } : { type: "bullet", text: l }
  );

export default function AboutPage({ nav, adminUser }) {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [intro, setIntro] = useState(DEFAULT_INTRO);
  const [support, setSupport] = useState(DEFAULT_SUPPORT);
  const [works, setWorks] = useState(DEFAULT_WORKS);
  const [proc, setProc] = useState(DEFAULT_PROCESS);
  const [loc, setLoc] = useState(DEFAULT_LOCATION);
  const [ed, setEd] = useState(null); // { sec, itemId, data }
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    if (!data) return;
    const m = Object.fromEntries(data.map(r => [r.key, r.value]));
    if (m.hero) setHero(m.hero);
    if (m.intro) setIntro(m.intro);
    if (m.support?.items) setSupport(m.support.items);
    if (m.works?.items) setWorks(m.works.items);
    if (m.process?.items) setProc(m.process.items);
    if (m.location) setLoc(m.location);
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

  const saveArr = async (key, arr, itemId) => {
    const d = { ...ed.data };
    if (d.itemsText !== undefined) {
      d.items = d.itemsText.split("\n").filter(l => l.trim());
      delete d.itemsText;
    }
    if (d.blocksText !== undefined) {
      d.blocks = parseBlocks(d.blocksText);
      delete d.blocksText;
    }
    const newArr = itemId === "new"
      ? [...arr, { ...d, id: Date.now() }]
      : arr.map(it => it.id === itemId ? { ...d } : it);
    await saveKey(key, { items: newArr });
  };

  const delItem = async (key, arr, id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await saveKey(key, { items: arr.filter(it => it.id !== id) });
  };

  const SaveRow = ({ onSave }) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
      <button onClick={() => setEd(null)} style={ab()}>취소</button>
      <button onClick={onSave} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
    </div>
  );

  return (
    <div>
      {/* ── 히어로 배너 ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ position: "relative", background: "linear-gradient(135deg,#1e3a5f 0%,#2d5986 100%)", borderRadius: 16, padding: "52px 40px", color: "#fff", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          {adminUser && (
            <button onClick={() => openEd("hero", null, hero)}
              style={{ position: "absolute", top: 12, right: 12, ...ab(), background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
              <Pencil size={12} /> 편집
            </button>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {hero.badges.split(",").map(b => b.trim()).filter(Boolean).map((b, i) => (
              <span key={i} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 14px", borderRadius: 20, fontSize: 12 }}>{b}</span>
            ))}
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3, color: "#fff", textAlign: "left" }}>{hero.title}</h1>
          <p style={{ color: "#93c5fd", fontSize: 16, margin: "0 0 28px", textAlign: "left" }}>{hero.sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => nav(hero.btn1Page)} style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>{hero.btn1Label}</button>
            <button onClick={() => nav(hero.btn2Page)} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>{hero.btn2Label}</button>
          </div>
        </div>

        {isEd("hero") && (
          <div style={{ ...EP, marginTop: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <input placeholder="제목" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={{ ...IS, width: "100%" }} />
              <input placeholder="부제목" value={ed.data.sub || ""} onChange={e => patch({ sub: e.target.value })} style={{ ...IS, width: "100%" }} />
              <input placeholder="배지 (쉼표로 구분)" value={ed.data.badges || ""} onChange={e => patch({ badges: e.target.value })} style={{ ...IS, width: "100%" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                <input placeholder="버튼1 텍스트" value={ed.data.btn1Label || ""} onChange={e => patch({ btn1Label: e.target.value })} style={IS} />
                <select value={ed.data.btn1Page ?? 0} onChange={e => patch({ btn1Page: +e.target.value })} style={{ ...IS, width: "auto" }}>
                  {PAGES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                <input placeholder="버튼2 텍스트" value={ed.data.btn2Label || ""} onChange={e => patch({ btn2Label: e.target.value })} style={IS} />
                <select value={ed.data.btn2Page ?? 0} onChange={e => patch({ btn2Page: +e.target.value })} style={{ ...IS, width: "auto" }}>
                  {PAGES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <SaveRow onSave={() => saveKey("hero", ed.data)} />
          </div>
        )}
      </div>

      {/* ── 센터 소개 ── */}
      <div style={{ marginBottom: 40 }}>
        <SectionHeader title="센터 소개" action={adminUser && (
          <button onClick={() => openEd("intro", null, intro)} style={ab()}><Pencil size={12} /> 편집</button>
        )} />
        {isEd("intro") && (
          <div style={EP}>
            <textarea value={ed.data.text || ""} onChange={e => patch({ text: e.target.value })}
              style={{ ...IS, width: "100%", height: 120, resize: "vertical" }} />
            <SaveRow onSave={() => saveKey("intro", ed.data)} />
          </div>
        )}
        <p style={{ color: "#475569", lineHeight: 1.9, fontSize: 14, margin: 0, textAlign: "left" }}>{intro.text}</p>
      </div>

      {/* ── 지원구조 ── */}
      <div style={{ marginBottom: 48 }}>
        <SectionHeader title="지원구조" action={adminUser && (
          <button onClick={() => openEd("support", "new", { title: "", color: "#3b82f6", itemsText: "" })} style={ab()}>
            <Plus size={12} /> 항목 추가
          </button>
        )} />

        {isEd("support", "new") && (
          <div style={{ ...EP, marginBottom: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
                <input placeholder="제목 (예: 종합지원센터)" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={IS} />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>색상</span>
                  <input type="color" value={ed.data.color || "#3b82f6"} onChange={e => patch({ color: e.target.value })}
                    style={{ width: 36, height: 32, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>항목 내용 (줄당 하나)</div>
                <textarea placeholder={"항목1\n항목2\n항목3"} value={ed.data.itemsText || ""} onChange={e => patch({ itemsText: e.target.value })}
                  style={{ ...IS, width: "100%", height: 90, resize: "vertical" }} />
              </div>
            </div>
            <SaveRow onSave={() => saveArr("support", support, "new")} />
          </div>
        )}

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
          {support.map((s) => isEd("support", s.id) ? (
            <div key={s.id} style={EP}>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
                  <input placeholder="제목" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={IS} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>색상</span>
                    <input type="color" value={ed.data.color || "#3b82f6"} onChange={e => patch({ color: e.target.value })}
                      style={{ width: 36, height: 32, border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>항목 내용 (줄당 하나)</div>
                  <textarea value={ed.data.itemsText || ""} onChange={e => patch({ itemsText: e.target.value })}
                    style={{ ...IS, width: "100%", height: 90, resize: "vertical" }} />
                </div>
              </div>
              <SaveRow onSave={() => saveArr("support", support, s.id)} />
            </div>
          ) : (
            <div key={s.id} style={{ background: s.color, color: "#fff", padding: 24, borderRadius: 12, textAlign: "left", position: "relative" }}>
              {adminUser && (
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
                  <button onClick={() => openEd("support", s.id, { ...s, itemsText: (s.items || []).join("\n") })}
                    style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 5, padding: "3px 7px", cursor: "pointer", color: "#fff", display: "inline-flex", alignItems: "center" }}>
                    <Pencil size={11} />
                  </button>
                  <button onClick={() => delItem("support", support, s.id)}
                    style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 5, padding: "3px 7px", cursor: "pointer", color: "#fff", display: "inline-flex", alignItems: "center" }}>
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>{s.title}</div>
              {(s.items || []).map((item, j) => (
                <div key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 7, paddingLeft: 10, borderLeft: "2px solid rgba(255,255,255,0.25)", lineHeight: 1.5, textAlign: "left" }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── 주요 업무 ── */}
      <div style={{ marginBottom: 48 }}>
        <SectionHeader title="주요 업무" action={adminUser && (
          <button onClick={() => openEd("works", "new", { num: "", title: "", page: 1, pageLabel: "", blocksText: "" })} style={ab()}>
            <Plus size={12} /> 항목 추가
          </button>
        )} />

        {isEd("works", "new") && (
          <div style={{ ...EP, marginBottom: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 8 }}>
                <input placeholder="번호" value={ed.data.num || ""} onChange={e => patch({ num: e.target.value })} style={IS} />
                <input placeholder="제목" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={IS} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                <input placeholder="버튼 텍스트 (예: 보유 장비 목록 →)" value={ed.data.pageLabel || ""} onChange={e => patch({ pageLabel: e.target.value })} style={IS} />
                <select value={ed.data.page ?? 1} onChange={e => patch({ page: +e.target.value })} style={{ ...IS, width: "auto" }}>
                  {PAGES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>내용 (## 으로 시작하는 줄은 소제목, 나머지는 항목)</div>
                <textarea placeholder={"## 소제목\n항목 내용\n항목 내용\n## 다른 소제목\n항목 내용"} value={ed.data.blocksText || ""} onChange={e => patch({ blocksText: e.target.value })}
                  style={{ ...IS, width: "100%", height: 140, resize: "vertical" }} />
              </div>
            </div>
            <SaveRow onSave={() => saveArr("works", works, "new")} />
          </div>
        )}

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          {works.map((item) => isEd("works", item.id) ? (
            <div key={item.id} style={EP}>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 8 }}>
                  <input placeholder="번호" value={ed.data.num || ""} onChange={e => patch({ num: e.target.value })} style={IS} />
                  <input placeholder="제목" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={IS} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                  <input placeholder="버튼 텍스트" value={ed.data.pageLabel || ""} onChange={e => patch({ pageLabel: e.target.value })} style={IS} />
                  <select value={ed.data.page ?? 1} onChange={e => patch({ page: +e.target.value })} style={{ ...IS, width: "auto" }}>
                    {PAGES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>내용 (## 소제목 / 나머지 항목)</div>
                  <textarea value={ed.data.blocksText || ""} onChange={e => patch({ blocksText: e.target.value })}
                    style={{ ...IS, width: "100%", height: 140, resize: "vertical" }} />
                </div>
              </div>
              <SaveRow onSave={() => saveArr("works", works, item.id)} />
            </div>
          ) : (
            <div key={item.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, display: "flex", flexDirection: "column", textAlign: "left", position: "relative" }}>
              {adminUser && (
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
                  <button onClick={() => openEd("works", item.id, { ...item, blocksText: serializeBlocks(item.blocks) })}
                    style={ab()}><Pencil size={11} /></button>
                  <button onClick={() => delItem("works", works, item.id)}
                    style={ab("danger")}><Trash2 size={11} /></button>
                </div>
              )}
              <div style={{ fontSize: 28, fontWeight: 700, color: "#dbeafe", marginBottom: 8 }}>{item.num}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 12, lineHeight: 1.5 }}>{item.title}</h3>
              <div style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16, flex: 1 }}>
                {(item.blocks || []).map((b, bi) => {
                  const isSec = b.type === "section";
                  return (
                    <div key={bi} style={{ display: "flex", alignItems: "flex-start", paddingLeft: 10, borderLeft: isSec ? "3px solid #dbeafe" : "3px solid transparent", marginTop: isSec ? 10 : 2, fontWeight: isSec ? 600 : 400, color: isSec ? "#1e3a5f" : "#475569", lineHeight: 1.8 }}>
                      {!isSec && <span style={{ flexShrink: 0, marginRight: 4, color: "#94a3b8" }}>·</span>}
                      <span>{b.text}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => nav(item.page)} style={{ background: "none", border: "1px solid #3b82f6", color: "#3b82f6", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>{item.pageLabel}</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── 시험평가지원 프로세스 ── */}
      <div style={{ marginBottom: 40 }}>
        <SectionHeader title="시험평가지원 프로세스" action={adminUser && (
          <button onClick={() => openEd("process", "new", { step: "", title: "", desc: "" })} style={ab()}>
            <Plus size={12} /> 단계 추가
          </button>
        )} />

        {isEd("process", "new") && (
          <div style={{ ...EP, marginBottom: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 8 }}>
                <input placeholder="단계 (01)" value={ed.data.step || ""} onChange={e => patch({ step: e.target.value })} style={IS} />
                <input placeholder="단계명 (예: 시험 의뢰 문의)" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={IS} />
              </div>
              <textarea placeholder={"설명 텍스트\n두 번째 줄"} value={ed.data.desc || ""} onChange={e => patch({ desc: e.target.value })}
                style={{ ...IS, width: "100%", height: 80, resize: "vertical" }} />
            </div>
            <SaveRow onSave={() => saveArr("process", proc, "new")} />
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            {proc.map((s, i) => isEd("process", s.id) ? (
              <div key={s.id} style={{ flex: 1, padding: "4px 6px" }}>
                <div style={{ ...EP, margin: 0 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}>
                      <input placeholder="단계" value={ed.data.step || ""} onChange={e => patch({ step: e.target.value })} style={IS} />
                      <input placeholder="단계명" value={ed.data.title || ""} onChange={e => patch({ title: e.target.value })} style={IS} />
                    </div>
                    <textarea value={ed.data.desc || ""} onChange={e => patch({ desc: e.target.value })}
                      style={{ ...IS, width: "100%", height: 70, resize: "vertical" }} />
                  </div>
                  <SaveRow onSave={() => saveArr("process", proc, s.id)} />
                </div>
              </div>
            ) : (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ flex: 1, padding: "4px 6px", position: "relative" }} className="process-center">
                  {adminUser && (
                    <div style={{ position: "absolute", top: 0, right: 2, display: "flex", gap: 2 }}>
                      <button onClick={() => openEd("process", s.id, { ...s })} style={{ ...ab(), padding: "2px 5px" }}><Pencil size={10} /></button>
                      <button onClick={() => delItem("process", proc, s.id)} style={{ ...ab("danger"), padding: "2px 5px" }}><Trash2 size={10} /></button>
                    </div>
                  )}
                  <div style={{ background: "#1e3a5f", color: "#fff", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, margin: "0 auto 10px" }}>{s.step}</div>
                  <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, lineHeight: 1.5, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", whiteSpace: "pre-line", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                {i < proc.length - 1 && <ChevronRight size={13} color="#94a3b8" style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 오시는 길 ── */}
      <div>
        <SectionHeader title="오시는 길" action={adminUser && (
          <button onClick={() => openEd("location", null, loc)} style={ab()}><Pencil size={12} /> 편집</button>
        )} />

        {isEd("location") && (
          <div style={EP}>
            <div style={{ display: "grid", gap: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>주소</div>
                <textarea value={ed.data.address || ""} onChange={e => patch({ address: e.target.value })}
                  style={{ ...IS, width: "100%", height: 60, resize: "vertical" }} />
              </div>
              <input placeholder="이메일" value={ed.data.email || ""} onChange={e => patch({ email: e.target.value })} style={{ ...IS, width: "100%" }} />
              <input placeholder="웹사이트" value={ed.data.website || ""} onChange={e => patch({ website: e.target.value })} style={{ ...IS, width: "100%" }} />
              <input placeholder="지도 링크 URL" value={ed.data.mapLink || ""} onChange={e => patch({ mapLink: e.target.value })} style={{ ...IS, width: "100%" }} />
            </div>
            <SaveRow onSave={() => saveKey("location", ed.data)} />
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            <div style={{ width: "100%", height: 280, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative" }}>
              <iframe
                src="https://maps.google.com/maps?q=경기도+부천시+원미구+평천로+655&output=embed&hl=ko&z=17"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="오시는 길"
              />
              <a href={loc.mapLink || "#"} target="_blank" rel="noopener noreferrer"
                style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "block", background: "rgba(66,133,244,0.9)", color: "#fff", padding: "8px 0", textAlign: "center", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                Google Maps에서 보기
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "18px max-content 1fr", columnGap: 10, rowGap: 22, alignItems: "start", textAlign: "left", paddingLeft: 16 }}>
              {[
                [<MapPin size={15} key="pin" />, "주소", loc.address],
                [<Mail size={15} key="mail" />, "이메일", loc.email],
                [<Globe size={15} key="globe" />, "웹사이트", loc.website],
              ].flatMap(([icon, label, val], i) => [
                <span key={`icon-${i}`} style={{ color: "#3b82f6", lineHeight: "20px", display: "flex", alignItems: "center" }}>{icon}</span>,
                <span key={`label-${i}`} style={{ fontSize: 12, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap", lineHeight: "20px" }}>{label}</span>,
                <span key={`val-${i}`} style={{ fontSize: 13, color: "#334155", whiteSpace: "pre-line", lineHeight: "20px" }}>{val}</span>,
              ])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
