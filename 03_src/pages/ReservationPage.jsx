import { useState } from "react";
import { Building2, CheckCircle, Edit2, Plus, Trash2 } from "lucide-react";
import { useStorage } from "../hooks/useStorage";
import { DEFAULT_ROOMS } from "../data/defaults";
import { HALF_SLOTS, slotLabel } from "../utils/slotUtils";
import { inp, ta, btn } from "../components/styles";
import PageHeader from "../components/PageHeader";
import EditSection from "../components/EditSection";
import AdminBadge from "../components/AdminBadge";
import AdminBtn from "../components/AdminBtn";
import LoginBox from "../components/LoginBox";

const DEFAULT_RES_HEADER = {
  label: "회의실 예약",
  title: "회의실 예약",
  sub: "회의실을 선택하고 원하는 날짜와 시간을 예약하세요.",
};

function ReservationHeaderEditor({ resHeader, onSave, onCancel }) {
  const [f, setF] = useState({ ...resHeader });
  return (
    <EditSection title="페이지 헤더 수정" onSave={() => onSave(f)} onCancel={onCancel}>
      <div style={{ display: "grid", gap: 10 }}>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>분류명 (상단 작은 글씨)</label><input value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>제목</label><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} style={inp()} /></div>
        <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>부제</label><input value={f.sub} onChange={(e) => setF({ ...f, sub: e.target.value })} style={inp()} /></div>
      </div>
    </EditSection>
  );
}

const StepLabel = ({ num, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <span style={{ background: "#1e3a5f", color: "#fff", borderRadius: "50%", width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{num}</span>
    <span style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{label}</span>
  </div>
);

function ReservationLookup({ reservations, setReservations }) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const lookup = () => setResult(reservations.filter((r) => r.email === email && r.status !== "취소"));
  const cancel = (id) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;
    setReservations(reservations.map((x) => x.id === id ? { ...x, status: "취소" } : x));
    setResult((prev) => prev.filter((x) => x.id !== id));
  };
  return (
    <div style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20, marginBottom: 28 }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 10 }}>예약 조회 · 취소</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} placeholder="예약 시 입력한 이메일" style={{ ...inp(), flex: 1 }} />
        <button onClick={lookup} style={btn()}>조회</button>
      </div>
      {result !== null && (
        result.length === 0
          ? <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>해당 이메일로 접수된 예약이 없습니다.</div>
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              {result.map((r) => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{r.roomName}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.date} · {slotLabel(r.startHour)} ~ {slotLabel(r.endHour)}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{r.purpose}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 12, fontWeight: 500, background: r.status === "승인" ? "#dcfce7" : "#fef3c7", color: r.status === "승인" ? "#166534" : "#92400e" }}>{r.status}</span>
                    <button onClick={() => cancel(r.id)} style={btn("#fee2e2", "#991b1b")}>취소</button>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  );
}

