import { useState } from "react";
import { ChevronRight, MapPin, Mail, Globe, Edit2, Plus, Trash2, Save, XCircle } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import {
  DEFAULT_HERO, DEFAULT_INTRO, DEFAULT_SUPPORT, DEFAULT_WORKS,
  DEFAULT_PROCESS, SUPPORT_COLORS,
} from "../data/defaults";
import { PAGES } from "../data/pages";
import { inp, ta, btn } from "../components/styles";
import SectionHeader from "../components/SectionHeader";
import EditSection from "../components/EditSection";
import AdminBadge from "../components/AdminBadge";
import LoginBox from "../components/LoginBox";
import DataExport from "../components/DataExport";

// ── 에디터 컴포넌트들 ────────────────────────────────────────────

function HeroEditor({ hero, onSave, onCancel }) {
  const [f, setF] = useState({ ...hero });
  return (
    <EditSection title="히어로 배너 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>제목</label><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>부제</label><input value={f.sub} onChange={(e) => setF({ ...f, sub: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>뱃지 (쉼표로 구분)</label><input value={f.badges} onChange={(e) => setF({ ...f, badges: e.target.value })} style={inp()} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>버튼1 텍스트</label><input value={f.btn1Label} onChange={(e) => setF({ ...f, btn1Label: e.target.value })} style={inp()} /></div>
          <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>버튼2 텍스트</label><input value={f.btn2Label} onChange={(e) => setF({ ...f, btn2Label: e.target.value })} style={inp()} /></div>
        </div>
      </div>
    </EditSection>
  );
}

function IntroEditor({ intro, onSave, onCancel }) {
  const [f, setF] = useState({ ...intro });
  return (
    <EditSection title="센터 소개 본문 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <textarea value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} style={ta(4)} />
    </EditSection>
  );
}

function SupportEditor({ support, onSave, onCancel }) {
  const [items, setItems] = useState(support.map((s) => ({ ...s, items: [...s.items] })));
  const update = (i, field, val) => { const a = [...items]; a[i] = { ...a[i], [field]: val }; setItems(a); };
  const updateItem = (si, ii, val) => { const a = [...items]; a[si].items[ii] = val; setItems(a); };
  const addItem = (si) => { const a = [...items]; a[si].items.push(""); setItems(a); };
  const removeItem = (si, ii) => { const a = [...items]; a[si].items = a[si].items.filter((_, x) => x !== ii); setItems(a); };
  const addCard = () => setItems([...items, { id: Date.now(), title: "새 카드", color: SUPPORT_COLORS[items.length % SUPPORT_COLORS.length], items: [""] }]);
  const removeCard = (i) => setItems(items.filter((_, x) => x !== i));
  return (
    <EditSection title="지원구조 수정" onSave={() => onSave(items)} onCancel={onCancel}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((s, i) => (
          <div key={s.id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, marginBottom: 10, alignItems: "center" }}>
              <input value={s.title} onChange={(e) => update(i, "title", e.target.value)} style={inp()} />
              <div style={{ display: "flex", gap: 4 }}>
                {SUPPORT_COLORS.map((c) => (
                  <div key={c} onClick={() => update(i, "color", c)} style={{ width: 18, height: 18, borderRadius: "50%", background: c, cursor: "pointer", border: s.color === c ? "2px solid #1e293b" : "2px solid transparent" }} />
                ))}
              </div>
              <button onClick={() => removeCard(i)} style={{ ...btn("#fee2e2", "#991b1b"), padding: "6px 8px" }}><Trash2 size={12} /></button>
            </div>
            {s.items.map((item, ii) => (
              <div key={ii} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input value={item} onChange={(e) => updateItem(i, ii, e.target.value)} style={{ ...inp(), flex: 1 }} />
                <button onClick={() => removeItem(i, ii)} style={{ ...btn("#fee2e2", "#991b1b"), padding: "6px 8px" }}><Trash2 size={12} /></button>
              </div>
            ))}
            <button onClick={() => addItem(i)} style={{ ...btn("#f1f5f9", "#475569"), fontSize: 12, marginTop: 4 }}><Plus size={12} />항목 추가</button>
          </div>
        ))}
        <button onClick={addCard} style={btn()}><Plus size={13} />카드 추가</button>
      </div>
    </EditSection>
  );
}

