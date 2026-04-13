import { useState, useRef } from "react";
import { PAGES } from "./data/pages";
import { DEFAULT_SITE, DEFAULT_LOCATION } from "./data/defaults";
import { useStorage } from "./hooks/useStorage";
import PageWrapper from "./components/PageWrapper";
import AdminBtn from "./components/AdminBtn";
import AboutPage from "./pages/AboutPage";
import KolasPage from "./pages/KolasPage";
import EquipmentPage from "./pages/EquipmentPage";
import ReservationPage from "./pages/ReservationPage";
import NoticePage from "./pages/NoticePage";
import FaqPage from "./pages/FaqPage";

export default function App() {
  const [pageIdx, setPageIdx] = useState(0);
  const [adminMode, setAdminMode] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [site, setSite] = useStorage("rtac_site", DEFAULT_SITE);
  const [location, setLocation] = useStorage("rtac_location", DEFAULT_LOCATION);

  const topRef = useRef(null);

  const nav = (i) => {
    setPageIdx(i);
    setShowLogin(false);
    document.title = `${PAGES[i].label} | ${site.centerName}`;
    try { window.history.pushState({}, "", `/${PAGES[i].slug}`); } catch {}
    topRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const login = () => {
    if (adminPw === "2840") { setAdminMode(true); setShowLogin(false); setAdminPw(""); }
    else alert("비밀번호가 틀렸습니다.");
  };
  const logout = () => { setAdminMode(false); };

  // 각 페이지에 전달하는 공통 관리자 props
  const adminProps = {
    adminMode,
    showLogin,
    adminPw,
    onAdminPwChange: setAdminPw,
    onLogin: login,
    onLoginClose: () => setShowLogin(false),
    onLogout: logout,
    onAdminToggle: adminMode ? logout : () => setShowLogin((v) => !v),
  };

  return (
    <div ref={topRef} style={{ fontFamily: "'Noto Sans KR', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <header style={{ background: "#1e3a5f", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ width: "100%", boxSizing: "border-box", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, gap: 16 }}>
          <div onClick={() => nav(0)} style={{ cursor: "pointer", flexShrink: 0 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "left" }}>{site.centerName}</div>
            <div style={{ color: "#93c5fd", fontSize: 11, textAlign: "left" }}>{site.centerNameEn}</div>
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
          <div style={{ flexShrink: 0 }}>
            <AdminBtn adminMode={adminMode} onToggle={adminMode ? logout : () => setShowLogin((v) => !v)} />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ width: "100%", boxSizing: "border-box", padding: "40px 32px 80px" }}>
        <PageWrapper pageKey={pageIdx}>
          {pageIdx === 0 && (
            <AboutPage
              nav={nav}
              {...adminProps}
              site={site}
              setSite={setSite}
              location={location}
              setLocation={setLocation}
            />
          )}
          {pageIdx === 1 && (
            <KolasPage
              {...adminProps}
              site={site}
              setSite={setSite}
              location={location}
            />
          )}
          {pageIdx === 2 && (
            <EquipmentPage
              {...adminProps}
              location={location}
            />
          )}
          {pageIdx === 3 && (
            <ReservationPage
              {...adminProps}
            />
          )}
          {pageIdx === 4 && (
            <NoticePage
              {...adminProps}
            />
          )}
          {pageIdx === 5 && (
            <FaqPage
              {...adminProps}
              location={location}
            />
          )}
        </PageWrapper>
      </main>

      {/* 푸터 */}
      <footer style={{ background: "#1e3a5f", padding: "32px 24px" }}>
        <div style={{ width: "100%", boxSizing: "border-box", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{site.centerName} (RTAC)</div>
            <div style={{ fontSize: 12, lineHeight: 2, color: "#93c5fd" }}>
              {location.address.replace("\n", " ")}<br />
              {location.email} · {location.website}
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#60a5fa", alignSelf: "flex-end" }}>Korea Electronics Technology Institute (KETI)</div>
        </div>
      </footer>

      <style>{`
        @media(max-width:700px){nav{display:none!important}}
        body { margin: 0; }
        p, span, td, li { text-align: left !important; }
        h1, h2, h3 { text-align: left !important; }
        .process-center { text-align: center !important; }
      `}</style>
    </div>
  );
}
