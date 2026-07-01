import { DEFAULT_KOLAS } from "../data/defaults";
import useIsMobile from "../hooks/useIsMobile";

export default function KolasPage() {
  const isMobile = useIsMobile();
  const items = DEFAULT_KOLAS;

  return (
    <div>
      <div style={{ fontFamily: "'KoPubWorld Dotum Bold', sans-serif", fontSize: 26, fontWeight: 400, color: "#d1d5db", lineHeight: 1, marginBottom: 42 }}>KOLAS 인정 규격</div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
        {items.map((k) => (
          <div key={k.id}
            style={{
              background: "#fff", borderRadius: 12, padding: "48px 28px", position: "relative", textAlign: "center",
              border: "1px solid #e2e8f0",
            }}>
            <div style={{ display: "inline-block", background: "#3b82f6", color: "#fff", borderRadius: 6, padding: "8px 16px", fontSize: 14, fontFamily: "'Giants Regular', sans-serif", fontWeight: 400, lineHeight: 1.4, marginBottom: 28, whiteSpace: "nowrap" }}>{k.code}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", lineHeight: 1.5, margin: "0 0 14px" }}>{k.title}</h3>
            {k.desc && (
              <div>
                {k.desc.split("\n").filter(l => l.trim()).map((line, li, arr) => (
                  <div key={li} style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: li < arr.length - 1 ? 8 : 0 }}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