function WorksEditor({ works, onSave, onCancel }) {
  const [items, setItems] = useState(works.map((w) => ({ ...w, blocks: w.blocks.map((b) => ({ ...b })) })));
  const updateField = (i, f, v) => { const a = [...items]; a[i] = { ...a[i], [f]: v }; setItems(a); };
  const updateBlock = (wi, bi, f, v) => { const a = [...items]; a[wi].blocks[bi] = { ...a[wi].blocks[bi], [f]: v }; setItems(a); };
  const addBlock = (wi, type) => { const a = [...items]; a[wi].blocks.push({ type, text: "" }); setItems(a); };
  const removeBlock = (wi, bi) => { const a = [...items]; a[wi].blocks = a[wi].blocks.filter((_, x) => x !== bi); setItems(a); };
  const addWork = () => setItems([...items, { id: Date.now(), num: String(items.length + 1).padStart(2, "0"), title: "새 업무", page: 0, pageLabel: "바로가기 →", blocks: [] }]);
  const removeWork = (i) => setItems(items.filter((_, x) => x !== i));
  return (
    <EditSection title="주요 업무 수정" onSave={() => onSave(items)} onCancel={onCancel}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((w, i) => (
          <div key={w.id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 8, marginBottom: 10, alignItems: "center" }}>
              <input value={w.num} onChange={(e) => updateField(i, "num", e.target.value)} style={inp()} />
              <input value={w.title} onChange={(e) => updateField(i, "title", e.target.value)} style={inp()} />
              <button onClick={() => removeWork(i)} style={{ ...btn("#fee2e2", "#991b1b"), padding: "6px 8px" }}><Trash2 size={12} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div><label style={{ fontSize: 11, color: "#94a3b8" }}>버튼 텍스트</label><input value={w.pageLabel} onChange={(e) => updateField(i, "pageLabel", e.target.value)} style={inp()} /></div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8" }}>연결 페이지</label>
                <select value={w.page} onChange={(e) => updateField(i, "page", Number(e.target.value))} style={inp()}>
                  {PAGES.map((p, pi) => <option key={pi} value={pi}>{p.label}</option>)}
                </select>
              </div>
            </div>
            {w.blocks.map((b, bi) => (
              <div key={bi} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, background: b.type === "section" ? "#dbeafe" : "#f1f5f9", color: b.type === "section" ? "#1d4ed8" : "#64748b", padding: "2px 8px", borderRadius: 4, flexShrink: 0, minWidth: 36, textAlign: "center" }}>{b.type === "section" ? "소제목" : "항목"}</span>
                <input value={b.text} onChange={(e) => updateBlock(i, bi, "text", e.target.value)} style={{ ...inp(), flex: 1 }} />
                <button onClick={() => removeBlock(i, bi)} style={{ ...btn("#fee2e2", "#991b1b"), padding: "5px 7px" }}><Trash2 size={11} /></button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <button onClick={() => addBlock(i, "section")} style={{ ...btn("#dbeafe", "#1d4ed8"), fontSize: 11, padding: "5px 10px" }}><Plus size={11} />소제목</button>
              <button onClick={() => addBlock(i, "bullet")} style={{ ...btn("#f1f5f9", "#475569"), fontSize: 11, padding: "5px 10px" }}><Plus size={11} />항목</button>
            </div>
          </div>
        ))}
        <button onClick={addWork} style={btn()}><Plus size={13} />업무 추가</button>
      </div>
    </EditSection>
  );
}

