import { ChevronRight, MapPin, Mail, Globe } from "lucide-react";
import {
  DEFAULT_HERO, DEFAULT_INTRO, DEFAULT_SUPPORT, DEFAULT_WORKS,
  DEFAULT_PROCESS,
} from "../data/defaults";
import SectionHeader from "../components/SectionHeader";

export default function AboutPage({ nav, site, location }) {
  const hero = DEFAULT_HERO;
  const intro = DEFAULT_INTRO;
  const support = DEFAULT_SUPPORT;
  const works = DEFAULT_WORKS;
  const process = DEFAULT_PROCESS;

  return (
    <div>
      {/* 히어로 배너 */}
      <div style={{ position: "relative", marginBottom: 40 }}>
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

      {/* 센터 소개 */}
      <div style={{ marginBottom: 40 }}>
        <SectionHeader title="센터 소개" />
        <p style={{ color: "#475569", lineHeight: 1.9, fontSize: 14, margin: 0, textAlign: "left" }}>{intro.text}</p>
      </div>

      {/* 지원구조 */}
      <div style={{ marginBottom: 48 }}>
        <SectionHeader title="지원구조" />
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

      {/* 주요 업무 */}
      <div style={{ marginBottom: 48 }}>
        <SectionHeader title="주요 업무" />
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

      {/* 시험평가지원 프로세스 */}
      <div style={{ marginBottom: 40 }}>
        <SectionHeader title="시험평가지원 프로세스" />
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

      {/* 오시는 길 */}
      <div>
        <SectionHeader title="오시는 길" />
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            <div style={{ width: "100%", height: 220, borderRadius: 8, background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, flexShrink: 0 }}>
              <MapPin size={32} color="#94a3b8" />
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>아래 버튼을 눌러 지도를 확인하세요.</p>
              <a href={location.mapLink} target="_blank" rel="noopener noreferrer" style={{ background: "#FEE500", color: "#191919", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>카카오맵에서 보기</a>
            </div>
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
    </div>
  );
}
