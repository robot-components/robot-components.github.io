export const DEFAULT_HERO = {
  title: "로봇융합부품지원센터",
  sub: "국내 로봇산업 경쟁력 강화를 위한 원스톱 지원체계",
  badges: "산업혁신기반구축사업,생활지원을 위한 서비스로봇 부품 기술지원 기반구축",
  btn1Label: "보유 장비 목록 →",
  btn1Page: 2,
  btn2Label: "회의실 예약",
  btn2Page: 3,
};

export const DEFAULT_INTRO = {
  text: "로봇융합부품지원센터는 국내 로봇산업 경쟁력 강화를 위해 로봇부품 산업의 기반 조성 및 장비 구축 등 중소 로봇부품기업의 역량 강화를 위한 원스톱 지원체계 구축을 목표로 다음과 같은 사업을 수행하고 있습니다.",
};

export const SUPPORT_COLORS = ["#1e3a5f","#2d5986","#3b82f6","#0f766e","#7c3aed","#b45309"];

export const DEFAULT_SUPPORT = [
  { id: 1, title: "종합지원센터", color: "#1e3a5f", items: ["중소 로봇부품기업 전주기적 지원","시스템-부품 기업 네트워크 구축 지원","로봇부품기업 제품의 국내·외 마케팅 지원"] },
  { id: 2, title: "장비구축", color: "#2d5986", items: ["로봇부품 전용 시험평가 장비 개발 및 구축","로봇부품 전용 시험평가 오픈랩 구축"] },
  { id: 3, title: "장비지원", color: "#3b82f6", items: ["로봇부품 시험평가 인증체계(KOLAS) 구축","사업화 가능한 로봇부품의 장비연계 제품화 지원"] },
];

export const DEFAULT_WORKS = [
  {
    id: 1, num: "01", title: "신뢰성 평가 인증을 통한 로봇부품 상용화 지원", page: 1, pageLabel: "KOLAS 인정 규격 안내 →",
    blocks: [
      { type: "section", text: "KOLAS 인정기관 구축" },
      { type: "bullet", text: "로봇부품의 신뢰성 확보를 위해 기업에 요구되는 관련 규격(KS, IEC, ISO 등)을 지원하는 구동기 분야 및 머니퓰레이팅 로봇 성능 시험 분야 KOLAS 인정기관 구축" },
      { type: "section", text: "기술 개발 컨설팅" },
      { type: "bullet", text: "기업의 기술 개발 시 애로 기술 해결을 위한 기술 자문" },
      { type: "section", text: "시험성적서 발급" },
      { type: "bullet", text: "KOLAS 인정 규격 외 로봇 관련 부품에 대한 시험 후 성적서 발급" },
    ],
  },
  {
    id: 2, num: "02", title: "구축 장비를 활용한 로봇융합부품 평가", page: 2, pageLabel: "보유 장비 목록 →",
    blocks: [
      { type: "section", text: "범용 시험" },
      { type: "bullet", text: "속도 / 토크제어 / 온도포화 시험" },
      { type: "bullet", text: "모터 특성 시험" },
      { type: "section", text: "로봇 액추에이터 시험" },
      { type: "bullet", text: "속도, 전류, 토크 등 성능 측정" },
      { type: "bullet", text: "부하 특성, 센서 성능 측정" },
      { type: "bullet", text: "신뢰성 시험" },
      { type: "section", text: "환경 시험" },
      { type: "bullet", text: "챔버를 이용한 -40 ~ 150 ℃ 시험" },
    ],
  },
];

