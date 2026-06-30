import { useState, useRef, useEffect } from "react";
import { Lock, LogOut } from "lucide-react";
import { PAGES } from "./data/pages";
import { DEFAULT_SITE, DEFAULT_LOCATION } from "./data/defaults";
import { supabase } from "./lib/supabase";
import PageWrapper from "./components/PageWrapper";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import KolasPage from "./pages/KolasPage";
import EquipmentPage from "./pages/EquipmentPage";
import ReservationPage from "./pages/ReservationPage";
import NoticePage from "./pages/NoticePage";
import FaqPage from "./pages/FaqPage";

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\//, "");
    if (!path) return -1;
    const idx = PAGES.findIndex(p => p.slug === path);
    return idx >= 0 ? idx : -1;
  };

  const [pageIdx, setPageIdx] = useState(getInitialPage);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const topRef = useRef(null);

  const [adminUser, setAdminUser] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAdminUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAdminLogin = async () => {
    setLoginErr("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPw });
    setLoginLoading(false);
    if (error) { setLoginErr("이메일 또는 비밀번호가 올바르지 않습니다."); return; }
    setShowAdminLogin(false);
    setAdminEmail("");
    setAdminPw("");
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
  };

  const nav = (i) => {
    setPageIdx(i);
    if (i === -1) {
      document.title = DEFAULT_SITE.centerName;
      try { window.history.pushState({}, "", "/"); } catch {}
    } else {
      document.title = `${PAGES[i].label} | ${DEFAULT_SITE.centerName}`;
      try { window.history.pushState({}, "", `/${PAGES[i].slug}`); } catch {}
    }
    topRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const iStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none", background: "#fff", color: "#334155" };

  return (
    <div ref={topRef} style={{ fontFamily: "'Noto Sans KR', sans-serif", minHeight: "100vh", background: pageIdx === -1 ? "#060d1a" : "#fff", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Do+Hyeon&family=IBM+Plex+Mono:wght@400;500;600&family=Nanum+Gothic+Coding&family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      {pageIdx !== -1 && (
        <header style={{ background: "#fff", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ width: "100%", boxSizing: "border-box", padding: "0 clamp(24px, calc((100vw - 800px) / 2), 600px)", display: "flex", alignItems: "center", height: 72 }}>

            {/* 왼쪽: 로고 */}
            <div onClick={() => nav(-1)}
              onMouseEnter={() => setHoveredLogo(true)}
              onMouseLeave={() => setHoveredLogo(false)}
              style={{ cursor: "pointer", marginRight: "auto", display: "flex", alignItems: "center", gap: 16 }}>
              {/* 로고 아이콘: 계단형 — 각 바 x 범위 비겹침, 하단 좌(길)→상단 우(짧) */}
              <svg width="43" height="26" viewBox="0 0 42 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0"  y="18" width="18" height="4" fill="#060d1a"/>
                <rect x="19" y="10" width="14" height="4" fill="#060d1a"/>
                <rect x="34" y="2"  width="8"  height="4" fill="#060d1a"/>
              </svg>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "'A2G 7Bold', sans-serif", color: "#060d1a", fontSize: 26, lineHeight: "normal", paddingTop: 4, opacity: hoveredLogo ? 0 : 1, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>로봇융합부품지원센터</div>
                <div style={{ fontFamily: "'A2G 7Bold', sans-serif", color: "#060d1a", fontSize: 26, lineHeight: "normal", paddingTop: 4, position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", opacity: hoveredLogo ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>Robot Test and Approval Center</div>
              </div>
            </div>

            {/* 오른쪽: 인덱스 + ADMIN */}
            <div id="main-nav" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {PAGES.map((p, i) => {
                const isActive = pageIdx === i;
                const isHover = hoveredNav === i;
                return (
                  <button key={i} onClick={() => nav(i)}
                    onMouseEnter={() => setHoveredNav(i)}
                    onMouseLeave={() => setHoveredNav(null)}
                    style={{
                      border: "none", padding: "11px 18px", borderRadius: 4, cursor: "pointer",
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700,
                      letterSpacing: "0.07em", whiteSpace: "nowrap", textTransform: "uppercase",
                      lineHeight: 1, display: "flex", alignItems: "center",
                      transition: "all 0.08s",
                      background: isActive
                        ? "linear-gradient(180deg, #4ade80 0%, #22c55e 45%, #16a34a 100%)"
                        : isHover
                        ? "linear-gradient(180deg, #fef08a 0%, #facc15 45%, #ca8a04 100%)"
                        : "linear-gradient(180deg, #f9fafb 0%, #e5e7eb 50%, #d1d5db 100%)",
                      color: isActive ? "#fff" : isHover ? "#713f12" : "#374151",
                      boxShadow: isActive
                        ? "inset 0 3px 6px rgba(0,0,0,0.2), 0 1px 0 #15803d"
                        : isHover
                        ? "0 4px 0 #a16207, inset 0 1px 0 rgba(255,255,255,0.7)"
                        : "0 4px 0 #9ca3af, inset 0 1px 0 rgba(255,255,255,0.95)",
                      transform: isActive ? "translateY(3px)" : isHover ? "translateY(1px)" : "translateY(0)",
                    }}>
                    {p.label}
                  </button>
                );
              })}
              {adminUser ? (
                <button onClick={handleAdminLogout} style={{
                  border: "none", padding: "11px 14px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.07em", lineHeight: 1, display: "flex", alignItems: "center", gap: 5,
                  background: "linear-gradient(180deg, #fca5a5 0%, #ef4444 45%, #b91c1c 100%)",
                  color: "#fff", boxShadow: "0 4px 0 #991b1b, inset 0 1px 0 rgba(255,255,255,0.35)",
                }}>
                  <LogOut size={12} /> LOGOUT
                </button>
              ) : (
                <button onClick={() => { setLoginErr(""); setShowAdminLogin(true); }} style={{
                  border: "none", padding: "11px 14px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.07em", lineHeight: 1, display: "flex", alignItems: "center", gap: 5,
                  background: "linear-gradient(180deg, #fca5a5 0%, #ef4444 45%, #b91c1c 100%)",
                  color: "#fff", boxShadow: "0 4px 0 #991b1b, inset 0 1px 0 rgba(255,255,255,0.35)",
                }}>
                  <Lock size={12} /> ADMIN
                </button>
              )}
            </div>

          </div>
        </header>
      )}

      {/* 메인 */}
      <main style={{ flex: 1, width: "100%" }}>
        <div id="content-wrapper" style={{ boxSizing: "border-box", padding: pageIdx === -1 ? 0 : "120px clamp(24px, calc((100vw - 800px) / 2), 600px) 80px", width: "100%" }}>
          <PageWrapper pageKey={pageIdx}>
            {pageIdx === -1 && <LandingPage nav={nav} />}
            {pageIdx === 0 && <AboutPage nav={nav} />}
            {pageIdx === 1 && <KolasPage />}
            {pageIdx === 2 && <EquipmentPage adminUser={adminUser} />}
            {pageIdx === 3 && <ReservationPage adminUser={adminUser} />}
            {pageIdx === 4 && <NoticePage adminUser={adminUser} />}
            {pageIdx === 5 && <FaqPage adminUser={adminUser} />}
          </PageWrapper>
        </div>
      </main>

      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <div onClick={() => setShowAdminLogin(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, width: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: "0 0 20px" }}>관리자 로그인</h3>
            <input type="email" placeholder="이메일" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
              style={{ ...iStyle, marginBottom: 10 }} />
            <input type="password" placeholder="비밀번호" value={adminPw} onChange={e => setAdminPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              style={{ ...iStyle, marginBottom: loginErr ? 6 : 16 }} />
            {loginErr && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{loginErr}</div>}
            <button onClick={handleAdminLogin} disabled={loginLoading}
              style={{ width: "100%", background: "#3b82f6", color: "#fff", border: "none", padding: 11, borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
              {loginLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @font-face {
          font-family: 'KERISKEDU Line';
          src: url('/fonts/KERISKEDU_Line.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Giants Inline';
          src: url('/fonts/Giants-Inline.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Giants Bold';
          src: url('/fonts/Giants-Bold.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'A2G 7Bold';
          src: url('/fonts/A2G-7Bold.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Giants Regular';
          src: url('/fonts/Giants-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'KoPubWorld Dotum Bold';
          src: url('/fonts/KoPubWorld-Dotum-Bold.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        .kolas-code-input::placeholder { color: rgba(255,255,255,0.75); }
        body { margin: 0; }
        * { box-sizing: border-box; }
        input, select, textarea { font-family: inherit; color: #1e3a5f; }
        input::placeholder, textarea::placeholder { color: #94a3b8; }
        .process-center { text-align: center; }
        @media (max-width: 700px) {
          #main-nav { display: none !important; }
          #content-wrapper { padding: 24px 16px 60px !important; }
        }
      `}</style>
    </div>
  );
}
