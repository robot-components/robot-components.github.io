# 데이터 백업

Supabase 무료 플랜에는 자동 백업이 없어, 여기에 수동으로 내려받은 내용을 보관한다.
(프로젝트가 정지된 뒤 90일이 지나면 복구가 불가능하므로 이 파일이 유일한 기록이 된다.)

## 들어 있는 것 — 2026-09-15 기준

| 파일 | 내용 |
|---|---|
| notices.json | 공지사항 4건 (첨부파일은 URL만, 실제 파일은 Supabase Storage) |
| site_settings.json | 사이트 콘텐츠 6건 (회의실, 장비, KOLAS, 오시는 길 등) |
| faqs.json | FAQ (현재 0건) |

## 여기에 없는 것

**예약 내역(reservations)은 포함하지 않는다.** 신청자 이름·휴대폰·이메일이 들어 있는데
이 저장소는 공개(public)라 인터넷에 그대로 노출되기 때문이다.
예약 백업은 저장소 바깥 업무 폴더(`5_대외/rtac_backup/`)에 보관한다.

## 갱신 방법

콘텐츠를 크게 바꾼 뒤에는 다시 받아 두는 것이 좋다.

```
curl "https://srgpmgjzqaqddlcfebxu.supabase.co/rest/v1/notices?select=*" \
  -H "apikey: <anon 키>" -H "Authorization: Bearer <anon 키>" -o notices.json
```

anon 키는 `src/lib/supabase.js` 에 있다.