export const DEFAULT_PROCESS = [
  { id: 1, step: "01", title: "시험 의뢰 문의", desc: "시험 가능 여부, 일정, 비용 등\n담당자 상담 후 시험의뢰서 작성" },
  { id: 2, step: "02", title: "장비 사용", desc: "시험의뢰서 승인에 따라\n장비 사용 및 장비사용대장 작성" },
  { id: 3, step: "03", title: "장비사용결과서 작성", desc: "장비 사용 완료 후\n장비사용결과서 작성" },
  { id: 4, step: "04", title: "시험성적서 발급", desc: "시험성적서 발급 요청 시\n시험성적서 파일링" },
  { id: 5, step: "05", title: "견적서 발행 및 종료", desc: "최종 견적서 및 세금계산서\n발행 후 시험 절차 종료" },
];

export const DEFAULT_LOCATION = {
  address: "경기도 부천시 원미구 평천로 655 (약대동)\n부천테크노파크 4단지 401동 1402-1호",
  email: "helprobot@keti.re.kr",
  website: "www.helprobot.re.kr",
  mapSrc: "https://map.kakao.com/link/embed/map?center=126.7804,37.4876&level=3&markers=126.7804,37.4876,부천테크노파크4단지",
};

export const DEFAULT_SITE = {
  centerName: "로봇융합부품지원센터",
  centerNameEn: "Robot Test and Approval Center (RTAC)",
  kolasSummary: "KOLAS(Korea Laboratory Accreditation Scheme)는 국가기술표준원이 운영하는 시험·교정기관 인정 제도입니다. KOLAS 인정을 받은 기관에서 발급한 성적서는 국제 상호인정 협정(MRA)에 따라 국제적으로 효력이 인정됩니다.",
};

