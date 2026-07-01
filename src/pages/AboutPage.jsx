import { ChevronRight, Building2, Settings, ShieldCheck } from "lucide-react";
import { DEFAULT_SUPPORT, DEFAULT_WORKS, DEFAULT_PROCESS, DEFAULT_LOCATION } from "../data/defaults";
import useIsMobile from "../hooks/useIsMobile";
import useIsSmall from "../hooks/useIsSmall";

const SUPPORT_ICONS = [Building2, Settings, ShieldCheck];

export default function AboutPage({ nav }) {
  const isMobile = useIsMobile();
  const isSmall = useIsSmall();
  const support = DEFAULT_SUPPORT;
  const works = DEFAULT_WORKS;
  const proc = DEFAULT_PROCESS;
  const loc = DEFAULT_LOCATION;

  return (
    <div>
      {/* 지원구조 */}
      <div style={{ marginBottom: 100 }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "180px 1fr", gap: isMobile ? 24 : 56, alignItems: "start" }}>

          <div style={{ paddingTop: 6 }}>
            <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>지원구조</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isSmall ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 24 : 32 }}>
            {support.map((s, i) => (
              <div key={s.id}>
                <div style={{ marginBottom: 14, color: "#3b82f6" }}>
                  {(() => { const Icon = SUPPORT_ICONS[i % SUPPORT_ICONS.length]; return <Icon size={28} strokeWidth={1.5} />; })()}
                </div>
                <div style={{ height: 1, background: "#e2e8f0", marginBottom: 20 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 14 }}>{s.title}</div>
                {(s.items || []).map((item, j) => (
                  <div key={j} style={{ fontSize: 13, color: "#475569", marginBottom: 8, lineHeight: 1.7, display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <span style={{ color: s.color, flexShrink: 0, marginTop: 1 }}>·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 주요업무 */}
      <div style={{ marginBottom: 100 }}>
        <div style={{ marginBottom: 42 }}>
          <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>주요업무</div>
        </div>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          {works.map((item) => (
            <div key={item.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 30, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "'Giants Regular', sans-serif", fontSize: 15, fontWeight: 400, color: "#1e3a5f", lineHeight: 1, marginBottom: 14 }}>{item.num}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 14, lineHeight: 1.5 }}>{item.title}</h3>
              <div style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 16, flex: 1 }}>
                {(item.blocks || []).map((b, bi) => {
                  const isSec = b.type === "section";
                  return (
                    <div key={bi} style={{ display: "flex", alignItems: "flex-start", paddingLeft: 10, borderLeft: isSec ? "3px solid #3b82f6" : "3px solid transparent", marginTop: isSec ? 14 : 0, marginBottom: isSec ? 14 : 8, fontWeight: isSec ? 600 : 400, color: isSec ? "#1e3a5f" : "#475569", lineHeight: 1.7 }}>
                      {!isSec && <span style={{ flexShrink: 0, marginRight: 4, color: "#94a3b8" }}>·</span>}
                      <span>{b.text.split("\n").map((line, li) => <span key={li} style={{ display: "block", marginTop: li > 0 ? 8 : 0 }}>{line}</span>)}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => nav(item.page)} style={{ background: "none", border: "1px solid #3b82f6", color: "#3b82f6", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600 }}>{item.pageLabel}</button>
            </div>
          ))}
        </div>
      </div>

      {/* 프로세스 */}
      <div style={{ marginBottom: 100 }}>
        <div style={{ marginBottom: 42 }}>
          <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>시험평가지원 프로세스</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row", flexWrap: isMobile ? undefined : "wrap", gap: isMobile ? 16 : 0 }}>
          {proc.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: "1 1 140px" }}>
              <div style={{ flex: 1, padding: "4px 6px", textAlign: isMobile ? "left" : "center" }}>
                <div style={{ fontFamily: "'Giants Regular', sans-serif", fontSize: 15, color: "#3b82f6", lineHeight: 1, marginBottom: 14 }}>STEP {+s.step}</div>
                <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, lineHeight: 1.7, marginBottom: 14 }}>{s.title}</div>
                <div>{s.desc.split("\n").filter(l => l.trim()).map((line, li) => (
                  <div key={li} style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>{line}</div>
                ))}</div>
              </div>
              {!isMobile && i < proc.length - 1 && <ChevronRight size={13} color="#94a3b8" style={{ flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* 오시는 길 */}
      <div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1px 0.8fr", gap: isMobile ? 40 : "0 48px", alignItems: "start" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "180px 1fr", gap: isMobile ? 16 : 56, alignItems: "start" }}>
            <div>
              <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1 }}>오시는 길</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", minHeight: isMobile ? "auto" : 220 }}>
            <div>
              <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, lineHeight: 1, marginBottom: 14 }}>주소</div>
              {(loc.address ? loc.address.split("\n") : []).filter(l => l.trim()).map((line, i) => (
                <div key={i} style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>{line}</div>
              ))}
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>한국전자기술연구원 로봇융합부품지원센터</div>
              <div style={{ fontSize: 15, color: "#1e3a5f", fontWeight: 700, lineHeight: 1, marginTop: 22, marginBottom: 14 }}>이메일</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 8 }}>{loc.email || "helprobot@keti.re.kr"}</div>
            </div>
            </div>
          </div>
          {!isMobile && <div style={{ background: "#e2e8f0", alignSelf: "stretch" }} />}
          <div style={{ width: "100%", height: 220, borderRadius: 8, overflow: "hidden", position: "relative" }}>
            <iframe
              src="https://maps.google.com/maps?q=경기도+부천시+원미구+평천로+655&output=embed&hl=ko&z=17"
              width="100%" height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="오시는 길"
            />
            <a href={loc.mapLink || "#"} target="_blank" rel="noopener noreferrer"
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "block", background: "rgba(66,133,244,0.9)", color: "#fff", padding: "8px 0", textAlign: "center", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Google Maps에서 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
