export default function PageHeader({ label, title, sub }) {
  return (
    <div style={{ paddingBottom: 20, marginBottom: 32, borderBottom: "1px solid #e2e8f0" }}>
      <div style={{ fontSize: 12, color: "#3b82f6", marginBottom: 6, fontWeight: 500 }}>로봇융합부품지원센터 · {label}</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{title}</h1>
      {sub && <p style={{ color: "#64748b", margin: "8px 0 0", fontSize: 14 }}>{sub}</p>}
    </div>
  );
}