export const DEFAULT_EQUIPMENT = [
  {
    id: 1, cat: "액추에이터", name: "10 N·m 이하급 로봇 액추에이터 성능 분석기", image: "/images/equipment/actuator-10nm.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0148978&search_value=10Nm&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "고속축", rows: [{ label: "모터 용량", value: "1.41 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 4,200 min⁻¹" },{ label: "토크센서 토크 범위", value: "1 N·m" },{ label: "토크센서 정확도", value: "0.1 % F.S." }] },
      { section: "저속축", rows: [{ label: "모터 용량", value: "5.1 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 250 min⁻¹" },{ label: "토크센서 토크 범위", value: "10 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." }] },
      { section: "온습도 챔버", rows: [{ label: "온도 범위", value: "-40 ~ 150 ℃" },{ label: "습도 범위", value: "30 ~ 95 % R.H." }] },
    ],
    uses: "전압, 전류, 토크, 회전속도 등 기본 성능 측정 및 데이터 분석\n구동 응답 및 위치 제어 성능 측정\n제동 토크, 응답 시간 측정 및 브레이크 제어 특성 평가\n실제 운용 환경 재현 및 환경 변화에 따른 성능 변화 시험",
  },
  {
    id: 2, cat: "액추에이터", name: "50 N·m 급 로봇 액추에이터 성능 분석기", image: "/images/equipment/actuator-50nm.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0034005&search_value=50Nm&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "고속축", rows: [{ label: "모터 용량", value: "1.7 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 4,200 min⁻¹" },{ label: "토크센서 토크 범위", value: "5 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." }] },
      { section: "저속축", rows: [{ label: "모터 용량", value: "2.1 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 250 min⁻¹" },{ label: "토크센서 토크 범위", value: "100 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." }] },
      { section: "온습도 챔버", rows: [{ label: "온도 범위", value: "-40 ~ 150 ℃" },{ label: "습도 범위", value: "30 ~ 95 % R.H." }] },
    ],
    uses: "전압, 전류, 토크, 회전속도 등 기본 성능 측정 및 데이터 분석\n구동 응답 및 위치 제어 성능 측정\n제동 토크, 응답 시간 측정 및 브레이크 제어 특성 평가\n실제 운용 환경 재현 및 환경 변화에 따른 성능 변화 시험",
  },
  {
    id: 3, cat: "액추에이터", name: "150 N·m 급 로봇 액추에이터 성능 분석기", image: "/images/equipment/actuator-150nm.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0067977&search_value=50Nm&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "고속축", rows: [{ label: "모터 용량", value: "4.9 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 4,200 min⁻¹" },{ label: "토크센서 토크 범위", value: "50 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." }] },
      { section: "저속축", rows: [{ label: "모터 용량", value: "4.1 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 250 min⁻¹" },{ label: "토크센서 토크 범위", value: "200 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." }] },
      { section: "온습도 챔버", rows: [{ label: "온도 범위", value: "-40 ~ 150 ℃" },{ label: "습도 범위", value: "30 ~ 95 % R.H." }] },
    ],
    uses: "전압, 전류, 토크, 회전속도 등 기본 성능 측정 및 데이터 분석\n구동 응답 및 위치 제어 성능 측정\n제동 토크, 응답 시간 측정 및 브레이크 제어 특성 평가\n실제 운용 환경 재현 및 환경 변화에 따른 성능 변화 시험",
  },
  {
    id: 4, cat: "액추에이터", name: "800 N·m 급 로봇 액추에이터 성능 분석기", image: "/images/equipment/actuator-800nm.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0148977&search_value=800Nm&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "저속축", rows: [{ label: "모터 용량", value: "31.1 kW" },{ label: "모터 회전 속도 범위", value: "10 ~ 200 min⁻¹" },{ label: "토크센서 토크 범위", value: "800 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." }] },
      { section: "온습도 챔버", rows: [{ label: "온도 범위", value: "-40 ~ 150 ℃" },{ label: "습도 범위", value: "30 ~ 95 % R.H." }] },
    ],
    uses: "전압, 전류, 토크, 회전속도 등 기본 성능 측정 및 데이터 분석\n구동 응답 및 위치 제어 성능 측정\n제동 토크, 응답 시간 측정 및 브레이크 제어 특성 평가\n실제 운용 환경 재현 및 환경 변화에 따른 성능 변화 시험",
  },
  {
    id: 5, cat: "감속기", name: "500 N·m 급 로봇 감속기 성능 시험기", image: "/images/equipment/reducer-500nm.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0190303&search_value=500Nm&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "입력축", rows: [{ label: "모터 회전 속도 범위", value: "10 ~ 4,200 min⁻¹" },{ label: "토크센서 토크 범위", value: "50 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." },{ label: "엔코더 분해능", value: "0.82 arc.sec" },{ label: "엔코더 시스템 정확도", value: "±1.7 arc.sec" }] },
      { section: "출력축", rows: [{ label: "모터 회전 속도 범위", value: "10 ~ 400 min⁻¹" },{ label: "토크센서 토크 범위", value: "500 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." },{ label: "엔코더 분해능", value: "0.08 arc.sec" },{ label: "엔코더 시스템 정확도", value: "±1.7 arc.sec" }] },
      { section: "온습도 챔버", rows: [{ label: "온도 범위", value: "-20 ~ 120 ℃" },{ label: "습도 범위", value: "0 ~ 100 % R.H." }] },
    ],
    uses: "히스테리시스곡선을 이용한 백래시, 로스트모션, 토크 강성 측정\n각도 전달 오차 및 속도비(감속비) 측정\n무부하 러닝 토크 측정\n효율 측정 및 환경 시험",
  },
  {
    id: 6, cat: "감속기", name: "로봇용 고정밀 감속기 성능 시험기", image: "/images/equipment/reducer-fixed.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0148975&search_value=%EA%B3%A0%EC%A0%95%EB%B0%80&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "입력축", rows: [{ label: "모터 회전 속도 범위", value: "2 ~ 4,200 min⁻¹" },{ label: "토크센서 토크 범위", value: "2 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." },{ label: "엔코더 분해능", value: "1.44 arc.sec" },{ label: "엔코더 시스템 정확도", value: "±2.4 arc.sec" }] },
      { section: "출력축", rows: [{ label: "모터 회전 속도 범위", value: "2 ~ 100 min⁻¹" },{ label: "토크센서 토크 범위", value: "100 N·m" },{ label: "토크센서 정확도", value: "0.05 % F.S." },{ label: "엔코더 분해능", value: "0.14 arc.sec" },{ label: "엔코더 시스템 정확도", value: "±1.4 arc.sec" }] },
    ],
    uses: "히스테리시스곡선을 이용한 백래시, 로스트모션, 토크 강성 측정\n각도 전달 오차 및 속도비(감속비) 측정\n무부하 러닝 토크 및 기동·증속기동 토크 측정\n효율 측정",
  },
  {
    id: 7, cat: "로봇", name: "6자유도 로봇 머니플레이터 성능 측정 시스템", image: "/images/equipment/robot-6dof-manipulator.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0069146&search_value=6%EC%9E%90%EC%9C%A0%EB%8F%84&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "Laser Tracker (AT960-MR)", rows: [{ label: "Angle Accuracy", value: "±15 μm + 6 μm/m" },{ label: "Distance Accuracy", value: "0.5 μm/m" },{ label: "데이터 출력", value: "1,000 point/sec" },{ label: "측정 거리", value: "40 m (Red Ring Reflector 사용 시)" },{ label: "측정 범위", value: "수평각 360°, 수직각 ±145°" }] },
      { section: "Red Ring Reflector (3축; X, Y, Z)", rows: [{ label: "크기", value: "지름 1.5 inch, 0.5 inch" },{ label: "Acceptance Angle", value: "±30 °" }] },
      { section: "T-MAC (6축; X, Y, Z, Yaw, Pitch, Roll)", rows: [{ label: "위치 정밀도", value: "±15 μm + 6 μm/m" },{ label: "일반 회전 정밀도", value: "±0.01°" }] },
    ],
    uses: "KS B ISO 9283 분석 SW 지원\n포즈/거리 정확도 및 반복 정밀도 측정\n측정 Point(X,Y,Z) 간 거리 및 다양한 로봇의 Tool 변위 측정\n로봇 Tool 위치 캘리브레이션",
  },
  {
    id: 8, cat: "로봇", name: "모바일 로봇의 구동부품 진동 측정 장비", image: "/images/equipment/robot-mobile-vibration.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0242238&search_value=%EB%AA%A8%EB%B0%94%EC%9D%BC&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "고속 카메라 및 듀얼 고속 카메라", rows: [{ label: "Frame Rate", value: "기본 120 fps (최대 1,300 fps, 최소 해상도 조건)" },{ label: "주파수 범위", value: "기본 60 Hz, 최대 650 Hz" },{ label: "최소 측정 범위", value: "0.25 μm @ 1 m (50 mm 렌즈 사용 시, 최대 밝기 조건)" },{ label: "XY-axis", value: "0.25 μm @ 1 m (50 mm 렌즈 사용 시)//0.125 μm (근거리 초점 시)" },{ label: "Z-axis", value: "15.24 μm @ 1 m (50 mm 렌즈 사용 시)" },{ label: "통신 인터페이스", value: "USB 3.0" }] },
      { section: "렌즈", rows: [{ label: "초점 거리", value: "6 / 12.5 / 25 / 50 / 100 mm" }] },
      { section: "조명 장치", rows: [{ label: "LED 투광 조명", value: "최대 20,000 Lux" }] },
    ],
    uses: "로봇 구동부, 샤프트, 베어링, 감속기 등 회전체의 진동 분석\n구조물(프레임, 링크 등) 변형 및 거동 모드 분석\n시험 장비의 정합성 검증 및 실증 환경 진동 특성 평가",
  },
  {
    id: 9, cat: "테스트베드", name: "자율주행센서 성능평가용 주행 환경 테스트베드", image: "/images/equipment/testbed-autonomous-driving.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0200956&search_value=%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%B2%A0%EB%93%9C&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "카메라", rows: [{ label: "구성", value: "모션캡처 카메라 16대" },{ label: "Sampling Rate", value: "200 Hz 이상" },{ label: "추적 대상", value: "최대 2대의 이동 로봇 동시 위치 자세(6DoF) 추적 가능" }] },
      { section: "환경", rows: [{ label: "시험 구역 크기", value: "가로 6 m, 세로 12 m" },{ label: "조도 조건", value: "50 ~ 1,000 Lux" },{ label: "온도 조건", value: "20 ± 2 ℃" },{ label: "바닥 환경", value: "무광 타일 마감 (광반사 최소화 및 센서 오차 저감 설계)" }] },
      { section: "장애물", rows: [{ label: "장애물 형상", value: "벽체, 테이블, 소형 및 대형 원통 등" },{ label: "제어 방식", value: "3축 겐트리 로봇을 이용한 정밀 이동 가능" }] },
    ],
    uses: "다양한 환경 조건을 재현하여 자율주행 로봇의 성능 평가\n정적·동적 장애물 회피 시나리오를 통해 센서 인식 및 제어 알고리즘 성능 검증",
  },
  {
    id: 10, cat: "테스트베드", name: "생활지원 서비스로봇의 복합작업 성능 평가 환경 시스템", image: "/images/equipment/testbed-service-robot.jpg", youtube: "", itube: "https://www.itube.or.kr/aplct/equipSrch/sharingView.do?g_menu_id=MNID210100&equip_root=use&equip_no=EPN0248174&search_value=%EC%83%9D%ED%99%9C%EC%A7%80%EC%9B%90&search_etube_no=&search_equip_class_cd_1=&search_equip_class_cd_2=&search_equip_class_cd_3=&search_purpose_cd_1=&search_purpose_cd_2=&search_idle_cd=&search_postlist=%EA%B2%BD%EA%B8%B0%EB%8F%84&search_postlist_2=&search_cpny_nm=%ED%95%9C%EA%B5%AD%EC%A0%84%EC%9E%90%EA%B8%B0%EC%88%A0%EC%97%B0%EA%B5%AC%EC%9B%90&search_cpny_id=00008805&pageIndex=1&is_recent_equip_list=E",
    specs: [
      { section: "환경", rows: [{ label: "면적", value: "약 24평 (약 80 m²)" },{ label: "조도", value: "10 ~ 1,000 Lux" },{ label: "온습도", value: "실내 환경 조건 유지" },{ label: "공간", value: "실제 가정집과 유사한 인테리어 및 동선 설계" }] },
      { section: "구성요소", rows: [{ label: "실 구획", value: "거실, 부엌, 안방, 서재, 현관, 화장실, 팬트리, 세탁실, 드레스룸//총 9개" },{ label: "비품 배치", value: "각 공간 용도에 맞는 가구, 가전, 생활소품 등" },{ label: "카메라", value: "천정 고정식 고정밀 로봇 위치 추적 카메라 16대,//사각지대 보완용 이동식 영상 데이터 수집 카메라 20대" },{ label: "데이터 수집 인프라", value: "영상, 위치, 음성, 환경 센서 데이터 동기화 수집 및 저장" }] },
    ],
    uses: "실제 가정 환경과 동일한 구조를 구현하여 생활지원 로봇 실사용 성능 평가\n이동, 인식, 조작 등 다양한 서비스 동작을 실환경에서 검증",
  },
];

