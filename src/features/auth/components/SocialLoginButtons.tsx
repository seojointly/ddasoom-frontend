// 소셜 로그인 버튼 3종 — ⚠️ axios 호출 금지: OAuth는 리다이렉트 체인이므로 반드시 "페이지 이동"(a 태그).
// 경로는 백엔드 커스텀 인가 시작점(/api 하위 — vite 프록시 경유). SECURITY-FLOW.md 2번 참고.
// 브랜드 색상은 각 사 디자인 가이드 공식 값 (카카오 #FEE500 / 네이버 #03C75A / 구글 흰색+테두리).
const SOCIAL_BUTTONS = [
  { provider: 'kakao', label: '카카오로 시작하기', className: 'bg-[#FEE500] text-[#191919] hover:brightness-95' },
  { provider: 'naver', label: '네이버로 시작하기', className: 'bg-[#03C75A] text-white hover:brightness-95' },
  { provider: 'google', label: '구글로 시작하기', className: 'border border-border bg-white text-foreground hover:bg-muted' },
] as const;

export function SocialLoginButtons() {
  return (
    <div className="space-y-2.5">
      {SOCIAL_BUTTONS.map(({ provider, label, className }) => (
        <a
          key={provider}
          href={`/api/oauth2/authorization/${provider}`}
          className={`flex w-full items-center justify-center rounded-xl py-3 text-base font-semibold transition-all ${className}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}