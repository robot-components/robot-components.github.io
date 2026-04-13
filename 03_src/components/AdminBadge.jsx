export default function AdminBadge({ onLogout }) {
  return (
    <div style={{ background: "#fef9c3", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #fde68a" }}>
      <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>관리자 모드 활성화</span>
      <button onClick={onLogout} style={{ background: "none", border: "1px solid #fcd34d", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#92400e", fontFamily: "inherit", padding: "4px 10px", fontWeight: 500 }}>로그아웃</button>
    </div>
  );
}
