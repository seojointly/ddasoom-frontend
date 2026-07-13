import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/authStore';
import { IncompleteProfileGate } from '@/shared/components/common/IncompleteProfileGate';

// USER 권한 가드(foster/apply, mypage 등 로그인 필요 경로).
// isAuthReady 이전에는 판단 금지 → 부트스트랩 완료 전에는 스피너만 노출(새로고침 시 튕김 방지).
// 판단은 authStore.user(role)로만. JWT를 직접 디코딩하지 않는다.
export function RequireAuth() {
  // ⚠️ 두 훅 모두 최상단에서 무조건 호출 — 이후의 early return과 무관하게 항상 같은 순서로 실행되어야 함
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const user = useAuthStore((s) => s.user);

  if (!isAuthReady) {
    // 부트스트랩(reissue 1회) 완료 전 — 가드 판단을 미루고 로딩만 표시.
    return (
      <div className="grid min-h-full place-items-center text-muted-foreground">로딩 중…</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // GUEST(소셜 가입 미완료) — 페이지 자체는 보여주되 모달로 막고 완료 유도.
  // 리다이렉트 대신 모달인 이유: "이 페이지가 존재한다"는 맥락은 유지한 채 다음 행동을 안내하기 위함.
  if (user.role === 'GUEST') {
    return <IncompleteProfileGate />;
  }

  return <Outlet />;
}