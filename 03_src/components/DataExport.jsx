import { useState } from "react";
import { btn } from "./styles";

export default function DataExport() {
  const [data, setData] = useState("");
  const load = () => {
    try {
      const stored = localStorage.getItem("rtac_eq_v2");
      setData(stored ? JSON.stringify(JSON.parse(stored), null, 2) : "저장된 장비 데이터가 없습니다.");
    } catch (e) {
      setData("오류: " + e.message);
    }
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={load} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "1px solid #e2e8f0", marginBottom: 8 }}>
        📋 장비 데이터 내보내기
      </button>
      {data && (
        <div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>아래 내용을 복사해서 Claude에게 붙여넣어 주세요.</div>
          <textarea
            readOnly
            value={data}
            onClick={(e) => e.target.select()}
            style={{ width: "100%", height: 200, fontSize: 11, fontFamily: "monospace", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0", boxSizing: "border-box", resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
}
