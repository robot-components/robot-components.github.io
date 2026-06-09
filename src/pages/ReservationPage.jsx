import { useState, useEffect, useCallback } from "react";
import { Building2, Info, Check, X, ChevronDown, ChevronUp, RefreshCw, Trash2, ChevronLeft, ChevronRight, Pencil, Plus, GripVertical } from "lucide-react";
import { DEFAULT_ROOMS } from "../data/defaults";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";

const sendEmail = (type, data) =>
  supabase.functions.invoke("dynamic-function", { body: { type, data } }).catch(() => {});

const DEFAULT_NOTES = [
  "예약 신청 후 담당자 확인을 거쳐 이메일로 승인 여부를 안내드립니다.",
  "예약 확정 안내를 받으신 경우에만 회의실 이용이 가능합니다.",
  "예약 취소는 이용 예정일 1일 전까지 이메일로 연락 주시기 바랍니다.",
  "회의실 내 음식물 반입은 삼가 주시기 바랍니다.",
];

const STATUS_LABEL = { pending: "대기중", approved: "승인", rejected: "거절" };
const STATUS_COLOR = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };

const TIME_OPTIONS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30","18:00",
];

const EMPTY_FORM = {
  name: "", affiliation: "", phone: "", email: "",
  date: "", start_time: "", end_time: "", room: "", purpose: "",
};

const MONTH_NAMES = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const DAY_NAMES = ["일","월","화","수","목","금","토"];

const IS = {
  border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "10px 14px", fontSize: 14, outline: "none",
  width: "100%", boxSizing: "border-box", background: "#fff",
};
const IS_SM = {
  border: "1px solid #e2e8f0", borderRadius: 8,
  padding: "9px 12px", fontSize: 13, outline: "none",
  fontFamily: "inherit", boxSizing: "border-box",
};
const ab = (v = "default") => ({
  background: v === "danger" ? "#fee2e2" : v === "primary" ? "#1e3a5f" : "#f1f5f9",
  color: v === "danger" ? "#991b1b" : v === "primary" ? "#fff" : "#475569",
  border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer",
  fontSize: 12, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
});
const EP = {
  background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 20,
};

