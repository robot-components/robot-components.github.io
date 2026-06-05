import { useState, useRef, useEffect } from "react";
import { Lock, LogOut } from "lucide-react";
import { PAGES } from "./data/pages";
import { DEFAULT_SITE, DEFAULT_LOCATION } from "./data/defaults";
import { supabase } from "./lib/supabase";
import PageWrapper from "./components/PageWrapper";
import AboutPage from "./pages/AboutPage";
import KolasPage from "./pages/KolasPage";
import EquipmentPage from "./pages/EquipmentPage";
import ReservationPage from "./pages/ReservationPage";
import NoticePage from "./pages/NoticePage";
import FaqPage from "./pages/FaqPage";

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\//, "");
    const idx = PAGES.findIndex(p => p.slug === path);
    return idx >= 0 ? idx : 0;
  };

  const [pageIdx, setPageIdx] = useState(getInitialPage);
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
    document.title = `${PAGES[i].label} | ${DEFAULT_SITE.centerName}`;
    try { window.history.pushState({}, "", `/${PAGES[i].slug}`); } catch {}
    topRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const iStyle = { border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 14, width: "100%", boxSizing: "border-box", fontFamily: "inherit", outline: "none" };

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
              <button key={i} onClick={() => nav(i)}
                style={{ background: pageIdx === i ? "rgba(255,255,255,0.12)" : "transparent", color: pageIdx === i ? "#fff" : "#94a3b8", border: "none", padding: "8px 11px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit", borderBottom: pageIdx === i ? "2px solid #60a5fa" : "2px solid transparent", whiteSpace: "nowrap" }}>
                {p.label}
              </button>
            ))}
          </nav>
          <div style={{ flexShrink: 0 }}>
            {adminUser ? (
              <button onClick={handleAdminLogout}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#93c5fd", cursor: "pointer", fontSize: 12, fontFamily: "inherit", padding: "5px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <LogOut size={12} /> 로그아웃
              </button>
            ) : (
              <button onClick={() => { setLoginErr(""); setShowAdminLogin(true); }}
                style={{ background: "transparent", border: "none", color: "rgba(148,163,184,0.4)", cursor: "pointer", padding: "5px", borderRadius: 6, display: "flex", alignItems: "center" }}>
                <Lock size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main style={{ flex: 1, width: "100%" }}>
        <div id="content-wrapper" style={{ maxWidth: 1126, margin: "0 auto", boxSizing: "border-box", padding: "40px 32px 80px" }}>
          <PageWrapper pageKey={pageIdx}>
            {pageIdx === 0 && <AboutPage nav={nav} site={DEFAULT_SITE} location={DEFAULT_LOCATION} />}
            {pageIdx === 1 && <KolasPage location={DEFAULT_LOCATION} />}
            {pageIdx === 2 && <EquipmentPage location={DEFAULT_LOCATION} />}
            {pageIdx === 3 && <ReservationPage />}
            {pageIdx === 4 && <NoticePage adminUser={adminUser} />}
            {pageIdx === 5 && <FaqPage adminUser={adminUser} location={DEFAULT_LOCATION} />}
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

      {/* 관리자 로그인 모달 */}
      {showAdminLogin && (
        <div onClick={() => setShowAdminLogin(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 16, padding: 28, width: 320, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: "0 0 20px" }}>관리자 로그인</h3>
            <input type="email" placeholder="이메일" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
              style={{ ...iStyle, marginBottom: 10 }} />
            <input type="password" placeholder="비밀번호" value={adminPw} onChange={e => setAdminPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              style={{ ...iStyle, marginBottom: loginErr ? 6 : 16 }} />
            {loginErr && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{loginErr}</div>}
            <button onClick={handleAdminLogin} disabled={loginLoading}
              style={{ width: "100%", background: "#1e3a5f", color: "#fff", border: "none", padding: 11, borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
              {loginLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </div>
      )}

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
