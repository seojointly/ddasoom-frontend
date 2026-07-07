import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';

// USER 권한 가드(README 라우트 표: foster/apply, mypage).
// CLAUDE.md 5절: isAuthReady 이전에는 판단 금지 → 부트스트랩 완료 전에는 스피너만 노출.
// 판단은 authStore.user(role)로만. JWT 디코딩 금지(2절).
export function RequireAuth() {
  const isAuthReady = useAuthStore((s) => s.isAuthReady);

  if (!isAuthReady) {
    // 부트스트랩(reissue 1회) 완료 전 — 가드 판단을 미루고 로딩만 표시.
    return (
      <div className="grid min-h-full place-items-center text-muted-foreground">로딩 중…</div>
    );
  }

  // TODO(백엔드 로그인/reissue API 확정 후): 비로그인 시 <Navigate to="/login" replace /> 로 리다이렉트.
  //   const user = useAuthStore.getState().user;
  //   if (!user) return <Navigate to="/login" replace />;
  // 지금은 가드 자리만 만들고 실제 리다이렉트는 보류(Part 2 범위: 자리 + 스피너까지).
  return <Outlet />;
}
