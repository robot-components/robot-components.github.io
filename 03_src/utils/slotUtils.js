// 09:00 ~ 18:00, 30분 단위 슬롯 (분 단위)
export const HALF_SLOTS = Array.from({ length: 19 }, (_, i) => 9 * 60 + i * 30);

export const slotLabel = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${min % 60 === 0 ? "00" : "30"}`;
