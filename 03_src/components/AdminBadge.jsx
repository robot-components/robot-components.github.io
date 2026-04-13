export default function AdminBadge({ onLogout }) {
  return (
    <div style={{ background: "#fef3c7", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: "#92400e", fontWeight: 500 }}>✦ 관리자 모드</span>
      <button onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#92400e", fontFamily: "inherit" }}>로그아웃</button>
    </div>
  );
}
