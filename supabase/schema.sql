-- ============================================================
-- RTAC 사이트 Supabase 스키마 (참고용 재구성본)
--
-- ⚠️ 이 파일은 권한 있는 덤프가 아니다. anon 키로 조회한 실제 행과
--    애플리케이션 코드(src/pages/*.jsx)를 근거로 재구성한 것이며,
--    컬럼 타입 / 기본값 / 제약조건은 추정값이다(권한은 실측 확인).
--    정식 백업은 Supabase 대시보드의 "Download backups" 를 사용할 것.
--    (작성 시점: 2026-08-21 / 프로젝트 정지 복구 직후)
-- ============================================================

-- ── 공지사항 ──────────────────────────────────────────────
create table if not exists public.notices (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  cat         text,                  -- 공지 / 양식 등 (UI에서 자유 입력)
  pinned      boolean default false, -- 상단 고정
  date        date,                  -- 게시일 (앱에서 YYYY-MM-DD 문자열로 기록)
  files       jsonb default '[]'::jsonb,  -- [{ name, url }]
  order_idx   integer default 0,     -- 목록 정렬 순서 (드래그로 변경)
  created_at  timestamptz default now()
);

-- ── 사이트 설정 (CMS 콘텐츠) ──────────────────────────────
-- 실제 사용 중인 key: location, notice_contact, works,
--                    reservation_rooms, equipment_items, kolas_items
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz default now()
);

-- ── 회의실 예약 ───────────────────────────────────────────
-- 컬럼 목록은 코드(ReservationPage.jsx의 form / select)에서 도출.
-- 복구 시점에 행이 0건이어서 실측 확인은 불가.
create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  start_time  text not null,
  end_time    text not null,
  room        text,
  status      text default 'pending',  -- pending / approved / rejected
  admin_note  text,
  created_at  timestamptz default now()
);

-- ── FAQ ───────────────────────────────────────────────────
-- 복구 시점에 행 0건. 컬럼은 FaqPage.jsx 확인 후 보완 필요.
create table if not exists public.faqs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now()
);

-- ── Storage 버킷 ──────────────────────────────────────────
-- notice-files : 공지 첨부파일 (public read)
--   대시보드 Storage 메뉴에서 생성하고 Public 으로 설정한다.

-- ── RLS / 권한 (2026-08-21 실측 확인) ──────────────────────
-- anon(공개) 역할은 읽기만 가능하고, UPDATE / DELETE 는 거부된다.
--   → 시도 시 42501 permission denied 반환 (0건 대상으로 실제 확인)
-- 관리자 기능은 supabase.auth.signInWithPassword 로 로그인한
-- authenticated 역할의 JWT 로 동작한다 (src/App.jsx:54).
-- reservations INSERT 만 anon 에게 열려 있어야 한다 (예약 신청 폼).
