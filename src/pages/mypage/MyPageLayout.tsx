import { NavLink, Outlet } from 'react-router-dom';
import { PawPrint, UserCircle2, Heart, HandHeart, FileText, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/authStore';

// 마이페이지 공통 레이아웃 — 좌측 탭 메뉴 + 우측 콘텐츠(Outlet).
// 탭은 중첩 라우트로 구성: 각 탭 = 하나의 파일 = 하나의 URL — 도메인 담당자가 본인 탭 파일만 채우면 된다.
// 디자인: 크림 배경 + 흰 카드(rounded-2xl border-border) + 골드 액센트 — AuthCard/메인 검색바와 동일 재질.
const MYPAGE_TABS = [
  { to: '/mypage', label: '내 정보', Icon: UserCircle2, end: true },      // index 탭 — end로 정확 매칭
  { to: '/mypage/likes', label: '좋아요한 아이들', Icon: Heart, end: false },
  { to: '/mypage/fosters', label: '임시보호 신청 내역', Icon: HandHeart, end: false },
  { to: '/mypage/posts', label: '내가 쓴 글', Icon: FileText, end: false },
  { to: '/mypage/comments', label: '내가 쓴 댓글', Icon: MessageSquare, end: false },
];

export function MyPageLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row">
        {/* ── 좌측: 프로필 요약 + 탭 메뉴 ── */}
        <aside className="w-full shrink-0 md:w-60">
          <div className="rounded-2xl border border-border bg-white p-5">
            {/* 프로필 요약 */}
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
                <PawPrint size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-foreground">{user?.nickname}님</p>
                <p className="text-sm text-muted-foreground">마이페이지</p>
              </div>
            </div>

            {/* 탭 메뉴 — NavLink가 현재 경로와 매칭해 활성 스타일 자동 적용 */}
            <nav className="space-y-1" aria-label="마이페이지 메뉴">
              {MYPAGE_TABS.map(({ to, label, Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-base transition-colors ${
                      isActive
                        ? 'bg-primary/15 font-semibold text-ring'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`
                  }
                >
                  <Icon size={17} className="shrink-0" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── 우측: 탭 콘텐츠 ── */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/** 담당자 작업 전 임시 화면 — 각 탭 파일이 이 껍데기를 실제 목록으로 교체하면 된다 */
export function TabPlaceholder({ title, owner, guide }: { title: string; owner: string; guide: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-8">
      <h2 className="mb-2 text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/50 py-14 text-center">
        <PawPrint size={32} className="text-muted-foreground/50" />
        <p className="text-base text-muted-foreground">아직 준비 중인 페이지예요.</p>
        <p className="text-sm text-muted-foreground/70">
          담당: {owner} — {guide}
        </p>
      </div>
    </div>
  );
}