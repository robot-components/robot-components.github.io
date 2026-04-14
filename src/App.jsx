import { useState, useRef } from "react";
import { PAGES } from "./data/pages";
import { DEFAULT_SITE, DEFAULT_LOCATION } from "./data/defaults";
import PageWrapper from "./components/PageWrapper";
import AboutPage from "./pages/AboutPage";
import KolasPage from "./pages/KolasPage";
import EquipmentPage from "./pages/EquipmentPage";
import ReservationPage from "./pages/ReservationPage";
import NoticePage from "./pages/NoticePage";
import FaqPage from "./pages/FaqPage";

export default function App() {
  const [pageIdx, setPageIdx] = useState(0);
  const topRef = useRef(null);

  const nav = (i) => {
    setPageIdx(i);
    document.title = `${PAGES[i].label} | ${DEFAULT_SITE.centerName}`;
    try { window.history.pushState({}, "", `/${PAGES[i].slug}`); } catch {}
    topRef.current?.scrollIntoView({ behavior: "instant" });
  };

  return (
    <div ref={topRef} style={{ fontFamily: "'Noto Sans KR', sans-serif", minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <header style={{ background: "#1e3a5f", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 1126, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, gap: 16 }}>
          <div onClick={() => nav(0)} style={{ cursor: "pointer", flexShrink: 0 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "left" }}>{DEFAULT_SITE.centerName}</div>
            <div style={{ color: "#93c5fd", fontSize: 11, textAlign: "left" }}>{DEFAULT_SITE.centerNameEn}</div>
          </div>
          <nav style={{ display: "flex", gap: 2 }}>
            {PAGES.map((p, i) => (
              <button
                key={i}
                onClick={() => nav(i)}
                style={{ background: pageIdx === i ? "rgba(255,255,255,0.12)" : "transparent", color: pageIdx === i ? "#fff" : "#94a3b8", border: "none", padding: "8px 11px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit", borderBottom: pageIdx === i ? "2px solid #60a5fa" : "2px solid transparent", whiteSpace: "nowrap" }}
              >
                {p.label}
              </button>
            ))}
          </nav>
          <div style={{ flexShrink: 0, width: 40 }} />
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ flex: 1, width: "100%" }}>
        <div id="content-wrapper" style={{ maxWidth: 1126, margin: "0 auto", boxSizing: "border-box", padding: "40px 32px 80px" }}>
        <PageWrapper pageKey={pageIdx}>
          {pageIdx === 0 && (
            <AboutPage
              nav={nav}
              site={DEFAULT_SITE}
              location={DEFAULT_LOCATION}
            />
          )}
          {pageIdx === 1 && (
            <KolasPage
              location={DEFAULT_LOCATION}
            />
          )}
          {pageIdx === 2 && (
            <EquipmentPage
              location={DEFAULT_LOCATION}
            />
          )}
          {pageIdx === 3 && (
            <ReservationPage />
          )}
          {pageIdx === 4 && (
            <NoticePage />
          )}
          {pageIdx === 5 && (
            <FaqPage
              location={DEFAULT_LOCATION}
            />
          )}
        </PageWrapper>
        </div>
      </main>

      {/* 푸터 */}
      <footer style={{ background: "#1e3a5f", padding: "32px 0" }}>
        <div style={{ maxWidth: 1126, margin: "0 auto", width: "100%", boxSizing: "border-box", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{DEFAULT_SITE.centerName} (RTAC)</div>
            <div style={{ fontSize: 12, lineHeight: 2, color: "#93c5fd" }}>
              {DEFAULT_LOCATION.address.replace("\n", " ")}<br />
              {DEFAULT_LOCATION.email} · {DEFAULT_LOCATION.website}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#60a5fa", alignSelf: "flex-end" }}>Korea Electronics Technology Institute (KETI)</div>
        </div>
      </footer>

      <style>{`
        body { margin: 0; }
        * { box-sizing: border-box; }
        input, select, textarea { font-family: inherit; }
        .process-center { text-align: center; }
        @media (max-width: 700px) {
          nav { display: none !important; }
          #content-wrapper { padding: 24px 16px 60px !important; }
        }
      `}</style>
    </div>
  );
}
