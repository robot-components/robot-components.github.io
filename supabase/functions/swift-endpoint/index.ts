// 메일 발송 Edge Function (Mailjet)
//
// 대시보드에 배포된 함수의 사본이다. 대시보드 표시 이름은 dynamic-function 이지만
// 호출 슬러그는 swift-endpoint 다 (supabase.functions.invoke("swift-endpoint")).
// 대시보드에서 코드를 고쳤다면 이 파일도 같이 갱신한다.
//
// 배포: Supabase 대시보드 → Edge Functions → dynamic-function → Code → Deploy
//       또는 npx supabase functions deploy swift-endpoint
//
// 환경변수(대시보드 Edge Functions → Secrets): MAILJET_API_KEY, MAILJET_SECRET_KEY

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MJ_KEY = Deno.env.get("MAILJET_API_KEY");
const MJ_SECRET = Deno.env.get("MAILJET_SECRET_KEY");
const ADMIN_EMAIL = "helprobot@keti.re.kr";
const FROM_EMAIL = "helprobot@keti.re.kr";
const FROM_NAME = "로봇융합부품지원센터";
const CENTER = "[로봇융합부품지원센터]";

const STYLE = `font-family: '맑은 고딕', 'Apple SD Gothic Neo', Arial, sans-serif; font-size: 14px; color: #222; line-height: 1.8;`;
const TD_L = `padding: 4px 20px 4px 0; white-space: nowrap; color: #444; vertical-align: top;`;
const TD_R = `padding: 4px 0; vertical-align: top;`;
const P = `margin: 0 0 16px 0;`;
const SEC = `margin: 0 0 8px 0; color: #444;`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
};

const val = (v) => (v != null && v !== "" ? v : "-");

const infoTable = (data) => `
  <table style="border-collapse: collapse;">
    <tr><td style="${TD_L}">신청자 :</td><td style="${TD_R}">${val(data.name)} (${val(data.affiliation)})</td></tr>
    <tr><td style="${TD_L}">일시 :</td><td style="${TD_R}">${val(data.date)} / ${val(data.start_time)} ~ ${val(data.end_time)}</td></tr>
    <tr><td style="${TD_L}">목적 :</td><td style="${TD_R}">${val(data.purpose)}</td></tr>
    <tr><td style="${TD_L}">연락처 :</td><td style="${TD_R}">${val(data.phone)}</td></tr>
    <tr><td style="${TD_L}">이메일 :</td><td style="${TD_R}">${val(data.email)}</td></tr>
  </table>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const { type, data } = await req.json();
  let to = "", toName = "", subject = "", html = "";

  if (type === "new_reservation") {
    // 겹치는 일정이 없어 자동 승인된 건만 관리자에게 전달된다.
    // (자동 거절 건은 신청자에게만 안내하므로 관리자 메일을 보내지 않는다)
    const isAuto = data.status === "approved";
    to = ADMIN_EMAIL;
    toName = "관리자";
    subject = isAuto
      ? `${CENTER} 회의실 예약 자동 승인 완료`
      : `${CENTER} 회의실 예약 신청 접수`;
    html = `
      <div style="${STYLE}">
        <p style="${P}">${isAuto
          ? "신청하신 시간에 겹치는 예약이 없어 자동으로 승인 처리되었습니다. 별도 조치는 필요하지 않습니다."
          : "새 회의실 예약 신청이 접수되었습니다."}</p>
        <p style="${SEC}">[ 예약 정보 ]</p>
        ${infoTable(data)}
      </div>`;

  } else if (type === "reservation_result") {
    const isApproved = data.status_label === "승인";
    const note = val(data.admin_note) !== "-" ? data.admin_note : "";
    to = data.to_email;
    toName = data.name;
    subject = `${CENTER} 회의실 예약 신청 ${data.status_label}`;
    html = `
      <div style="${STYLE}">
        <p style="${P}">${val(data.name)}님, 신청하신 회의실 예약이 ${val(data.status_label)}되었습니다.</p>
        <p style="${SEC}">[ 예약 정보 ]</p>
        ${infoTable(data)}
        ${note ? `
        <p style="${SEC} margin-top: 16px;">[ 안내 ]</p>
        <p style="margin: 0;">${note}</p>` : `
        <p style="margin: 16px 0 0 0;">${isApproved ? "회의실 이용 관련 문의 사항은" : "관련 문의 사항은"} <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>로 연락 부탁드립니다.</p>`}
      </div>`;

  } else {
    return new Response(JSON.stringify({ error: `unknown type: ${type}` }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const res = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${MJ_KEY}:${MJ_SECRET}`),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Messages: [{ From: { Email: FROM_EMAIL, Name: FROM_NAME }, To: [{ Email: to, Name: toName }], Subject: subject, HTMLPart: html }],
    }),
  });

  const result = await res.json();
  return new Response(JSON.stringify(result), { headers: { ...CORS, "Content-Type": "application/json" } });
});
