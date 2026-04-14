import { useState } from "react";
import { DEFAULT_NOTICES, DEFAULT_NOTICE_CATS } from "../data/defaults";
import PageHeader from "../components/PageHeader";

const NOTICE_HEADER = { label: "공지사항", title: "공지사항", sub: "센터 운영 관련 공지 및 사업 안내를 확인하세요." };

const noticeCatStyle = (cat, cats = []) => {
  const colors = ["#dbeafe,#1d4ed8","#dcfce7,#166534","#f3e8ff,#7e22ce","#fef3c7,#92400e","#fee2e2,#991b1b","#f1f5f9,#475569"];
  const idx = cats.indexOf(cat);
  const [bg, color] = (colors[idx >= 0 ? idx % colors.length : 0]).split(",");
  return { fontSize: 11, padding: "2px 8px", borderRadius: 10, flexShrink: 0, background: bg, color };
};

export default function NoticePage() {
  const notices = DEFAULT_NOTICES;
  const noticeCats = DEFAULT_NOTICE_CATS;
  const [noticeCat, setNoticeCat] = useState("전체");
  const [noticeDetail, setNoticeDetail] = useState(null);

  const filteredNotices = noticeCat === "전체" ? notices : notices.filter((n) => n.cat === noticeCat);

  return (
    <div>
      <PageHeader label={NOTICE_HEADER.label} title={NOTICE_HEADER.title} sub={NOTICE_HEADER.sub} />

      {/* 카테고리 필터 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["전체", ...noticeCats].map((c) => (
          <button
            key={c}
            onClick={() => setNoticeCat(c)}
            style={{ background: noticeCat === c ? "#1e3a5f" : "#fff", color: noticeCat === c ? "#fff" : "#475569", border: `1px solid ${noticeCat === c ? "#1e3a5f" : "#e2e8f0"}`, padding: "7px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: noticeCat === c ? 600 : 400 }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 공지 상세 or 목록 */}
      {noticeDetail ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 32 }}>
          <button onClick={() => setNoticeDetail(null)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "inherit", padding: 0 }}>← 목록으로 돌아가기</button>
          <span style={noticeCatStyle(noticeDetail.cat, noticeCats)}>{noticeDetail.cat}</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: "12px 0 6px", lineHeight: 1.4 }}>{noticeDetail.title}</h2>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>{noticeDetail.date}</div>
          <div style={{ borderTop: "0.5px solid #f1f5f9", paddingTop: 24, fontSize: 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap", textAlign: "left" }}>{noticeDetail.body}</div>
        </div>
      ) : (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
          {filteredNotices.map((n, idx) => (
            <div key={n.id} style={{ background: "#fff", borderBottom: idx < filteredNotices.length - 1 ? "0.5px solid #f1f5f9" : "none", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer", minWidth: 0 }} onClick={() => setNoticeDetail(n)}>
                <span style={noticeCatStyle(n.cat, noticeCats)}>{n.cat}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{n.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
