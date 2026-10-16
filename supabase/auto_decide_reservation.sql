-- ============================================================
-- 회의실 예약 자동 승인 / 자동 거절
--
-- 예약이 접수되면 같은 회의실·같은 날짜의 기존 예약과 시간이 겹치는지
-- DB에서 직접 판정한다.
--   겹치지 않으면 → approved (자동 승인)
--   겹치면        → rejected (자동 거절) + 재신청 안내 문구 기록
--
-- 겹침 판정: 신청시작 < 기존종료 AND 신청종료 > 기존시작
--   → 10:00~12:00 과 12:00~16:00 처럼 맞닿은 예약은 겹침이 아니다.
--
-- 적용 방법: Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 Run.
--            여러 번 실행해도 안전하다(기존 것을 교체한다).
-- ============================================================

create or replace function public.auto_decide_reservation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  overlap_count int;
  reject_note constant text :=
    '신청하신 시간대에 이미 예약이 있어 자동으로 거절되었습니다. '
    || '다른 시간대로 다시 신청해 주시기 바랍니다. '
    || '일정 조정이 필요하시면 helprobot@keti.re.kr 로 연락 주시기 바랍니다.';
begin
  -- 같은 회의실·같은 날짜에 대한 동시 접수를 순서대로 처리한다.
  -- 이것이 없으면 두 건이 동시에 들어올 때 서로를 보지 못해 둘 다 승인될 수 있다.
  perform pg_advisory_xact_lock(hashtext(new.room || '|' || new.date::text));

  select count(*)
    into overlap_count
    from public.reservations r
   where r.room = new.room
     and r.date = new.date
     and r.status in ('pending', 'approved')
     and r.start_time < new.end_time
     and r.end_time   > new.start_time;

  if overlap_count > 0 then
    new.status     := 'rejected';
    new.admin_note := reject_note;
  else
    new.status     := 'approved';
    new.admin_note := coalesce(new.admin_note, '');
  end if;

  return new;
end;
$$;

-- INSERT 에만 걸린다. 관리자가 나중에 수동으로 승인/거절을 바꾸는 UPDATE 는
-- 이 트리거의 영향을 받지 않으므로, 예외 상황은 관리자가 그대로 처리할 수 있다.
drop trigger if exists trg_auto_decide_reservation on public.reservations;

create trigger trg_auto_decide_reservation
  before insert on public.reservations
  for each row
  execute function public.auto_decide_reservation();
