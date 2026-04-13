import { inp, btn } from "./styles";

export default function LoginBox({ showLogin, adminMode, adminPw, onAdminPwChange, onLogin, onClose }) {
  if (!showLogin || adminMode) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: 20, marginBottom: 20, maxWidth: 340, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#1e293b" }}>관리자 로그인</div>
      <input
        type="password"
        placeholder="비밀번호"
        value={adminPw}
        onChange={(e) => onAdminPwChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onLogin()}
        style={{ ...inp(), marginBottom: 10 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onLogin} style={{ ...btn(), flex: 1, justifyContent: "center" }}>로그인</button>
        <button onClick={onClose} style={{ ...btn("#f1f5f9", "#64748b"), flex: 1, justifyContent: "center" }}>취소</button>
      </div>
    </div>
  );
}
