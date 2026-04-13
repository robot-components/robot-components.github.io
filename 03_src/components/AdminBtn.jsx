import { btn } from "./styles";

export default function AdminBtn({ adminMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{ ...btn(adminMode ? "#fef3c7" : "transparent", adminMode ? "#92400e" : "#64748b"), border: "0.5px solid #cbd5e1", fontSize: 12, padding: "6px 12px" }}
    >
      {adminMode ? "관리자 종료" : "관리자"}
    </button>
  );
}
