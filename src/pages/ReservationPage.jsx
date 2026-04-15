import { Building2, ExternalLink, Info } from "lucide-react";
import { DEFAULT_ROOMS } from "../data/defaults";
import PageHeader from "../components/PageHeader";

const RES_HEADER = { label: "회의실 예약", title: "회의실 예약" };

const FORM_LINK = "https://forms.gle/hBfpoHMcbAZJRJM1A";

const NOTES = [
  "예약 신청은 구글폼을 통해 접수되며, 담당자 확인 후 승인 여부를 안내드립니다.",
  "예약 신청 후 이메일로 확정 안내를 받으신 경우에만 회의실 이용이 가능합니다.",
  "예약 취소는 이용 예정일 1일 전까지 이메일로 연락 주시기 바랍니다.",
  "회의실 내 음식물 반입은 삼가 주시기 바랍니다.",
];

export default function ReservationPage() {
  return (
    <div>
      <PageHeader label={RES_HEADER.label} title={RES_HEADER.title} sub="" />

      {/* 회의실 안내 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f", marginBottom: 14 }}>회의실 안내</div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
          {DEFAULT_ROOMS.map((room) => (
            <div key={room.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
              <div style={{ color: "#3b82f6", marginBottom: 8 }}><Building2 size={20} /></div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 5 }}>{room.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>수용 인원: {room.capacity}명</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {room.facilities.split(",").map((f, i) => (
                  <span key={i} style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}>{f.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 유의사항 */}
      <div style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px 24px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "#1e3a5f", marginBottom: 12 }}>
          <Info size={16} color="#3b82f6" />
          예약 유의사항
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {NOTES.map((note, i) => (
            <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
              <span style={{ color: "#3b82f6", flexShrink: 0 }}>·</span>
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* 예약 신청 버튼 */}
      <div style={{ textAlign: "center" }}>
        <a
          href={FORM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1e3a5f", color: "#fff", padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" }}
        >
          예약 신청하기
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