export const DEFAULT_KOLAS = [
  { id: 1, code: "KS B ISO 9283", title: "산업용 머니플레이팅 로봇 성능 항목 및 시험방법", target: "산업용 로봇 완성품 및 로봇 암 제조사, 성능 인증이 필요한 협동로봇 기업", desc: "로봇의 포즈 정확도, 반복 정밀도, 경로 정확도 등 핵심 성능 항목 측정 방법을 규정합니다." },
  { id: 2, code: "KS C IEC 60034-1", title: "회전기기 제1부: 정격 및 성능", target: "모터, 발전기 등 회전기기 제조사, 로봇 액추에이터 모듈 개발 기업", desc: "회전기기의 정격, 성능, 시험 방법에 관한 기본 요구사항을 규정합니다." },
  { id: 3, code: "KS C IEC 60034-2-1", title: "회전기기 제2-1부: 손실 및 효율을 측정하는 표준 시험방법", target: "고효율 모터 개발 기업, 에너지 효율 인증이 필요한 로봇 부품 기업", desc: "회전기기의 손실 및 효율을 측정하기 위한 표준 시험방법을 규정합니다." },
];

export const DEFAULT_ROOMS = [
  { id: 1, name: "제1회의실", capacity: 10, facilities: "빔프로젝터, 화이트보드, 모니터, 화상회의 시스템" },
  { id: 2, name: "제2회의실", capacity: 6, facilities: "모니터, 화이트보드, 노트북 연결 포트" },
  { id: 3, name: "제3회의실", capacity: 20, facilities: "대형 스크린, 빔프로젝터, 마이크 시스템, 화이트보드" },
];

