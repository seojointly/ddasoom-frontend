import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

// GUEST 전용 가드 — 소셜 추가정보 페이지(/signup/social).
// GUEST가 아닌 접근: 비로그인 → 로그인으로 / 이미 USER·ADMIN → 홈으로 (재승급 방지, 백엔드 MEMBER_002와 이중 방어)
export function RequireGuest() {
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const user = useAuthStore((s) => s.user);

  if (!isAuthReady) {
    return <div className="grid min-h-full place-items-center text-muted-foreground">로딩 중…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'GUEST') return <Navigate to="/" replace />;

  return <Outlet />;
}