function ProcessEditor({ process, onSave, onCancel }) {
  const [items, setItems] = useState(process.map((p) => ({ ...p })));
  const update = (i, f, v) => { const a = [...items]; a[i] = { ...a[i], [f]: v }; setItems(a); };
  const add = () => setItems([...items, { id: Date.now(), step: String(items.length + 1).padStart(2, "0"), title: "새 단계", desc: "" }]);
  const remove = (i) => setItems(items.filter((_, x) => x !== i));
  return (
    <EditSection title="프로세스 수정" onSave={() => onSave(items)} onCancel={onCancel}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((s, i) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr auto", gap: 8, alignItems: "start", background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: 10 }}>
            <input value={s.step} onChange={(e) => update(i, "step", e.target.value)} style={inp()} />
            <input value={s.title} onChange={(e) => update(i, "title", e.target.value)} style={inp()} />
            <textarea value={s.desc} onChange={(e) => update(i, "desc", e.target.value)} style={ta(2)} />
            <button onClick={() => remove(i)} style={{ ...btn("#fee2e2", "#991b1b"), padding: "8px 10px" }}><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={add} style={btn()}><Plus size={13} />단계 추가</button>
      </div>
    </EditSection>
  );
}

function LocationEditor({ location, onSave, onCancel }) {
  const [f, setF] = useState({ ...location });
  return (
    <EditSection title="오시는 길 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>주소</label><textarea value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} style={ta(2)} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>이메일</label><input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>웹사이트</label><input value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>카카오맵 embed URL</label><input value={f.mapSrc} onChange={(e) => setF({ ...f, mapSrc: e.target.value })} style={inp()} /></div>
      </div>
    </EditSection>
  );
}

function SiteEditFull({ site, onSave, onCancel }) {
  const [f, setF] = useState({ ...site });
  return (
    <div style={{ background: "#fffbeb", borderRadius: 10, border: "1px solid #fcd34d", padding: 20, marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 14 }}>헤더·푸터 센터명 수정</div>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>센터명 (한글)</label><input value={f.centerName} onChange={(e) => setF({ ...f, centerName: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>센터명 (영문)</label><input value={f.centerNameEn} onChange={(e) => setF({ ...f, centerNameEn: e.target.value })} style={inp()} /></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button onClick={() => onSave(f)} style={btn()}><Save size={13} />저장</button>
        <button onClick={onCancel} style={btn("#f1f5f9", "#475569")}><XCircle size={13} />취소</button>
      </div>
    </div>
  );
}

// ── AboutPage ────────────────────────────────────────────────────

export default function AboutPage({ nav, adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, site, setSite, location, setLocation }) {
  const [editing, setEditing] = useState(null);
  const [hero, setHero] = useStorage("rtac_hero", DEFAULT_HERO);
  const [intro, setIntro] = useStorage("rtac_intro", DEFAULT_INTRO);
  const [support, setSupport] = useStorage("rtac_support", DEFAULT_SUPPORT);
  const [works, setWorks] = useStorage("rtac_works", DEFAULT_WORKS);
  const [process, setProcess] = useStorage("rtac_process", DEFAULT_PROCESS);

  return (
    <div>
      <LoginBox showLogin={showLogin} adminMode={adminMode} adminPw={adminPw} onAdminPwChange={onAdminPwChange} onLogin={onLogin} onClose={onLoginClose} />
      {adminMode && <AdminBadge onLogout={onLogout} />}
      {adminMode && <DataExport />}

      {/* 헤더·푸터 센터명 수정 */}
      {adminMode && (
        <div style={{ marginBottom: 16 }}>
          {editing === "site"
            ? <SiteEditFull site={site} onSave={(v) => { setSite(v); setEditing(null); }} onCancel={() => setEditing(null)} />
            : <button onClick={() => setEditing("site")} style={{ ...btn("#f8fafc", "#475569"), border: "1px solid #e2e8f0", fontSize: 12 }}><Edit2 size={12} />헤더·푸터 센터명 수정</button>
          }
        </div>
      )}

      {/* 히어로 배너 */}
      {editing === "hero" && adminMode
        ? <HeroEditor hero={hero} onSave={(v) => { setHero(v); setEditing(null); }} onCancel={() => setEditing(null)} />
        : (
          <div style={{ position: "relative", marginBottom: 40 }}>
            {adminMode && (
              <button onClick={() => setEditing("hero")} style={{ ...btn("#1e3a5f80", "#fff"), position: "absolute", top: 16, right: 16, zIndex: 2, fontSize: 12, border: "1px solid rgba(255,255,255,0.3)" }}>
                <Edit2 size={12} />히어로 수정
              </button>
            )}
            <div style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#2d5986 100%)", borderRadius: 16, padding: "52px 40px", color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -40, top: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                {hero.badges.split(",").map((b) => b.trim()).filter(Boolean).map((b, i) => (
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
          </div>
        )
      }

      {/* 센터 소개 */}
      {editing === "intro" && adminMode
        ? <IntroEditor intro={intro} onSave={(v) => { setIntro(v); setEditing(null); }} onCancel={() => setEditing(null)} />
        : (
          <div style={{ marginBottom: 40 }}>
            <SectionHeader title="센터 소개" adminMode={adminMode} onEdit={() => setEditing("intro")} />
            <p style={{ color: "#475569", lineHeight: 1.9, fontSize: 14, margin: 0, textAlign: "left" }}>{intro.text}</p>
          </div>
        )
      }

      {/* 지원구조 */}
      {editing === "support" && adminMode
        ? <SupportEditor support={support} onSave={(v) => { setSupport(v); setEditing(null); }} onCancel={() => setEditing(null)} />
        : (
          <div style={{ marginBottom: 48 }}>
            <SectionHeader title="지원구조" adminMode={adminMode} onEdit={() => setEditing("support")} />
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
              {support.map((s, i) => (
                <div key={s.id || i} style={{ background: s.color, color: "#fff", padding: 24, borderRadius: 12, textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>{s.title}</div>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 7, paddingLeft: 10, borderLeft: "2px solid rgba(255,255,255,0.25)", lineHeight: 1.5, textAlign: "left" }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* 주요 업무 */}
      {editing === "works" && adminMode
        ? <WorksEditor works={works} onSave={(v) => { setWorks(v); setEditing(null); }} onCancel={() => setEditing(null)} />
        : (
          <div style={{ marginBottom: 48 }}>
            <SectionHeader title="주요 업무" adminMode={adminMode} onEdit={() => setEditing("works")} />
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
              {works.map((item, i) => (
                <div key={item.id || i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#dbeafe", marginBottom: 8 }}>{item.num}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 12, lineHeight: 1.5 }}>{item.title}</h3>
                  <div style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16, flex: 1 }}>
                    {item.blocks.map((b, bi) => {
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
        )
      }

      {/* 시험평가지원 프로세스 */}
      {editing === "process" && adminMode
        ? <ProcessEditor process={process} onSave={(v) => { setProcess(v); setEditing(null); }} onCancel={() => setEditing(null)} />
        : (
          <div style={{ marginBottom: 40 }}>
            <SectionHeader title="시험평가지원 프로세스" adminMode={adminMode} onEdit={() => setEditing("process")} />
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "28px 24px" }}>
              <div style={{ display: "flex", alignItems: "stretch" }}>
                {process.map((s, i) => (
                  <div key={s.id || i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ flex: 1, padding: "4px 6px" }} className="process-center">
                      <div style={{ background: "#1e3a5f", color: "#fff", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, margin: "0 auto 10px" }}>{s.step}</div>
                      <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, lineHeight: 1.5, marginBottom: 8 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: "#64748b", whiteSpace: "pre-line", lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                    {i < process.length - 1 && <ChevronRight size={13} color="#94a3b8" style={{ flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      {/* 오시는 길 */}
      {editing === "location" && adminMode
        ? <LocationEditor location={location} onSave={(v) => { setLocation(v); setEditing(null); }} onCancel={() => setEditing(null)} />
        : (
          <div>
            <SectionHeader title="오시는 길" adminMode={adminMode} onEdit={() => setEditing("location")} />
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
                <iframe src={location.mapSrc} style={{ width: "100%", height: 200, borderRadius: 8, border: "none" }} allowFullScreen />
                <div style={{ display: "grid", gridTemplateColumns: "18px max-content 1fr", columnGap: 10, rowGap: 22, alignItems: "start", textAlign: "left", paddingLeft: 16 }}>
                  {[[<MapPin size={15} key="pin" />, "주소", location.address], [<Mail size={15} key="mail" />, "이메일", location.email], [<Globe size={15} key="globe" />, "웹사이트", location.website]].flatMap(([icon, label, val], i) => [
                    <span key={`icon-${i}`} style={{ color: "#3b82f6", lineHeight: "20px", display: "flex", alignItems: "center" }}>{icon}</span>,
                    <span key={`label-${i}`} style={{ fontSize: 12, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap", lineHeight: "20px" }}>{label}</span>,
                    <span key={`val-${i}`} style={{ fontSize: 13, color: "#334155", whiteSpace: "pre-line", lineHeight: "20px" }}>{val}</span>,
                  ])}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
