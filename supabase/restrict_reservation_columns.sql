-- ============================================================
-- 예약자 개인정보(이름·연락처·이메일) 외부 노출 차단
--
-- 홈페이지 코드에 들어 있는 공개 키(anon)로 예약 테이블 전체를 조회하면
-- 신청자 이름·휴대폰·이메일까지 그대로 나온다. 공개 키는 누구나 꺼낼 수 있으므로
-- 사실상 외부에 열려 있는 상태다.
--
-- 달력과 신청 폼에 실제로 필요한 것은 날짜·시간·회의실·상태뿐이다.
-- 그 항목만 읽을 수 있도록 좁힌다.
-- 전체 정보는 ADMIN 로그인(authenticated)한 경우에만 보인다.
--
-- 적용 방법: Supabase 대시보드 → SQL Editor 에 붙여넣고 Run.
-- ============================================================

-- 공개 키는 달력 표시에 필요한 항목만 읽을 수 있다.
revoke select on public.reservations from anon;
grant  select (id, date, start_time, end_time, room, status)
  on public.reservations to anon;

-- 관리자(로그인 사용자)는 기존대로 전체 조회 가능해야 한다.
grant select on public.reservations to authenticated;

-- ── 되돌리는 방법 ────────────────────────────────────────────
-- 관리자 화면에 문제가 생기면 아래 한 줄로 원상복구된다.
--
--   grant select on public.reservations to anon;
