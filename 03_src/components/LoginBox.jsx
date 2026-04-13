import { inp, btn } from "./styles";

export default function LoginBox({ showLogin, adminMode, adminPw, onAdminPwChange, onLogin, onClose }) {
  if (!showLogin || adminMode) return null;
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "0.5px solid #e2e8f0", padding: 18, marginBottom: 20, maxWidth: 340 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>관리자 로그인</div>
      <input
        type="password"
        placeholder="비밀번호"
        value={adminPw}
        onChange={(e) => onAdminPwChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onLogin()}
        style={{ ...inp(), marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onLogin} style={{ ...btn(), flex: 1, justifyContent: "center" }}>로그인</button>
        <button onClick={onClose} style={{ ...btn("#f1f5f9", "#475569"), flex: 1, justifyContent: "center" }}>취소</button>
      </div>
    </div>
  );
}
