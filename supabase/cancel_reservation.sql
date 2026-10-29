-- ============================================================
-- 신청자 본인 예약 취소
--
-- 승인 메일에 담긴 취소 링크로만 취소할 수 있게 한다.
-- 링크에는 예약마다 다른 임의의 열쇠(cancel_token)가 들어 있고,
-- 이 열쇠는 외부에서 조회할 수 없다.
--
-- 예약 고유번호(id)는 공개 키로 조회가 가능하므로 열쇠로 쓰면 안 된다.
-- (누구나 남의 예약을 취소할 수 있게 된다)
--
-- 적용 방법: Supabase 대시보드 → SQL Editor 에 붙여넣고 Run.
-- ============================================================

-- 취소용 열쇠. 기존 예약은 null 이며 취소 링크가 발송된 적이 없으므로 취소되지 않는다.
alter table public.reservations
  add column if not exists cancel_token uuid;

-- 열쇠로 조회가 빠르도록
create index if not exists reservations_cancel_token_idx
  on public.reservations (cancel_token);

-- ※ cancel_token 은 anon 의 select 권한 목록에 없으므로 외부에서 읽을 수 없다.
--   (restrict_reservation_columns.sql 에서 컬럼 단위로 권한을 준 상태)

-- ── 취소 처리 ────────────────────────────────────────────────
-- 열쇠를 아는 사람만 실행할 수 있다. 취소된 예약의 시간대는 다시 예약 가능해진다
-- (자동 판정 트리거가 pending/approved 만 겹침으로 보기 때문).
create or replace function public.cancel_reservation(token uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.reservations;
begin
  if token is null then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;

  select * into r from public.reservations where cancel_token = token;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  if r.status = 'cancelled' then
    return jsonb_build_object('ok', true, 'already', true,
      'name', r.name, 'affiliation', r.affiliation, 'phone', r.phone, 'email', r.email,
      'date', r.date, 'start_time', r.start_time, 'end_time', r.end_time,
      'room', r.room, 'purpose', r.purpose);
  end if;

  if r.status <> 'approved' then
    return jsonb_build_object('ok', false, 'reason', 'not_active');
  end if;

  update public.reservations
     set status = 'cancelled'
   where id = r.id;

  -- 취소한 본인에게 돌려주는 값이므로 본인 정보를 포함해도 된다.
  -- (취소 완료 화면 표시 + 관리자 알림 메일 구성에 쓰인다)
  return jsonb_build_object('ok', true, 'already', false,
    'name', r.name, 'affiliation', r.affiliation, 'phone', r.phone, 'email', r.email,
    'date', r.date, 'start_time', r.start_time, 'end_time', r.end_time,
    'room', r.room, 'purpose', r.purpose);
end;
$$;

revoke all on function public.cancel_reservation(uuid) from public;
grant execute on function public.cancel_reservation(uuid) to anon, authenticated;
