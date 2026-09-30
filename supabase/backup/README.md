# 데이터 백업

Supabase 무료 플랜에는 자동 백업이 없다. 프로젝트가 7일 미사용으로 정지되고
그 뒤 90일이 지나면 복구가 불가능해지므로, 사라지면 곤란한 것들을 여기에 보관한다.

## 들어 있는 것

| 파일 | 내용 |
|---|---|
| notices.json | 공지사항 (2026-09-15 기준 4건) |
| site_settings.json | 사이트 콘텐츠 — 회의실, 장비, KOLAS, 오시는 길 등 |
| faqs.json | FAQ |
| files/ | 공지사항 첨부파일 원본 PDF 4개 |

`files/` 의 PDF들은 Supabase Storage 의 notice-files 버킷에 올라가 있는 것과 같은 파일이다.
Storage 에는 백업이 없으므로 이곳이 유일한 예비본이다.

## 여기에 없는 것

**예약 내역(reservations)** 은 보관하지 않는다. 신청자 연락처가 포함되어 있는데
이 저장소는 공개(public)라 그대로 노출되기 때문이다.
필요하면 홈페이지 ADMIN 로그인 후 예약 목록에서 확인한다.

## 갱신 방법

콘텐츠를 크게 바꾼 뒤에는 다시 받아 두는 것이 좋다.

```
curl "https://srgpmgjzqaqddlcfebxu.supabase.co/rest/v1/notices?select=*" \
  -H "apikey: <anon 키>" -H "Authorization: Bearer <anon 키>" -o notices.json
```

anon 키는 `src/lib/supabase.js` 에 있다.
공지에 첨부파일을 새로 올렸다면 그 PDF도 `files/` 에 함께 넣어 둔다.