export default function ReservationPage({ adminMode, showLogin, adminPw, onAdminPwChange, onLogin, onLoginClose, onLogout, onAdminToggle }) {
  const [rooms, setRooms] = useStorage("rtac_rooms", DEFAULT_ROOMS);
  const [reservations, setReservations] = useStorage("rtac_res", []);
  const [resHeader, setResHeader] = useStorage("rtac_res_header", DEFAULT_RES_HEADER);

  const [editingHeader, setEditingHeader] = useState(false);
  const [roomEdit, setRoomEdit] = useState(null);
  const [roomForm, setRoomForm] = useState({ name: "", capacity: "", facilities: "" });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date(2025, 2, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [resStartHour, setResStartHour] = useState(null);
  const [resEndHour, setResEndHour] = useState(null);
  const [resForm, setResForm] = useState({ name: "", org: "", phone: "", email: "", purpose: "", count: "", notes: "" });
  const [resSuccess, setResSuccess] = useState(false);

  const getDays = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirst = (y, m) => new Date(y, m, 1).getDay();
  const dateStr = () => `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
  const getDayReservations = (roomId, date) => reservations.filter((r) => r.roomId === roomId && r.date === date && r.status !== "취소");
  const resetRes = () => { setResSuccess(false); setSelectedRoom(null); setSelectedDate(null); setResStartHour(null); setResEndHour(null); setResForm({ name: "", org: "", phone: "", email: "", purpose: "", count: "", notes: "" }); };
  const submitRes = () => {
    if (!resForm.name || !resForm.org || !resForm.phone || !resForm.email || !resForm.purpose) { alert("필수 항목을 모두 입력해 주세요."); return; }
    if (resStartHour === null || resEndHour === null) { alert("시간을 선택해 주세요."); return; }
    setReservations([...reservations, { id: Date.now(), roomId: selectedRoom, roomName: rooms.find((r) => r.id === selectedRoom)?.name, date: dateStr(), startHour: resStartHour, endHour: resEndHour, ...resForm, status: "대기" }]);
    setResSuccess(true);
  };

  const RoomFormFields = () => (
    <div style={{ display: "grid", gap: 10 }}>
      <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>회의실명</label><input value={roomForm.name} onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })} style={inp()} /></div>
      <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>수용 인원</label><input type="number" value={roomForm.capacity} onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })} style={inp()} /></div>
      <div><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>시설</label><input value={roomForm.facilities} onChange={(e) => setRoomForm({ ...roomForm, facilities: e.target.value })} style={inp()} /></div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <PageHeader label={resHeader.label} title={resHeader.title} sub={resHeader.sub} />
        <AdminBtn adminMode={adminMode} onToggle={onAdminToggle} />
      </div>
      <LoginBox showLogin={showLogin} adminMode={adminMode} adminPw={adminPw} onAdminPwChange={onAdminPwChange} onLogin={onLogin} onClose={onLoginClose} />
      {adminMode && <AdminBadge onLogout={onLogout} />}

      {/* 헤더 수정 버튼 */}
      {adminMode && !editingHeader && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => setEditingHeader(true)} style={{ ...btn("#f8fafc", "#1e3a5f"), border: "1px solid #e2e8f0", fontSize: 12 }}><Edit2 size={13} />헤더 수정</button>
        </div>
      )}

      {/* 헤더 수정 폼 */}
      {adminMode && editingHeader && (
        <ReservationHeaderEditor
          resHeader={resHeader}
          onSave={(v) => { setResHeader(v); setEditingHeader(false); }}
          onCancel={() => setEditingHeader(false)}
        />
      )}

      {/* 관리자: 예약 목록 + 회의실 관리 */}
      {adminMode && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f", marginBottom: 12 }}>예약 목록</div>
          {reservations.length === 0
            ? <div style={{ color: "#94a3b8", fontSize: 13, padding: 20, background: "#fff", borderRadius: 10, border: "0.5px solid #e2e8f0" }}>예약 내역이 없습니다.</div>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {reservations.map((r) => (
                  <div key={r.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.roomName}<span style={{ fontWeight: 400, color: "#64748b", fontSize: 13 }}> {r.date} {slotLabel(r.startHour)}~{slotLabel(r.endHour)}</span></div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{r.name} ({r.org}) · {r.purpose}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 12, fontWeight: 500, background: r.status === "승인" ? "#dcfce7" : r.status === "취소" ? "#fee2e2" : "#fef3c7", color: r.status === "승인" ? "#166534" : r.status === "취소" ? "#991b1b" : "#92400e" }}>{r.status}</span>
                      {r.status === "대기" && <button onClick={() => setReservations(reservations.map((x) => x.id === r.id ? { ...x, status: "승인" } : x))} style={btn()}>승인</button>}
                      {r.status !== "취소" && <button onClick={() => setReservations(reservations.map((x) => x.id === r.id ? { ...x, status: "취소" } : x))} style={btn("#fee2e2", "#991b1b")}>취소</button>}
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f", marginBottom: 12 }}>회의실 관리</div>
          {roomEdit === "new" && (
            <EditSection title="회의실 추가" onSave={() => { setRooms([...rooms, { id: Date.now(), ...roomForm, capacity: Number(roomForm.capacity) }]); setRoomEdit(null); }} onCancel={() => setRoomEdit(null)}>
              <RoomFormFields />
            </EditSection>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {rooms.map((r) => (
              <div key={r.id}>
                {roomEdit === r.id
                  ? (
                    <EditSection title="회의실 수정" onSave={() => { setRooms(rooms.map((x) => x.id === r.id ? { ...x, ...roomForm, capacity: Number(roomForm.capacity) } : x)); setRoomEdit(null); }} onCancel={() => setRoomEdit(null)}>
                      <RoomFormFields />
                    </EditSection>
                  )
                  : (
                    <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div><span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span><span style={{ fontSize: 13, color: "#64748b", marginLeft: 10 }}>{r.capacity}명 · {r.facilities}</span></div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setRoomForm({ name: r.name, capacity: r.capacity, facilities: r.facilities }); setRoomEdit(r.id); }} style={{ ...btn("#f1f5f9", "#475569"), padding: "5px 8px" }}><Edit2 size={13} /></button>
                        <button onClick={() => { if (confirm("삭제하시겠습니까?")) setRooms(rooms.filter((x) => x.id !== r.id)); }} style={{ ...btn("#fee2e2", "#991b1b"), padding: "5px 8px" }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  )
                }
              </div>
            ))}
          </div>
          <button onClick={() => { setRoomForm({ name: "", capacity: "", facilities: "" }); setRoomEdit("new"); }} style={btn()}><Plus size={14} />회의실 추가</button>
        </div>
      )}

      {!adminMode && <ReservationLookup reservations={reservations} setReservations={setReservations} />}

      {!adminMode && (resSuccess
        ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 16, border: "0.5px solid #e2e8f0" }}>
            <CheckCircle size={52} color="#22c55e" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 8 }}>예약 신청이 완료되었습니다</h3>
            <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14, textAlign: "center" }}>담당자 확인 후 예약이 확정됩니다.</p>
            <button onClick={resetRes} style={{ ...btn(), padding: "12px 28px" }}>새 예약 신청</button>
          </div>
        )
        : (
          <div>
            {/* 1. 회의실 선택 */}
            <StepLabel num="1" label="회의실 선택" />
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", marginBottom: 28 }}>
              {rooms.map((room) => (
                <div key={room.id} onClick={() => { setSelectedRoom(room.id); setSelectedDate(null); setResStartHour(null); setResEndHour(null); }} style={{ background: selectedRoom === room.id ? "#1e3a5f" : "#fff", borderRadius: 12, border: selectedRoom === room.id ? "2px solid #1e3a5f" : "0.5px solid #e2e8f0", padding: 18, cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ color: selectedRoom === room.id ? "#93c5fd" : "#3b82f6", marginBottom: 8 }}><Building2 size={20} /></div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: selectedRoom === room.id ? "#fff" : "#1e293b", marginBottom: 5 }}>{room.name}</div>
                  <div style={{ fontSize: 12, color: selectedRoom === room.id ? "#93c5fd" : "#64748b", marginBottom: 10 }}>수용 인원: {room.capacity}명</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {(typeof room.facilities === "string" ? room.facilities.split(",") : room.facilities).map((f, i) => (
                      <span key={i} style={{ background: selectedRoom === room.id ? "rgba(255,255,255,0.12)" : "#f1f5f9", color: selectedRoom === room.id ? "#e0f2fe" : "#475569", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}>{f.trim()}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. 날짜 선택 */}
            {selectedRoom && (
              <>
                <StepLabel num="2" label="날짜 선택" />
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 22, marginBottom: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>‹</button>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>{calMonth.getFullYear()}년 {calMonth.getMonth() + 1}월</span>
                    <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 6, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>›</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
                    {["일","월","화","수","목","금","토"].map((d) => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", padding: "3px 0" }}>{d}</div>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
                    {Array.from({ length: getFirst(calMonth.getFullYear(), calMonth.getMonth()) }).map((_, i) => <div key={i} />)}
                    {Array.from({ length: getDays(calMonth.getFullYear(), calMonth.getMonth()) }).map((_, i) => {
                      const d = i + 1, sel = selectedDate === d;
                      const dStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                      const hasRes = getDayReservations(selectedRoom, dStr).length > 0;
                      return (
                        <div key={d} onClick={() => { setSelectedDate(d); setResStartHour(null); setResEndHour(null); }} style={{ borderRadius: 8, padding: "7px 4px 6px", cursor: "pointer", background: sel ? "#1e3a5f" : "#fff", border: `1px solid ${sel ? "#1e3a5f" : "#e2e8f0"}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: sel ? 700 : 400, color: sel ? "#fff" : "#334155" }}>{d}</span>
                          {hasRes ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: sel ? "#93c5fd" : "#3b82f6" }} /> : <div style={{ width: 6, height: 6 }} />}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>예약 있는 날짜</span>
                  </div>
                  {selectedDate && (() => {
                    const dStr = dateStr();
                    const dayRes = getDayReservations(selectedRoom, dStr);
                    const totalMin = 9 * 60, baseMin = 9 * 60;
                    const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
                    return (
                      <div style={{ marginTop: 20, borderTop: "0.5px solid #f1f5f9", paddingTop: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", marginBottom: 12 }}>{calMonth.getMonth() + 1}월 {selectedDate}일 예약 현황</div>
                        <div style={{ position: "relative", marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            {hours.map((h) => <span key={h} style={{ fontSize: 10, color: "#94a3b8", width: 0, textAlign: "center" }}>{h}</span>)}
                          </div>
                          <div style={{ position: "relative", height: 28, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                            {hours.slice(1, -1).map((h) => (
                              <div key={h} style={{ position: "absolute", left: `${((h * 60 - baseMin) / totalMin) * 100}%`, top: 0, width: 1, height: "100%", background: "#e2e8f0" }} />
                            ))}
                            {dayRes.length === 0
                              ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 11, color: "#94a3b8" }}>예약 없음</span></div>
                              : dayRes.map((r, ri) => {
                                  const s = Math.max(r.startHour - baseMin, 0);
                                  const e = Math.min(r.endHour - baseMin, totalMin);
                                  return <div key={ri} style={{ position: "absolute", left: `${(s / totalMin) * 100}%`, width: `${((e - s) / totalMin) * 100}%`, height: "100%", background: r.status === "승인" ? "#3b82f6" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}><span style={{ fontSize: 10, color: "#fff", whiteSpace: "nowrap", padding: "0 4px" }}>{slotLabel(r.startHour)}~{slotLabel(r.endHour)}</span></div>;
                                })
                            }
                          </div>
                        </div>
                        {dayRes.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 10 }}>
                            {dayRes.map((r, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569" }}>
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: r.status === "승인" ? "#3b82f6" : "#94a3b8", flexShrink: 0 }} />
                                <span style={{ fontWeight: 500 }}>{slotLabel(r.startHour)} ~ {slotLabel(r.endHour)}</span>
                                <span style={{ color: "#94a3b8" }}>{r.name} ({r.org})</span>
                                <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 8, background: r.status === "승인" ? "#dcfce7" : "#fef3c7", color: r.status === "승인" ? "#166534" : "#92400e" }}>{r.status}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#3b82f6" }} /><span style={{ fontSize: 11, color: "#94a3b8" }}>승인</span></div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#94a3b8" }} /><span style={{ fontSize: 11, color: "#94a3b8" }}>대기</span></div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {/* 3. 시간 선택 */}
            {selectedDate && (() => {
              const dStr = dateStr();
              const dayRes = getDayReservations(selectedRoom, dStr);
              const startSlots = HALF_SLOTS.slice(0, -1);
              const endSlots = resStartHour !== null
                ? HALF_SLOTS.slice(1).filter((e) => { if (e <= resStartHour) return false; return !dayRes.some((r) => resStartHour < r.endHour && e > r.startHour); })
                : [];
              const isStartDisabled = (s) => dayRes.some((r) => s >= r.startHour && s < r.endHour);
              return (
                <>
                  <StepLabel num="3" label="시간 선택" />
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 22, marginBottom: 22 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>시작 시간</label>
                        <select value={resStartHour ?? ""} onChange={(e) => { setResStartHour(Number(e.target.value)); setResEndHour(null); }} style={{ ...inp(), cursor: "pointer" }}>
                          <option value="">선택하세요</option>
                          {startSlots.map((s) => <option key={s} value={s} disabled={isStartDisabled(s)}>{slotLabel(s)}{isStartDisabled(s) ? " (예약됨)" : ""}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>종료 시간</label>
                        <select value={resEndHour ?? ""} onChange={(e) => setResEndHour(Number(e.target.value))} disabled={resStartHour === null} style={{ ...inp(), cursor: resStartHour === null ? "not-allowed" : "pointer", opacity: resStartHour === null ? 0.5 : 1 }}>
                          <option value="">선택하세요</option>
                          {endSlots.map((e) => <option key={e} value={e}>{slotLabel(e)}</option>)}
                        </select>
                      </div>
                    </div>
                    {resStartHour !== null && resEndHour !== null && (
                      <div style={{ marginTop: 12, background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#166534" }}>
                        ✓ 선택된 시간: <strong>{slotLabel(resStartHour)} ~ {slotLabel(resEndHour)}</strong> ({((resEndHour - resStartHour) / 60).toFixed(1)}시간)
                      </div>
                    )}
                  </div>
                </>
              );
            })()}

            {/* 4. 예약 정보 입력 */}
            {resStartHour !== null && resEndHour !== null && (
              <>
                <StepLabel num="4" label="예약 정보 입력" />
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24 }}>
                  <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
                    {[{ k: "name", l: "예약자 이름 *", p: "홍길동" },{ k: "org", l: "소속 기관 *", p: "(주)로봇부품" },{ k: "phone", l: "연락처 *", p: "010-0000-0000" },{ k: "email", l: "이메일 *", p: "email@company.com" },{ k: "count", l: "참석 인원", p: "5명" }].map((f) => (
                      <div key={f.k}><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{f.l}</label><input value={resForm[f.k]} onChange={(e) => setResForm({ ...resForm, [f.k]: e.target.value })} placeholder={f.p} style={inp()} /></div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 12 }}><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>사용 목적 *</label><input value={resForm.purpose} onChange={(e) => setResForm({ ...resForm, purpose: e.target.value })} placeholder="예: 프로젝트 킥오프 미팅" style={inp()} /></div>
                  <div style={{ marginBottom: 18 }}><label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>요청 사항</label><textarea value={resForm.notes} onChange={(e) => setResForm({ ...resForm, notes: e.target.value })} rows={3} style={ta(3)} /></div>
                  <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#475569" }}>
                    <strong>{rooms.find((r) => r.id === selectedRoom)?.name}</strong> · {calMonth.getFullYear()}년 {calMonth.getMonth() + 1}월 {selectedDate}일 · {slotLabel(resStartHour)} ~ {slotLabel(resEndHour)}
                  </div>
                  <button onClick={submitRes} style={{ ...btn(), padding: "12px 28px", fontSize: 14, fontWeight: 500 }}>예약 신청하기</button>
                </div>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}
