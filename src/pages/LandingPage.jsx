import { useState, useEffect } from "react";
import { PAGES } from "../data/pages";

const SUBTITLE = "국내 로봇산업 경쟁력 강화를 위한 원스톱 지원체계 구축";
const LINE = "1px solid rgba(255,255,255,0.75)";
const HERO_IMG_LEFT = "14%";


export default function LandingPage({ nav }) {
  const [typed, setTyped] = useState("");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const timer = setInterval(() => {
        i++;
        setTyped(SUBTITLE.slice(0, i));
        if (i >= SUBTITLE.length) clearInterval(timer);
      }, 90);
      return () => clearInterval(timer);
    }, 600);
    return () => clearTimeout(delay);
  }, []);

  return (
    <div style={{
      height: "100vh",
      background: "#060d1a",
      backgroundImage:
        "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px)," +
        "linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
      backgroundSize: "52px 52px",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* 히어로 */}
      <div style={{ flex: 1, display: "flex", position: "relative" }}>
        <img
          src="/images/hero-bg.png?v=2"
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: HERO_IMG_LEFT,
            width: `${100 - parseInt(HERO_IMG_LEFT)}%`,
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
            display: "block",
          }}
        />
        <div style={{
          position: "absolute",
          top: 0,
          left: HERO_IMG_LEFT,
          width: `${100 - parseInt(HERO_IMG_LEFT)}%`,
          height: "100%",
          background: "linear-gradient(to right, rgba(6,13,26,1) 0%, rgba(6,13,26,0.55) 16%, rgba(6,13,26,0) 38%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", position: "relative", zIndex: 2 }}>

          <h1 style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: "clamp(44px, 6vw, 82px)",
            fontWeight: 400,
            color: "#fff",
            margin: "0 0 28px",
            lineHeight: 1.15,
          }}>
            로봇융합부품지원센터<br />
            <span style={{ color: "#3b82f6" }}>RTAC</span>
          </h1>

          <p style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: 15,
            color: "#e2e8f0",
            margin: 0,
            lineHeight: 2,
            minHeight: "2em",
          }}>
            {typed}
            <span style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: "#3b82f6",
              marginLeft: 2,
              verticalAlign: "middle",
              opacity: typed.length < SUBTITLE.length ? 1 : 0,
            }} />
          </p>
        </div>

      </div>

      {/* 하단 메뉴 바 */}
      <div style={{ borderTop: LINE, display: "flex", flexShrink: 0 }}>
        {PAGES.map((page, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => nav(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onKeyDown={e => e.key === "Enter" && nav(i)}
            style={{
              flex: 1,
              padding: "20px 16px",
              background: hovered === i ? "rgba(255,255,255,0.12)" : "transparent",
              borderRight: i < PAGES.length - 1 ? LINE : "none",
              cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 15,
              color: "#fff",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
              userSelect: "none",
            }}>
            0{i + 1}.{page.label}
          </div>
        ))}
      </div>
    </div>
  );
}
