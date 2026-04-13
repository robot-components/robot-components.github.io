export default function PageHeader({ label, title, sub }) {
  return (
    <div style={{ borderBottom: "2px solid #1e3a5f", paddingBottom: 16, marginBottom: 28 }}>
      <div style={{ fontSize: 12, color: "#3b82f6", marginBottom: 4 }}>로봇융합부품지원센터 · {label}</div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{title}</h1>
      {sub && <p style={{ color: "#64748b", margin: "8px 0 0", fontSize: 14, textAlign: "left" }}>{sub}</p>}
    </div>
  );
}
