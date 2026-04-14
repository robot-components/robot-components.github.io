export default function SectionHeader({ title }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: 0, borderLeft: "3px solid #3b82f6", paddingLeft: 12 }}>{title}</h2>
    </div>
  );
}
