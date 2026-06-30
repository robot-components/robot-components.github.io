const Gripper = ({ side }) => (
  <span style={{
    display: "inline-flex",
    alignSelf: "center",
    width: 10,
    height: "1em",
    borderTop: "3px solid #3b82f6",
    borderBottom: "3px solid #3b82f6",
    ...(side === "left" ? { borderLeft: "3px solid #3b82f6" } : { borderRight: "3px solid #3b82f6" }),
    flexShrink: 0,
  }} />
);

export default function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: 0, lineHeight: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <Gripper side="left" />
        {title}
        <Gripper side="right" />
      </h2>
      {action && <div style={{ flexShrink: 0, marginLeft: 16 }}>{action}</div>}
    </div>
  );
}