export const DEFAULT_NOTICE_CATS = ["공지","장비안내","사업안내"];

export const DEFAULT_NOTICES = [
  { id: 1, cat: "공지", title: "2025년 로봇융합부품지원센터 장비 활용 지원사업 안내", date: "2025-03-10", body: "2025년도 장비 활용 지원사업을 안내드립니다." },
  { id: 2, cat: "장비안내", title: "800 N·m 급 로봇 액추에이터 성능 분석기 신규 도입 완료", date: "2025-02-28", body: "800 N·m 급 로봇 액추에이터 성능 분석기가 신규 도입되었습니다." },
  { id: 3, cat: "사업안내", title: "KOLAS 인정 규격 확대 추진 안내", date: "2025-02-10", body: "로봇융합부품지원센터는 기존 KOLAS 인정 규격 외 추가 규격 확대를 추진 중입니다." },
];

export const DEFAULT_FAQ_CATS = ["이용 안내","장비 시험","인증","비용 및 일정"];

export const DEFAULT_FAQS = [
  { id: 1, cat: "이용 안내", q: "장비를 이용하려면 어떻게 해야 하나요?", a: "이메일(helprobot@keti.re.kr)로 시험 가능 여부, 일정, 비용 등을 문의하신 후 시험의뢰서를 작성하시면 됩니다." },
  { id: 2, cat: "이용 안내", q: "이용 비용은 어떻게 되나요?", a: "장비 사용 비용은 시험 항목 및 시간에 따라 달라집니다." },
  { id: 3, cat: "장비 시험", q: "시험 소요 기간은 얼마나 걸리나요?", a: "단순 성능 측정의 경우 1~3일, 복합 시험의 경우 1~2주가 소요됩니다." },
  { id: 4, cat: "장비 시험", q: "시험 후 성적서를 발급받을 수 있나요?", a: "KOLAS 인정 규격에 따른 공인 시험성적서를 발급해 드립니다. 시험 완료 후 약 5~7 영업일이 소요됩니다." },
  { id: 5, cat: "인증", q: "KOLAS 인정기관이란 무엇인가요?", a: "한국인정기구가 운영하는 국가 공인 시험·교정 기관 인정 제도입니다." },
  { id: 6, cat: "인증", q: "어떤 인정 규격을 지원하나요?", a: "KS B ISO 9283, KS C IEC 60034-1, KS C IEC 60034-2-1 규격을 지원합니다." },
  { id: 7, cat: "비용 및 일정", q: "회의실 예약은 어떻게 하나요?", a: "홈페이지 '회의실 예약' 메뉴에서 온라인으로 신청하실 수 있습니다." },
  { id: 8, cat: "비용 및 일정", q: "회의실 사용 비용이 있나요?", a: "센터 이용 기업 및 관련 기관에 한해 무료로 제공됩니다." },
];

export const DEFAULT_EQ_CATS = ["액추에이터","감속기","로봇","테스트베드"];
