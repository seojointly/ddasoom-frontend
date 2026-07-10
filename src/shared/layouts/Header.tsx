import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/stores/authStore';
import { logout } from '@/features/auth/api/authApi';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';

// 전역 헤더 — 피그마 메인 디자인의 메가메뉴 구조를 프로젝트 컨벤션(테마 토큰)으로 재구현.
// 레이아웃: [로고 w-36 고정] [네비 flex-1 4등분] [인증영역 w-48 고정] — 드롭다운 패널도 동일 3존 구조로 컬럼 정렬.
// ⚠️ 하위 메뉴 경로는 각 도메인 담당자와 협의 후 확정 — 미정 경로는 '#'(TODO) 상태.
const NAV_MENUS = [
  { label: '따숨', items: [{ name: 'About', to: '#' }, { name: '서비스 안내', to: '#' }] },
  { label: '유기동물', items: [{ name: '유기동물조회', to: '/animals' }] },
  {
    label: '커뮤니티',
    items: [
      { name: '고양이', to: '/board?category=cat' },
      { name: '강아지', to: '/board?category=dog' },
      { name: '입양후기', to: '#' },
    ],
  },
  {
    label: '고객센터',
    items: [
      { name: '공지사항', to: '#' }, { name: 'Q&A', to: '#' },
      { name: 'FAQ', to: '#' }, { name: 'Contact', to: '#' },
    ],
  },
];

// 3존 고정폭 — 상단바와 드롭다운 패널이 같은 값을 공유해야 컬럼이 어긋나지 않는다
const LOGO_W = 'w-36';
const AUTH_W = 'w-48';

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = useAuthStore((s) => s.user);

  const open = (label: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveMenu(label);
  };
  // 바로 닫으면 메뉴→패널 이동 중 깜빡임 — 120ms 유예 (피그마 원본 UX 유지)
  const close = () => {
    leaveTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };
  const keep = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-white/95 shadow-sm backdrop-blur"
      onMouseLeave={close}
    >
      {/* ── 상단바 ── */}
      <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
        {/* 로고 */}
        <Link to="/" className={`${LOGO_W} flex shrink-0 items-center gap-2`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <PawPrint size={15} className="text-white" />
          </div>
          <span className="text-lg font-bold text-primary">따숨</span>
        </Link>

        {/* 네비 — 4등분, hover 시 메가 드롭다운 */}
        <nav className="hidden h-16 flex-1 items-stretch md:flex" aria-label="주 메뉴">
          {NAV_MENUS.map((menu) => {
            const isActive = activeMenu === menu.label;
            return (
              <button
                key={menu.label}
                onMouseEnter={() => open(menu.label)}
                className={`relative flex flex-1 items-center justify-center text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-foreground'
                }`}
              >
                {menu.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] w-full bg-primary transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* 인증 영역 — 로그인 상태 분기 */}
        <div className={`hidden ${AUTH_W} shrink-0 items-center justify-end gap-2 md:flex`}>
          {user ? <UserMenu nickname={user.nickname} /> : <GuestMenu />}
        </div>
      </div>

      {/* ── 메가 드롭다운 패널 — 상단바와 동일 3존 구조 ── */}
      {activeMenu && (
        <div className="absolute left-0 w-full border-t border-border bg-white" onMouseEnter={keep}>
          <div className="mx-auto flex max-w-6xl px-6 py-8">
            <div className={`${LOGO_W} shrink-0`} />
            <div className="flex flex-1">
              {NAV_MENUS.map((menu) => (
                <div
                  key={menu.label}
                  className="flex flex-1 flex-col items-center gap-1 border-r border-border px-4 last:border-r-0"
                >
                  {menu.items.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={() => setActiveMenu(null)}
                      className={`w-full rounded-lg py-2.5 text-center text-sm transition-colors hover:bg-secondary hover:text-primary ${
                        menu.label === activeMenu ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <div className={`${AUTH_W} shrink-0`} />
          </div>
        </div>
      )}
    </header>
  );
}

/** 비로그인: 로그인 / 회원가입 버튼 */
function GuestMenu() {
  return (
    <>
      <Button variant="outline" size="sm" className="rounded-full" asChild>
        <Link to="/login">로그인</Link>
      </Button>
      <Button size="sm" className="rounded-full" asChild>
        <Link to="/signup">회원가입</Link>
      </Button>
    </>
  );
}

/** 로그인: 닉네임(마이페이지 링크) + 로그아웃(확인 모달) */
function UserMenu({ nickname }: { nickname: string }) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await logout(); // RT 쿠키 삭제·블랙리스트는 서버 담당
    } catch {
      // 이미 만료된 세션 등으로 실패해도 클라이언트 상태는 정리한다 — 로그아웃은 실패해도 로그아웃
    } finally {
      clearAuth();
      toast.success('로그아웃 되었습니다.');
      navigate('/');
    }
  };

  return (
    <>
      <Link to="/mypage" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
        {nickname}님
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full">로그아웃</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃 하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>다시 로그인하면 언제든 이어서 이용할 수 있어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>로그아웃</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}