export default function ReservationPage({ adminUser }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const [reservations, setReservations] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [adminNote, setAdminNote] = useState({});

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarReservations, setCalendarReservations] = useState([]);

  // ── CMS 상태 ──
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [saving, setSaving] = useState(false);

  // 회의실 편집
  const [roomEd, setRoomEd] = useState(null); // { id: room.id|'new', data: {...} }

  // 회의실 드래그 앤 드롭
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleRoomDragStart = (idx) => setDragIdx(idx);
  const handleRoomDragOver = (e, idx) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleRoomDrop = async (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    const reordered = [...rooms];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    setRooms(reordered);
    setDragIdx(null);
    setDragOverIdx(null);
    await saveKey("reservation_rooms", { items: reordered });
  };
  const handleRoomDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  // 유의사항 편집
  const [notesEd, setNotesEd] = useState(false);
  const [notesText, setNotesText] = useState("");

  // ── 설정 로드 ──
  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*")
      .in("key", ["reservation_rooms", "reservation_notes"]);
    if (!data) return;
    const m = Object.fromEntries(data.map(r => [r.key, r.value]));
    if (m.reservation_rooms?.items) setRooms(m.reservation_rooms.items);
    if (m.reservation_notes?.items) setNotes(m.reservation_notes.items);
  };

  const saveKey = async (key, value) => {
    setSaving(true);
    await supabase.from("site_settings").upsert({ key, value });
    setSaving(false);
  };

  // ── 회의실 저장/삭제 ──
  const saveRoom = async () => {
    const d = { ...roomEd.data };
    const newRooms = roomEd.id === "new"
      ? [...rooms, { ...d, id: Date.now() }]
      : rooms.map(r => r.id === roomEd.id ? { ...d } : r);
    await saveKey("reservation_rooms", { items: newRooms });
    setRooms(newRooms);
    setRoomEd(null);
    loadSettings();
  };

  const delRoom = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    const newRooms = rooms.filter(r => r.id !== id);
    await saveKey("reservation_rooms", { items: newRooms });
    setRooms(newRooms);
    loadSettings();
  };

  const patchRoom = (p) => setRoomEd(e => ({ ...e, data: { ...e.data, ...p } }));

  // ── 유의사항 저장 ──
  const saveNotes = async () => {
    const newNotes = notesText.split("\n").filter(l => l.trim());
    await saveKey("reservation_notes", { items: newNotes });
    setNotes(newNotes);
    setNotesEd(false);
    loadSettings();
  };

  // ── 예약 로직 ──
  const fetchReservations = useCallback(async () => {
    setLoadingRes(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setReservations(data || []);
    setLoadingRes(false);
  }, []);

  const fetchCalendarData = useCallback(async () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = `${y}-${String(m + 1).padStart(2, "0")}-01`;
    const lastDay = `${y}-${String(m + 1).padStart(2, "0")}-${new Date(y, m + 1, 0).getDate()}`;
    const { data } = await supabase
      .from("reservations")
      .select("id, date, start_time, end_time, room, status")
      .in("status", ["pending", "approved"])
      .gte("date", firstDay)
      .lte("date", lastDay);
    setCalendarReservations(data || []);
  }, [currentDate]);

  useEffect(() => { fetchCalendarData(); }, [fetchCalendarData]);
  useEffect(() => {
    if (adminUser) fetchReservations();
    else setReservations([]);
  }, [adminUser, fetchReservations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (form.end_time <= form.start_time) {
      setFormError("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reservations").insert([form]);
    if (error) {
      setFormError("신청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } else {
      sendEmail("new_reservation", form);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    }
    setSubmitting(false);
  };

  const deleteReservation = async (id, name) => {
    if (!window.confirm(`"${name}" 신청 내역을 삭제하시겠습니까?`)) return;
    await supabase.from("reservations").delete().eq("id", id);
    await fetchReservations();
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const reservation = reservations.find(r => r.id === id);
    const note = adminNote[id] !== undefined ? adminNote[id] : (reservation?.admin_note || "");
    await supabase.from("reservations").update({ status, admin_note: note }).eq("id", id);
    sendEmail("reservation_result", {
      to_email: reservation.email,
      name: reservation.name,
      status_label: status === "approved" ? "승인" : "거절",
      date: reservation.date,
      start_time: reservation.start_time,
      end_time: reservation.end_time,
      room: reservation.room,
      admin_note: note,
    });
    await fetchReservations();
    setUpdatingId(null);
  };

  const filtered = statusFilter === "all"
    ? reservations
    : reservations.filter(r => r.status === statusFilter);

  const today = new Date().toISOString().split("T")[0];
  const calYear = currentDate.getFullYear();
  const calMonth = currentDate.getMonth();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const reservationsByDate = calendarReservations.reduce((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader label="회의실 예약" title="회의실 예약" sub="" />

      {/* ── 회의실 안내 ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>회의실 안내</div>
          {adminUser && (
            <button onClick={() => setRoomEd({ id: "new", data: { name: "", capacity: "", facilities: "" } })} style={ab()}>
              <Plus size={12} /> 회의실 추가
            </button>
          )}
        </div>

        {/* 새 회의실 추가 폼 */}
        {roomEd?.id === "new" && (
          <div style={{ ...EP, marginBottom: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8 }}>
                <input placeholder="회의실 이름" value={roomEd.data.name || ""} onChange={e => patchRoom({ name: e.target.value })} style={IS_SM} />
                <input placeholder="수용 인원" type="number" value={roomEd.data.capacity || ""} onChange={e => patchRoom({ capacity: +e.target.value })} style={IS_SM} />
              </div>
              <input placeholder="시설 (쉼표 구분, 예: 모니터, 화상회의 시스템)" value={roomEd.data.facilities || ""} onChange={e => patchRoom({ facilities: e.target.value })} style={{ ...IS_SM, width: "100%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button onClick={() => setRoomEd(null)} style={ab()}>취소</button>
              <button onClick={saveRoom} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))" }}>
          {rooms.map((room, idx) => roomEd?.id === room.id ? (
            <div key={room.id} style={EP}>
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 8 }}>
                  <input placeholder="회의실 이름" value={roomEd.data.name || ""} onChange={e => patchRoom({ name: e.target.value })} style={IS_SM} />
                  <input placeholder="수용 인원" type="number" value={roomEd.data.capacity || ""} onChange={e => patchRoom({ capacity: +e.target.value })} style={IS_SM} />
                </div>
                <input placeholder="시설 (쉼표 구분)" value={roomEd.data.facilities || ""} onChange={e => patchRoom({ facilities: e.target.value })} style={{ ...IS_SM, width: "100%" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button onClick={() => setRoomEd(null)} style={ab()}>취소</button>
                <button onClick={saveRoom} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
              </div>
            </div>
          ) : (
            <div key={room.id}
              draggable={!!adminUser}
              onDragStart={() => handleRoomDragStart(idx)}
              onDragOver={e => handleRoomDragOver(e, idx)}
              onDrop={e => handleRoomDrop(e, idx)}
              onDragEnd={handleRoomDragEnd}
              style={{ background: "#fff", borderRadius: 12, padding: 20, position: "relative",
                cursor: adminUser ? "grab" : "default",
                border: dragOverIdx === idx && dragIdx !== idx ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                opacity: dragIdx === idx ? 0.5 : 1, transition: "opacity 0.15s" }}>
              {adminUser && (
                <>
                  <div style={{ position: "absolute", top: "50%", left: 8, transform: "translateY(-50%)", color: "#cbd5e1", pointerEvents: "none" }}>
                    <GripVertical size={14} />
                  </div>
                  <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); setRoomEd({ id: room.id, data: { ...room } }); }} style={{ ...ab(), padding: "3px 7px" }}><Pencil size={11} /></button>
                    <button onClick={e => { e.stopPropagation(); delRoom(room.id); }} style={{ ...ab("danger"), padding: "3px 7px" }}><Trash2 size={11} /></button>
                  </div>
                </>
              )}
              <div style={{ color: "#3b82f6", marginBottom: 8, paddingLeft: adminUser ? 14 : 0 }}><Building2 size={20} /></div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", marginBottom: 5, paddingLeft: adminUser ? 14 : 0 }}>{room.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, paddingLeft: adminUser ? 14 : 0 }}>수용 인원: {room.capacity}명</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingLeft: adminUser ? 14 : 0 }}>
                {String(room.facilities || "").split(",").map((f, i) => (
                  <span key={i} style={{ background: "#f1f5f9", color: "#475569", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}>{f.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 예약 현황 달력 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>예약 현황</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); setSelectedDay(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, display: "flex" }}>
              <ChevronLeft size={16} color="#64748b" />
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f", minWidth: 80, textAlign: "center" }}>
              {calYear}년 {MONTH_NAMES[calMonth]}
            </span>
            <button onClick={() => { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); setSelectedDay(null); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, display: "flex" }}>
              <ChevronRight size={16} color="#64748b" />
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
          {DAY_NAMES.map((d, i) => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, padding: "4px 0",
              color: i === 0 ? "#ef4444" : i === 6 ? "#3b82f6" : "#94a3b8" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayRes = reservationsByDate[dateStr] || [];
            const isToday = dateStr === today;
            const isSelected = selectedDay === dateStr;
            const dow = (firstDayOfMonth + i) % 7;
            return (
              <div key={day} onClick={() => dayRes.length > 0 && setSelectedDay(isSelected ? null : dateStr)}
                style={{ minHeight: 58, borderRadius: 8, padding: "6px 4px",
                  cursor: dayRes.length > 0 ? "pointer" : "default",
                  background: isSelected ? "#eff6ff" : "transparent",
                  border: isSelected ? "1px solid #bfdbfe" : isToday ? "2px solid #1e3a5f" : "1px solid transparent" }}>
                <div style={{ textAlign: "center", fontSize: 13, marginBottom: 3,
                  fontWeight: isToday ? 700 : 400,
                  color: dow === 0 ? "#ef4444" : dow === 6 ? "#3b82f6" : isToday ? "#1e3a5f" : "#334155" }}>
                  {day}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {dayRes.slice(0, 2).map(r => (
                    <div key={r.id} style={{ fontSize: 10, textAlign: "center", borderRadius: 3, padding: "1px 3px",
                      background: r.status === "approved" ? "#dcfce7" : "#fef3c7",
                      color: r.status === "approved" ? "#15803d" : "#92400e" }}>
                      {r.start_time}
                    </div>
                  ))}
                  {dayRes.length > 2 && <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>+{dayRes.length - 2}</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 12, justifyContent: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#dcfce7", border: "1px solid #bbf7d0" }} /> 승인
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: "#fef3c7", border: "1px solid #fde68a" }} /> 대기중
          </div>
        </div>

        {selectedDay && reservationsByDate[selectedDay] && (
          <div style={{ marginTop: 14, padding: "14px 16px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e3a5f", marginBottom: 10 }}>
              {selectedDay.replace(/-/g, ".")} 예약 현황
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[...reservationsByDate[selectedDay]]
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map(r => (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <span style={{ color: "#475569", fontWeight: 500 }}>{r.start_time} ~ {r.end_time}</span>
                    <span style={{ color: "#64748b" }}>{r.room}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                      background: r.status === "approved" ? "#dcfce7" : "#fef3c7",
                      color: r.status === "approved" ? "#15803d" : "#92400e" }}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* 예약 신청 폼 */}
      {!adminUser && (
        submitted ? (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "36px 28px", textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#15803d", marginBottom: 8 }}>예약 신청이 완료되었습니다</div>
            <p style={{ fontSize: 13, color: "#166534", margin: "0 0 20px", lineHeight: 1.7 }}>
              담당자 검토 후 입력하신 이메일로 확정 여부를 안내드립니다.
            </p>
            <button onClick={() => setSubmitted(false)}
              style={{ background: "#15803d", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              새 예약 신청
            </button>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 28, marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f", marginBottom: 20 }}>예약 신청</div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr", marginBottom: 12 }}>
                <input style={IS} placeholder="신청자 이름 *" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <input style={IS} placeholder="소속 / 기관명 *" value={form.affiliation}
                  onChange={e => setForm(f => ({ ...f, affiliation: e.target.value }))} required />
                <input style={IS} type="tel" placeholder="연락처 *" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                <input style={IS} type="email" placeholder="이메일 *" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 12 }}>
                <input style={IS} type="date" value={form.date} min={today}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                <select style={IS} value={form.start_time}
                  onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} required>
                  <option value="">시작 시간 *</option>
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select style={IS} value={form.end_time}
                  onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} required>
                  <option value="">종료 시간 *</option>
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
                <select style={IS} value={form.room}
                  onChange={e => setForm(f => ({ ...f, room: e.target.value }))} required>
                  <option value="">회의실 선택 *</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.name}>{r.name} (수용 {r.capacity}명)</option>
                  ))}
                </select>
                <textarea style={{ ...IS, resize: "vertical" }} placeholder="사용 목적 *" rows={3}
                  value={form.purpose}
                  onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} required />
              </div>
              {formError && <p style={{ fontSize: 13, color: "#ef4444", margin: "0 0 12px" }}>{formError}</p>}
              <button type="submit" disabled={submitting}
                style={{ background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "inherit" }}>
                {submitting ? "처리 중..." : "예약 신청하기"}
              </button>
            </form>
          </div>
        )
      )}

      {/* 관리자 패널 */}
      {adminUser && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>예약 신청 목록</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "pending", "approved", "rejected"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{ background: statusFilter === s ? "#1e3a5f" : "#f1f5f9", color: statusFilter === s ? "#fff" : "#64748b", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                  {s === "all" ? `전체 (${reservations.length})` : `${STATUS_LABEL[s]} (${reservations.filter(r => r.status === s).length})`}
                </button>
              ))}
            </div>
            <button onClick={fetchReservations} disabled={loadingRes}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: "#64748b", marginLeft: "auto", fontFamily: "inherit" }}>
              <RefreshCw size={12} /> 새로고침
            </button>
          </div>

          {loadingRes ? (
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 40 }}>불러오는 중...</p>
          ) : filtered.length === 0 ? (
            <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 40 }}>신청 내역이 없습니다.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(r => (
                <div key={r.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", cursor: "pointer", flexWrap: "wrap" }}>
                    <span style={{ background: STATUS_COLOR[r.status] + "22", color: STATUS_COLOR[r.status], fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, flexShrink: 0 }}>
                      {STATUS_LABEL[r.status]}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{r.name}</span>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{r.affiliation}</span>
                    <span style={{ fontSize: 13, color: "#475569", marginLeft: "auto" }}>{r.date}&nbsp;&nbsp;{r.start_time} ~ {r.end_time}</span>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{r.room}</span>
                    {expandedId === r.id ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
                  </div>
                  {expandedId === r.id && (
                    <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, color: "#475569", marginBottom: 16 }}>
                        <div><b>연락처:</b> {r.phone}</div>
                        <div><b>이메일:</b> {r.email}</div>
                        <div style={{ gridColumn: "1/-1" }}><b>사용 목적:</b> {r.purpose}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>신청일시: {new Date(r.created_at).toLocaleString("ko-KR")}</div>
                        {r.admin_note && <div style={{ fontSize: 11, color: "#64748b" }}>메모: {r.admin_note}</div>}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <input placeholder="관리자 메모 (선택)"
                          value={adminNote[r.id] !== undefined ? adminNote[r.id] : (r.admin_note || "")}
                          onChange={e => setAdminNote(n => ({ ...n, [r.id]: e.target.value }))}
                          style={{ ...IS, flex: 1, minWidth: 160 }} />
                        <button onClick={() => updateStatus(r.id, "approved")} disabled={updatingId === r.id}
                          style={{ display: "flex", alignItems: "center", gap: 4, background: "#10b981", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                          <Check size={13} /> 승인
                        </button>
                        <button onClick={() => updateStatus(r.id, "rejected")} disabled={updatingId === r.id}
                          style={{ display: "flex", alignItems: "center", gap: 4, background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                          <X size={13} /> 거절
                        </button>
                        <button onClick={() => deleteReservation(r.id, r.name)}
                          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "1px solid #e2e8f0", color: "#94a3b8", borderRadius: 6, padding: "8px 12px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", marginLeft: "auto" }}>
                          <Trash2 size={13} /> 삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 예약 유의사항 (맨 아래) ── */}
      <div style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: notesEd ? 12 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "#1e3a5f" }}>
            <Info size={16} color="#3b82f6" /> 예약 유의사항
          </div>
          {adminUser && !notesEd && (
            <button onClick={() => { setNotesText(notes.join("\n")); setNotesEd(true); }} style={ab()}>
              <Pencil size={12} /> 편집
            </button>
          )}
        </div>

        {notesEd ? (
          <div>
            <div style={{ fontSize: 12, color: "#64748b", margin: "8px 0 4px" }}>유의사항 (줄당 하나)</div>
            <textarea
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              style={{ ...IS_SM, width: "100%", height: 140, resize: "vertical" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
              <button onClick={() => setNotesEd(false)} style={ab()}>취소</button>
              <button onClick={saveNotes} disabled={saving} style={ab("primary")}>{saving ? "저장 중..." : "저장"}</button>
            </div>
          </div>
        ) : (
          <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {notes.map((note, i) => (
              <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                <span style={{ color: "#3b82f6", flexShrink: 0 }}>·</span>{note}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
