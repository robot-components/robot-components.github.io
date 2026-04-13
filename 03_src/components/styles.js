// 공통 인라인 스타일 헬퍼
export const inp = () => ({
  padding: "9px 12px",
  borderRadius: 6,
  border: "0.5px solid #cbd5e1",
  fontSize: 13,
  fontFamily: "inherit",
  boxSizing: "border-box",
  width: "100%",
});

export const ta = (rows = 3) => ({
  ...inp(),
  resize: "vertical",
  minHeight: rows * 24,
});

export const btn = (bg = "#1e3a5f", color = "#fff") => ({
  background: bg,
  color,
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontFamily: "inherit",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
});
