// 공통 인라인 스타일 헬퍼
// 기준: borderRadius 8, border 1px solid, fontWeight 600 (버튼)

export const inp = () => ({
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
  width: "100%",
  color: "#1e293b",
  background: "#fff",
  outline: "none",
});

export const ta = (rows = 3) => ({
  ...inp(),
  resize: "vertical",
  minHeight: rows * 26,
});

export const btn = (bg = "#1e3a5f", color = "#fff") => ({
  background: bg,
  color,
  border: "none",
  padding: "9px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  fontFamily: "inherit",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
});
