import { btn } from "./styles";

export default function AdminBtn({ adminMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{ ...btn(adminMode ? "#fef3c7" : "transparent", adminMode ? "#92400e" : "#94a3b8"), border: `1px solid ${adminMode ? "#fcd34d" : "#cbd5e1"}`, fontSize: 12, padding: "6px 12px", fontWeight: 500 }}
    >
      {adminMode ? "관리자 종료" : "관리자"}
    </button>
  );
}
